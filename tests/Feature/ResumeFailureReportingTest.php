<?php

namespace Tests\Feature;

use App\Services\Observability\OperationalTelemetryLogger;
use App\Services\Observability\SentryTelemetrySanitizer;
use App\Services\Resume\Exceptions\ResumeConfigurationException;
use App\Services\Resume\Exceptions\ResumeDownloadException;
use GuzzleHttp\Psr7\Request as GuzzleRequest;
use GuzzleHttp\Psr7\Response as GuzzleResponse;
use Illuminate\Contracts\Debug\ExceptionHandler as ExceptionHandlerContract;
use Illuminate\Foundation\Exceptions\Handler as LaravelExceptionHandler;
use Illuminate\Foundation\Exceptions\ReportableHandler;
use Illuminate\Log\LogManager;
use Illuminate\Support\Facades\Http;
use Mockery;
use Monolog\Formatter\JsonFormatter;
use PHPUnit\Framework\Attributes\DataProvider;
use Psr\Log\NullLogger;
use ReflectionProperty;
use RuntimeException;
use Sentry\ClientBuilder;
use Sentry\Event;
use Sentry\EventHint;
use Sentry\Options;
use Sentry\SentrySdk;
use Sentry\Serializer\PayloadSerializer;
use Sentry\State\Hub;
use Sentry\State\HubInterface;
use Sentry\State\Scope;
use Sentry\Transport\TransportInterface;
use Tests\Support\InMemorySentryTransport;
use Tests\Support\RecordingExceptionHandler;
use Tests\Support\ThrowingSentryTransport;
use Tests\TestCase;

/**
 * Verify atomic typed resume reporting through Laravel, Sentry, and stderr.
 */
class ResumeFailureReportingTest extends TestCase
{
    /**
     * The configured upstream URL used by the HTTP fakes.
     */
    private const RESUME_URL = 'https://docs.google.com/document/d/resume-id/export?format=pdf';

    /**
     * The environment shared by the Sentry event and stderr record.
     */
    private const ENVIRONMENT = 'contract-test';

    /**
     * The release shared by the Sentry event and stderr record.
     */
    private const RELEASE = 'full-release-commit';

    /**
     * The Sentry hub that existed before a test installed an isolated client.
     */
    private HubInterface $originalHub;

    /**
     * Temporary path used to capture the configured stderr channel.
     */
    private string $stderrPath;

    /**
     * Preserve process-global Sentry state and prepare isolated stderr capture.
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->originalHub = SentrySdk::getCurrentHub();
        $stderrPath = tempnam(sys_get_temp_dir(), 'aro-008-stderr-');

        $this->assertNotFalse($stderrPath);
        $this->stderrPath = $stderrPath;
        $this->configureTelemetryContext();
        $this->configureCapturedStderr();
    }

    /**
     * Restore process-global state and remove the temporary log capture.
     */
    protected function tearDown(): void
    {
        SentrySdk::setCurrentHub($this->originalHub);

        if (isset($this->stderrPath) && is_file($this->stderrPath)) {
            unlink($this->stderrPath);
        }

        parent::tearDown();
    }

    /**
     * Verify every closed failure category crosses the report boundary exactly once.
     */
    #[DataProvider('resumeFailureCases')]
    public function test_each_resume_failure_is_reported_once(
        string $reason,
        int $expectedStatus,
        string $expectedMessage,
        ?int $expectedUpstreamStatus,
        ?string $expectedContentClass,
    ): void {
        $transport = $this->bindInMemorySentry();
        $reports = $this->recordExceptionReports();
        $this->prepareResumeFailure($reason);

        $response = $this->get('/resume/download');

        $response->assertStatus($expectedStatus)
            ->assertSeeText($expectedMessage)
            ->assertHeader('Content-Type', 'text/plain; charset=UTF-8');
        $this->assertStringContainsString(
            'no-store',
            (string) $response->headers->get('Cache-Control'),
        );

        $this->assertCount(1, $reports->reported());
        $this->assertInstanceOf(ResumeDownloadException::class, $reports->reported()[0]);
        $this->assertNull($reports->reported()[0]->getPrevious());
        $this->assertCount(1, $transport->envelopes());

        $payload = $this->decodeEnvelope($transport->envelopes()[0]);
        $this->assertClosedSentryPayload(
            $payload,
            $reason,
            $expectedUpstreamStatus,
            $expectedContentClass,
        );

        $records = $this->stderrRecords();
        $this->assertCount(1, $records);
        $this->assertClosedStderrRecord(
            $records[0],
            $reason,
            $expectedUpstreamStatus,
            $expectedContentClass,
        );
    }

    /**
     * Verify Sentry remains first and the typed stop callback remains last.
     */
    public function test_sentry_precedes_the_last_resume_stop_callback(): void
    {
        $order = [];
        $this->bindInMemorySentry(
            function (Event $event, ?EventHint $hint) use (&$order): ?Event {
                $order[] = 'sentry';

                return SentryTelemetrySanitizer::beforeSend($event, $hint);
            },
        );

        $operationalLogger = Mockery::mock(OperationalTelemetryLogger::class);
        $operationalLogger->shouldReceive('resumeDownloadFailed')
            ->once()
            ->andReturnUsing(function (ResumeDownloadException $exception) use (&$order): void {
                $order[] = 'resume_stop';
            });
        $this->app->instance(OperationalTelemetryLogger::class, $operationalLogger);

        $handler = $this->laravelExceptionHandler();
        $callbacks = $this->reportCallbacks($handler);
        $this->assertNotEmpty($callbacks);

        $lastCallback = $callbacks[array_key_last($callbacks)];
        $exception = ResumeConfigurationException::missingUrl();

        $this->assertTrue($callbacks[0]->handles($exception));
        $this->assertTrue($lastCallback->handles($exception));

        array_splice(
            $callbacks,
            -1,
            0,
            [new ReportableHandler(
                function (ResumeDownloadException $exception) use (&$order): void {
                    $order[] = 'intermediate';
                },
            )],
        );
        $this->setReportCallbacks($handler, $callbacks);

        $handler->report($exception);
        $handler->report($exception);

        $this->assertSame(['sentry', 'intermediate', 'resume_stop'], $order);
    }

    /**
     * Verify final Error and stderr payloads discard raw upstream and personal data.
     */
    #[DataProvider('invalidPdfContentClasses')]
    public function test_resume_error_envelope_and_stderr_are_sanitized(
        ?string $rawContentType,
        string $expectedContentClass,
    ): void {
        $privateUrl = 'https://private-user:private-password@upstream.invalid/resume.pdf?token=private-url-token';
        $privateBody = 'private-pdf-body';
        $privateEmail = 'private-owner@example.invalid';
        $privateCredential = 'private-bearer-token';

        config([
            'app.contact.email' => $privateEmail,
            'resume.url' => $privateUrl,
            'sentry.dsn' => 'https://private-dsn@example.invalid/1',
        ]);

        $transport = $this->bindInMemorySentry();
        SentrySdk::getCurrentHub()->configureScope(
            static function (Scope $scope) use (
                $privateBody,
                $privateCredential,
                $privateEmail,
                $privateUrl,
                $rawContentType,
            ): void {
                $scope->setTag('raw_upstream_url', $privateUrl);
                $scope->setTag('raw_content_type', $rawContentType ?? 'private-missing-content-type');
                $scope->setExtra('request', new GuzzleRequest(
                    'GET',
                    $privateUrl,
                    ['Authorization' => "Bearer {$privateCredential}"],
                ));
                $scope->setExtra(
                    'response',
                    new GuzzleResponse(200, ['Content-Type' => $rawContentType ?? ''], $privateBody),
                );
                $scope->setExtra('contact_email', $privateEmail);
            },
        );

        $headers = $rawContentType === null ? [] : ['Content-Type' => $rawContentType];
        Http::fake([
            $privateUrl => Http::response($privateBody, 200, $headers),
        ]);
        $reports = $this->recordExceptionReports();

        $this->get('/resume/download')
            ->assertStatus(502)
            ->assertSeeText('Resume download is temporarily unavailable.');

        $this->assertCount(1, $reports->reported());
        $this->assertCount(1, $transport->envelopes());

        $payload = $this->decodeEnvelope($transport->envelopes()[0]);
        $records = $this->stderrRecords();
        $this->assertCount(1, $records);
        $this->assertClosedSentryPayload(
            $payload,
            'invalid_pdf',
            200,
            $expectedContentClass,
        );
        $this->assertClosedStderrRecord(
            $records[0],
            'invalid_pdf',
            200,
            $expectedContentClass,
        );

        $serializedTelemetry = json_encode(
            ['sentry' => $payload, 'stderr' => $records],
            JSON_THROW_ON_ERROR,
        );

        foreach (array_filter([
            $privateUrl,
            $privateBody,
            $privateEmail,
            $privateCredential,
            $rawContentType,
            'private-missing-content-type',
            'private-user',
            'private-password',
            'private-url-token',
            'private-dsn',
        ]) as $prohibitedValue) {
            $this->assertStringNotContainsString($prohibitedValue, $serializedTelemetry);
        }
    }

    /**
     * Verify disabled and failing telemetry cannot replace controlled responses.
     */
    #[DataProvider('observabilityFailureCases')]
    public function test_observability_failures_preserve_resume_behavior(string $failure): void
    {
        $inMemoryTransport = null;
        $throwingTransport = null;

        if ($failure === 'blank_sentry') {
            SentrySdk::setCurrentHub(new Hub);
        } elseif ($failure === 'throwing_transport') {
            $throwingTransport = new ThrowingSentryTransport;
            $this->bindSentryTransport($throwingTransport);
        } elseif ($failure === 'throwing_sanitizer') {
            $sanitizer = Mockery::mock(SentryTelemetrySanitizer::class);
            $sanitizer->shouldReceive('sanitize')
                ->once()
                ->andThrow(new RuntimeException('private-sanitizer-failure'));
            $this->app->instance(SentryTelemetrySanitizer::class, $sanitizer);
            $inMemoryTransport = $this->bindInMemorySentry();
        } else {
            $inMemoryTransport = $this->bindInMemorySentry();
        }

        if ($failure === 'malformed_reporter') {
            $this->insertBeforeResumeStop(
                static function (ResumeDownloadException $exception): void {
                    new Options(['dsn' => 'malformed']);
                },
            );
        }

        if ($failure === 'throwing_logger') {
            $logManager = Mockery::mock(LogManager::class);
            $logManager->shouldReceive('channel')
                ->once()
                ->with('stderr')
                ->andThrow(new RuntimeException('private-logger-failure'));
            $this->app->instance(LogManager::class, $logManager);
        }

        $reports = $this->recordExceptionReports();
        config(['resume.url' => '']);
        Http::fake();

        $this->get('/resume/download')
            ->assertStatus(503)
            ->assertSeeText('Resume is temporarily unavailable.')
            ->assertHeader('Content-Type', 'text/plain; charset=UTF-8');

        $this->assertCount(1, $reports->reported());

        if ($throwingTransport !== null) {
            $this->assertSame(1, $throwingTransport->sendCount());
        }

        if ($failure !== 'throwing_logger') {
            $this->assertCount(1, $this->stderrRecords());
        }

        if ($inMemoryTransport !== null) {
            $expectedEnvelopes = in_array(
                $failure,
                ['throwing_sanitizer'],
                true,
            ) ? 0 : 1;
            $this->assertCount($expectedEnvelopes, $inMemoryTransport->envelopes());
        }
    }

    /**
     * Verify the resume stop callback does not intercept unrelated exceptions.
     */
    public function test_resume_stop_handler_does_not_capture_generic_exceptions(): void
    {
        $transport = $this->bindInMemorySentry();
        $handler = $this->laravelExceptionHandler();
        $callbacks = $this->reportCallbacks($handler);
        $lastCallback = $callbacks[array_key_last($callbacks)];
        $genericException = new RuntimeException('Safe generic fallback message.');

        $this->assertTrue($lastCallback->handles(ResumeConfigurationException::missingUrl()));
        $this->assertFalse($lastCallback->handles($genericException));

        $reports = $this->recordExceptionReports();
        report($genericException);

        $this->assertCount(1, $reports->reported());
        $this->assertCount(1, $transport->envelopes());

        $payload = $this->decodeEnvelope($transport->envelopes()[0]);
        $this->assertSame(
            'Safe generic fallback message.',
            $payload['exception']['values'][0]['value'] ?? null,
        );

        $records = $this->stderrRecords();
        $this->assertCount(1, $records);
        $this->assertSame('Safe generic fallback message.', $records[0]['message'] ?? null);
    }

    /**
     * Provide every closed resume failure category and expected contract.
     *
     * @return array<string, array{string, int, string, int|null, string|null}>
     */
    public static function resumeFailureCases(): array
    {
        return [
            'missing URL' => [
                'missing_url',
                503,
                'Resume is temporarily unavailable.',
                null,
                null,
            ],
            'invalid URL' => [
                'invalid_url',
                503,
                'Resume is temporarily unavailable.',
                null,
                null,
            ],
            'unreachable upstream' => [
                'upstream_unavailable',
                502,
                'Resume download is temporarily unavailable.',
                null,
                null,
            ],
            'upstream response' => [
                'upstream_response',
                502,
                'Resume download is temporarily unavailable.',
                503,
                null,
            ],
            'invalid PDF' => [
                'invalid_pdf',
                502,
                'Resume download is temporarily unavailable.',
                200,
                'html',
            ],
        ];
    }

    /**
     * Provide raw response content types and their closed classifications.
     *
     * @return array<string, array{string|null, string}>
     */
    public static function invalidPdfContentClasses(): array
    {
        return [
            'PDF declaration' => ['application/pdf; marker=private-pdf-marker', 'pdf'],
            'HTML declaration' => ['text/html; marker=private-html-marker', 'html'],
            'other declaration' => ['image/png; marker=private-other-marker', 'other'],
            'missing declaration' => [null, 'missing'],
        ];
    }

    /**
     * Provide controlled observability failures.
     *
     * @return array<string, array{string}>
     */
    public static function observabilityFailureCases(): array
    {
        return [
            'blank Sentry client' => ['blank_sentry'],
            'throwing transport' => ['throwing_transport'],
            'throwing sanitizer' => ['throwing_sanitizer'],
            'malformed reporter configuration' => ['malformed_reporter'],
            'throwing operational logger' => ['throwing_logger'],
        ];
    }

    /**
     * Configure environment and release values shared across telemetry surfaces.
     */
    private function configureTelemetryContext(): void
    {
        config([
            'app.env' => self::ENVIRONMENT,
            'sentry.environment' => self::ENVIRONMENT,
            'sentry.release' => self::RELEASE,
        ]);
    }

    /**
     * Route the named stderr channel to an isolated JSON-formatted file.
     */
    private function configureCapturedStderr(): void
    {
        config([
            'logging.default' => 'stack',
            'logging.channels.stack' => [
                'driver' => 'stack',
                'channels' => ['stderr'],
                'ignore_exceptions' => false,
            ],
            'logging.channels.stderr' => [
                'driver' => 'single',
                'path' => $this->stderrPath,
                'level' => 'debug',
                'replace_placeholders' => true,
                'formatter' => JsonFormatter::class,
            ],
        ]);

        $logManager = $this->app->make(LogManager::class);
        $logManager->forgetChannel('stack');
        $logManager->forgetChannel('stderr');
    }

    /**
     * Bind an isolated Sentry client with an in-memory transport.
     */
    private function bindInMemorySentry(?callable $beforeSend = null): InMemorySentryTransport
    {
        $options = $this->sentryOptions($beforeSend);
        $transport = new InMemorySentryTransport(new PayloadSerializer($options));
        $this->bindSentryClient($options, $transport);

        return $transport;
    }

    /**
     * Bind an isolated Sentry client around an arbitrary transport.
     */
    private function bindSentryTransport(TransportInterface $transport): void
    {
        $options = $this->sentryOptions();
        $this->bindSentryClient($options, $transport);
    }

    /**
     * Build the closed test options used by isolated Sentry clients.
     */
    private function sentryOptions(?callable $beforeSend = null): Options
    {
        return new Options([
            'before_send' => $beforeSend ?? [SentryTelemetrySanitizer::class, 'beforeSend'],
            'default_integrations' => false,
            'dsn' => 'https://public@example.invalid/1',
            'enable_logs' => false,
            'enable_metrics' => false,
            'environment' => self::ENVIRONMENT,
            'profiles_sample_rate' => 0.0,
            'release' => self::RELEASE,
            'send_default_pii' => false,
            'traces_sample_rate' => 0.0,
        ]);
    }

    /**
     * Install a Sentry client on an isolated process-global hub.
     */
    private function bindSentryClient(Options $options, TransportInterface $transport): void
    {
        $client = (new ClientBuilder($options))
            ->setLogger(new NullLogger)
            ->setTransport($transport)
            ->getClient();

        SentrySdk::setCurrentHub(new Hub($client));
    }

    /**
     * Decorate the application's exception handler so report cardinality is observable.
     */
    private function recordExceptionReports(): RecordingExceptionHandler
    {
        $handler = $this->app->make(ExceptionHandlerContract::class);
        $recordingHandler = new RecordingExceptionHandler($handler);
        $this->app->instance(ExceptionHandlerContract::class, $recordingHandler);

        return $recordingHandler;
    }

    /**
     * Return the application's concrete Laravel exception handler.
     */
    private function laravelExceptionHandler(): LaravelExceptionHandler
    {
        $handler = $this->app->make(ExceptionHandlerContract::class);
        $this->assertInstanceOf(LaravelExceptionHandler::class, $handler);

        return $handler;
    }

    /**
     * Read the ordered reportable callbacks from the locked Laravel handler.
     *
     * @return list<ReportableHandler>
     */
    private function reportCallbacks(LaravelExceptionHandler $handler): array
    {
        $property = new ReflectionProperty(LaravelExceptionHandler::class, 'reportCallbacks');

        /** @var list<ReportableHandler> $callbacks */
        $callbacks = $property->getValue($handler);

        return $callbacks;
    }

    /**
     * Replace the reportable callbacks for an ordering-contract test.
     *
     * @param  list<ReportableHandler>  $callbacks
     */
    private function setReportCallbacks(
        LaravelExceptionHandler $handler,
        array $callbacks,
    ): void {
        $property = new ReflectionProperty(LaravelExceptionHandler::class, 'reportCallbacks');
        $property->setValue($handler, $callbacks);
    }

    /**
     * Insert a typed callback immediately before the required resume stop handler.
     */
    private function insertBeforeResumeStop(callable $callback): void
    {
        $handler = $this->laravelExceptionHandler();
        $callbacks = $this->reportCallbacks($handler);

        array_splice($callbacks, -1, 0, [new ReportableHandler($callback)]);
        $this->setReportCallbacks($handler, $callbacks);
    }

    /**
     * Arrange one closed resume failure at the HTTP boundary.
     */
    private function prepareResumeFailure(string $reason): void
    {
        if ($reason === 'missing_url') {
            config(['resume.url' => '']);
            Http::fake();

            return;
        }

        if ($reason === 'invalid_url') {
            config(['resume.url' => 'http://example.invalid/resume.pdf']);
            Http::fake();

            return;
        }

        config(['resume.url' => self::RESUME_URL]);

        if ($reason === 'upstream_unavailable') {
            Http::fake([
                self::RESUME_URL => Http::failedConnection(),
            ]);

            return;
        }

        if ($reason === 'upstream_response') {
            Http::fake([
                self::RESUME_URL => Http::response('private-upstream-body', 503),
            ]);

            return;
        }

        Http::fake([
            self::RESUME_URL => Http::response(
                'private-invalid-pdf-body',
                200,
                ['Content-Type' => 'text/html; marker=private-html-marker'],
            ),
        ]);
    }

    /**
     * Decode the final serialized event item from a Sentry envelope.
     *
     * @return array<string, mixed>
     */
    private function decodeEnvelope(string $envelope): array
    {
        $lines = explode("\n", $envelope, 3);
        $this->assertCount(3, $lines);

        /** @var array<string, mixed> $payload */
        $payload = json_decode($lines[2], true, flags: JSON_THROW_ON_ERROR);

        return $payload;
    }

    /**
     * Decode every final JSON-formatted stderr record.
     *
     * @return list<array<string, mixed>>
     */
    private function stderrRecords(): array
    {
        $contents = trim((string) file_get_contents($this->stderrPath));

        if ($contents === '') {
            return [];
        }

        return array_map(
            static function (string $record): array {
                /** @var array<string, mixed> $decoded */
                $decoded = json_decode($record, true, flags: JSON_THROW_ON_ERROR);

                return $decoded;
            },
            preg_split('/\R/', $contents) ?: [],
        );
    }

    /**
     * Assert the final typed Sentry event contains only the closed resume mapping.
     *
     * @param  array<string, mixed>  $payload
     */
    private function assertClosedSentryPayload(
        array $payload,
        string $reason,
        ?int $upstreamStatus,
        ?string $contentClass,
    ): void {
        $this->assertCount(1, $payload['exception']['values'] ?? []);
        $this->assertSame([
            'feature' => 'resume_download',
            'failure_reason' => $reason,
            'environment' => self::ENVIRONMENT,
        ], $payload['tags'] ?? null);

        $expectedContext = $this->expectedClosedContext(
            $reason,
            $upstreamStatus,
            $contentClass,
        );
        $this->assertSame(
            $expectedContext,
            $payload['contexts']['resume_download'] ?? null,
        );
        $this->assertSame(self::ENVIRONMENT, $payload['environment'] ?? null);
        $this->assertSame(self::RELEASE, $payload['release'] ?? null);
    }

    /**
     * Assert the final operational stderr record contains the same closed mapping.
     *
     * @param  array<string, mixed>  $record
     */
    private function assertClosedStderrRecord(
        array $record,
        string $reason,
        ?int $upstreamStatus,
        ?string $contentClass,
    ): void {
        $this->assertSame('resume_download_failed', $record['message'] ?? null);
        $this->assertSame('WARNING', $record['level_name'] ?? null);
        $this->assertSame(
            $this->expectedClosedContext($reason, $upstreamStatus, $contentClass),
            $record['context'] ?? null,
        );
    }

    /**
     * Build the context shared by the Error event and stderr record.
     *
     * @return array<string, int|string>
     */
    private function expectedClosedContext(
        string $reason,
        ?int $upstreamStatus,
        ?string $contentClass,
    ): array {
        $context = [
            'event' => 'resume_download_failed',
            'component' => 'resume_download',
            'reason' => $reason,
        ];

        if ($upstreamStatus !== null) {
            $context['upstream_status'] = $upstreamStatus;
        }

        if ($contentClass !== null) {
            $context['content_class'] = $contentClass;
        }

        $context['environment'] = self::ENVIRONMENT;
        $context['release'] = self::RELEASE;

        return $context;
    }
}
