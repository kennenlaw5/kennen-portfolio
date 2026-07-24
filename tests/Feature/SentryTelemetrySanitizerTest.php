<?php

namespace Tests\Feature;

use App\Services\Observability\SentryTelemetrySanitizer;
use GuzzleHttp\Exception\ConnectException as GuzzleConnectException;
use GuzzleHttp\Exception\RequestException as GuzzleRequestException;
use GuzzleHttp\Psr7\Request as GuzzleRequest;
use GuzzleHttp\Psr7\Response as GuzzleResponse;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Database\QueryException;
use Illuminate\Http\Client\ConnectionException as LaravelConnectionException;
use Illuminate\Http\Client\RequestException as LaravelRequestException;
use Illuminate\Http\Client\Response as LaravelResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Mockery;
use PDOException;
use RuntimeException;
use Sentry\Breadcrumb;
use Sentry\ClientBuilder;
use Sentry\Context\OsContext;
use Sentry\Context\RuntimeContext;
use Sentry\Event;
use Sentry\EventHint;
use Sentry\ExceptionDataBag;
use Sentry\Frame;
use Sentry\Options;
use Sentry\Serializer\PayloadSerializer;
use Sentry\Stacktrace;
use Sentry\State\Scope;
use Sentry\UserDataBag;
use Tests\Support\InMemorySentryTransport;
use Tests\TestCase;
use Throwable;

/**
 * Verify the final Sentry Error-event privacy boundary.
 */
class SentryTelemetrySanitizerTest extends TestCase
{
    /**
     * Verify safe code-owned exception evidence survives final SDK serialization.
     */
    public function test_safe_generic_messages_survive_final_sentry_serialization(): void
    {
        $event = Event::createEvent();
        $event->setFingerprint(['safe-code-group']);
        $event->setTransaction('portfolio.background-task');

        $payload = $this->capturePayload(
            $this->withTrace(new RuntimeException('A safe diagnostic message remains useful.')),
            event: $event,
        );

        $exception = $payload['exception']['values'][0] ?? [];

        $this->assertSame('A safe diagnostic message remains useful.', $exception['value'] ?? null);
        $this->assertSame(RuntimeException::class, $exception['type'] ?? null);
        $this->assertNotEmpty($exception['stacktrace']['frames'] ?? []);
        $this->assertArrayHasKey('filename', $exception['stacktrace']['frames'][0]);
        $this->assertArrayHasKey('lineno', $exception['stacktrace']['frames'][0]);
        $this->assertSame('contract-test', $payload['environment'] ?? null);
        $this->assertSame('full-release-commit', $payload['release'] ?? null);
        $this->assertSame(['safe-code-group'], $payload['fingerprint'] ?? null);
        $this->assertSame('portfolio.background-task', $payload['transaction'] ?? null);
    }

    /**
     * Verify prohibited request, identity, credential, and object values cannot reach the event payload.
     */
    public function test_final_sentry_envelopes_remove_prohibited_context(): void
    {
        $configuredResumeUrl = 'https://resume.invalid/export?document=private-document';
        $configuredDsn = 'https://configured-public-key@sentry.invalid/42';
        $contactEmail = 'private-owner@example.invalid';
        $contactState = 'ZX';
        $applicationKey = 'base64:private-laravel-application-key';
        $previousApplicationKey = 'base64:private-previous-laravel-key';
        $secondPreviousApplicationKey = 'base64:private-second-previous-laravel-key';
        $queriedUrl = 'https://api.invalid/resource?access_token=query-secret';
        $nonHttpUrl = 's3://private-bucket/private-object?token=private-object-token';
        $credential = 'opaque-bearer-credential';
        $basicCredential = 'dXNlcjpwYXNz';
        $digestCredential = 'private-digest-response';
        $jsonCredential = 'private-json-token';
        $multiWordCredential = 'private alpha beta';
        $cookieCredential = 'private-cookie-credential';
        $databasePassword = 'private-database-password';
        $cloudAccessKey = 'private-cloud-access-key';
        $sentryAuthToken = 'private-sentry-auth-token';
        $phpArrayCredential = 'private-php-array-credential';
        $camelDatabasePassword = 'private-camel-database-password';
        $camelAccessToken = 'private-camel-access-token';
        $camelClientSecret = 'private-camel-client-secret';
        $genericSecretKey = 'private-generic-secret-key';
        $privateKey = 'private-private-key';
        $encryptionKey = 'private-encryption-key';
        $tagPassword = 'private-tag-password';
        $tagApiKey = 'private-tag-api-key';
        $tagCookie = 'private-tag-cookie';
        $tagApplicationKey = 'private-tag-application-key';
        $tagSecretKey = 'private-tag-secret-key';
        $tagPrivateKey = 'private-tag-private-key';
        $moduleEncryptionKey = 'private-module-encryption-key';
        $moduleCredential = 'private-module-credential';
        $automaticServerName = '203.0.113.77';
        $frameArgument = 'private-frame-argument';
        $traceIdentifier = '0123456789abcdef0123456789abcdef';
        $baggageValue = 'sentry-public_key=baggage-secret';

        config([
            'app.key' => $applicationKey,
            'app.previous_keys' => [
                $previousApplicationKey,
                $secondPreviousApplicationKey,
            ],
            'app.contact.email' => $contactEmail,
            'app.contact.state_abbreviation' => $contactState,
            'resume.url' => $configuredResumeUrl,
            'sentry.dsn' => $configuredDsn,
        ]);

        $exception = new RuntimeException(
            "Failed to refresh {$configuredResumeUrl} for {$contactEmail}; "
            ."contact state {$contactState}; Authorization: Bearer {$credential}; "
            ."requested {$queriedUrl}; object {$nonHttpUrl}; "
            ."current encryption material {$applicationKey}; "
            ."previous encryption material {$previousApplicationKey}",
        );
        $unsafeFrame = new Frame(
            'unsafeOperation',
            '/var/www/app/UnsafeOperation.php',
            73,
            absoluteFilePath: '/var/www/app/UnsafeOperation.php',
            vars: [
                'argument' => $frameArgument,
                'request' => new GuzzleRequest('GET', $queriedUrl),
            ],
        );
        $event = Event::createEvent();
        $event->setExceptions([
            new ExceptionDataBag($exception, new Stacktrace([$unsafeFrame])),
        ]);
        $event->setMessage(
            "Contact {$contactEmail}; Authorization: Basic {$basicCredential}; "
            .'Proxy-Authorization: Digest username="private-user", '
            ."response=\"{$digestCredential}\"; "
            ."payload {\"access_token\":\"{$jsonCredential}\"}; "
            ."password=\"{$multiWordCredential}\"\n"
            ."Cookie: session={$cookieCredential}; preference=private-cookie-preference\n"
            ."DB_PASSWORD={$databasePassword}; AWS_SECRET_ACCESS_KEY={$cloudAccessKey}; "
            ."SENTRY_AUTH_TOKEN={$sentryAuthToken}; "
            ."config ['api_key' => '{$phpArrayCredential}']; "
            ."dbPassword={$camelDatabasePassword}; "
            ."payload {\"accessToken\":\"{$camelAccessToken}\"}; "
            ."clientSecret={$camelClientSecret}; "
            ."APP_KEY={$applicationKey}; SECRET_KEY={$genericSecretKey}; "
            ."PRIVATE_KEY={$privateKey}; encryption_key={$encryptionKey}; "
            ."APP_PREVIOUS_KEYS={$secondPreviousApplicationKey}",
        );
        $event->setRequest([
            'url' => $queriedUrl,
            'query_string' => 'access_token=query-secret',
            'headers' => [
                'Authorization' => "Bearer {$credential}",
                'Cookie' => 'session=private-session',
                'User-Agent' => 'Private User Agent',
                'Referer' => $configuredResumeUrl,
                'sentry-trace' => $traceIdentifier.'-0123456789abcdef-1',
                'traceparent' => '00-'.$traceIdentifier.'-0123456789abcdef-01',
                'baggage' => $baggageValue,
            ],
            'data' => ['password' => 'request-body-secret'],
            'env' => ['REMOTE_ADDR' => '203.0.113.99'],
        ]);
        $event->setContext('trace', [
            'trace_id' => $traceIdentifier,
            'baggage' => $baggageValue,
        ]);
        $event->setContext('unsafe_object', [
            'request' => new GuzzleRequest('GET', $queriedUrl),
            'response' => new GuzzleResponse(500, [], 'private-response-body'),
            'exception' => new RuntimeException('private-nested-exception'),
        ]);
        $event->setExtra([
            'request' => new GuzzleRequest('GET', $queriedUrl),
            'response' => new GuzzleResponse(500, [], 'private-response-body'),
            'throwable' => new RuntimeException('private-nested-exception'),
        ]);
        $event->setTags([
            'safe_tag' => 'stable',
            'unsafe_tag' => $contactEmail,
            'PASSWORD' => $tagPassword,
            'apiKey' => $tagApiKey,
            'Cookie' => $tagCookie,
            'APP_KEY' => $tagApplicationKey,
            'secretKey' => $tagSecretKey,
            'privateKey' => $tagPrivateKey,
        ]);
        $event->setModules([
            'safe-module' => '1.2.3',
            'DB_PASSWORD' => $moduleCredential,
            'encryption_key' => $moduleEncryptionKey,
        ]);
        $event->setServerName($automaticServerName);
        $event->setOsContext(new OsContext(
            'private-os',
            version: $configuredResumeUrl,
            build: $jsonCredential,
        ));
        $event->setRuntimeContext(new RuntimeContext(
            'private-runtime',
            version: $contactEmail,
            sapi: $credential,
        ));
        $event->setFingerprint(['safe-code-group', $configuredResumeUrl]);
        $event->setUser(new UserDataBag(
            'private-user-id',
            $contactEmail,
            $contactState,
            '203.0.113.99',
            'private-user',
        ));
        $event->setBreadcrumb([
            new Breadcrumb(
                Breadcrumb::LEVEL_INFO,
                Breadcrumb::TYPE_HTTP,
                'http',
                "Requested {$queriedUrl}",
                ['token' => $credential],
            ),
        ]);

        $payload = $this->capturePayload($exception, event: $event);
        $serializedPayload = json_encode($payload, JSON_THROW_ON_ERROR);

        foreach ([
            $configuredResumeUrl,
            $configuredDsn,
            $contactEmail,
            $contactState,
            $applicationKey,
            $previousApplicationKey,
            $secondPreviousApplicationKey,
            $queriedUrl,
            $nonHttpUrl,
            $credential,
            $basicCredential,
            $digestCredential,
            $jsonCredential,
            $multiWordCredential,
            $cookieCredential,
            'private-cookie-preference',
            $databasePassword,
            $cloudAccessKey,
            $sentryAuthToken,
            $phpArrayCredential,
            $camelDatabasePassword,
            $camelAccessToken,
            $camelClientSecret,
            $genericSecretKey,
            $privateKey,
            $encryptionKey,
            $tagPassword,
            $tagApiKey,
            $tagCookie,
            $tagApplicationKey,
            $tagSecretKey,
            $tagPrivateKey,
            $moduleCredential,
            $moduleEncryptionKey,
            $automaticServerName,
            $frameArgument,
            $traceIdentifier,
            $baggageValue,
            'query-secret',
            'private-session',
            'Private User Agent',
            'request-body-secret',
            '203.0.113.99',
            'private-response-body',
            'private-nested-exception',
            'private-user-id',
            'private-user',
        ] as $prohibitedValue) {
            $this->assertStringNotContainsString($prohibitedValue, $serializedPayload);
        }

        $this->assertArrayNotHasKey('request', $payload);
        $this->assertArrayNotHasKey('user', $payload);
        $this->assertArrayNotHasKey('breadcrumbs', $payload);
        $this->assertArrayNotHasKey('extra', $payload);
        $this->assertArrayNotHasKey('trace', $payload['contexts'] ?? []);
        $this->assertArrayNotHasKey('unsafe_object', $payload['contexts'] ?? []);
        $this->assertArrayNotHasKey('os', $payload['contexts'] ?? []);
        $this->assertArrayNotHasKey('runtime', $payload['contexts'] ?? []);
        $this->assertSame('stable', $payload['tags']['safe_tag'] ?? null);
        $this->assertSame('[redacted]', $payload['tags']['unsafe_tag'] ?? null);
        $this->assertSame('[redacted]', $payload['tags']['PASSWORD'] ?? null);
        $this->assertSame('[redacted]', $payload['tags']['apiKey'] ?? null);
        $this->assertSame('[redacted]', $payload['tags']['Cookie'] ?? null);
        $this->assertSame('[redacted]', $payload['tags']['APP_KEY'] ?? null);
        $this->assertSame('[redacted]', $payload['tags']['secretKey'] ?? null);
        $this->assertSame('[redacted]', $payload['tags']['privateKey'] ?? null);
        $this->assertSame('1.2.3', $payload['modules']['safe-module'] ?? null);
        $this->assertSame('[redacted]', $payload['modules']['DB_PASSWORD'] ?? null);
        $this->assertSame('[redacted]', $payload['modules']['encryption_key'] ?? null);
        $this->assertArrayNotHasKey('server_name', $payload);
        $this->assertSame('safe-code-group', $payload['fingerprint'][0] ?? null);
        $this->assertStringContainsString(
            '[redacted]',
            $payload['exception']['values'][0]['value'] ?? '',
        );
        $this->assertArrayNotHasKey(
            'vars',
            $payload['exception']['values'][0]['stacktrace']['frames'][0] ?? [],
        );
    }

    /**
     * Verify locked HTTP-client and database exception families use code-owned messages.
     */
    public function test_risky_infrastructure_exception_messages_are_replaced(): void
    {
        $request = new GuzzleRequest(
            'POST',
            'https://private-user:private-password@upstream.invalid/path?token=private-token',
            ['Authorization' => 'Bearer private-token'],
            'private-request-body',
        );
        $response = new GuzzleResponse(500, [], 'private-response-body');
        $laravelResponse = new LaravelResponse($response);
        $pdoException = new PDOException('SQLSTATE secret database-password');

        $cases = [
            [
                new LaravelRequestException($laravelResponse, false),
                SentryTelemetrySanitizer::OUTBOUND_HTTP_FAILURE_MESSAGE,
            ],
            [
                new LaravelConnectionException(
                    'Connection failed for https://upstream.invalid?token=private-token',
                ),
                SentryTelemetrySanitizer::OUTBOUND_HTTP_FAILURE_MESSAGE,
            ],
            [
                new GuzzleRequestException(
                    'Request exposed private-token and private-response-body',
                    $request,
                    $response,
                ),
                SentryTelemetrySanitizer::OUTBOUND_HTTP_FAILURE_MESSAGE,
            ],
            [
                new GuzzleConnectException(
                    'Connection exposed private-token',
                    $request,
                ),
                SentryTelemetrySanitizer::OUTBOUND_HTTP_FAILURE_MESSAGE,
            ],
            [
                new QueryException(
                    'mysql',
                    'select * from users where email = ? and password = ?',
                    ['private-owner@example.invalid', 'database-password'],
                    $pdoException,
                    [
                        'host' => 'private-db.invalid',
                        'database' => 'private_database',
                    ],
                ),
                SentryTelemetrySanitizer::DATABASE_FAILURE_MESSAGE,
            ],
            [
                new PDOException('SQLSTATE private query database-password'),
                SentryTelemetrySanitizer::DATABASE_FAILURE_MESSAGE,
            ],
        ];

        foreach ($cases as [$exception, $expectedMessage]) {
            $event = Event::createEvent();
            $event->setMessage($exception->getMessage());
            $payload = $this->capturePayload($this->withTrace($exception), event: $event);
            $matchingException = collect($payload['exception']['values'] ?? [])
                ->firstWhere('type', $exception::class);

            $this->assertIsArray($matchingException, $exception::class);
            $this->assertSame($expectedMessage, $matchingException['value'] ?? null);
            $this->assertSame($expectedMessage, $payload['message'] ?? null);
            $this->assertNotEmpty($matchingException['stacktrace']['frames'] ?? []);

            $serializedPayload = json_encode($payload, JSON_THROW_ON_ERROR);
            foreach ([
                'private-token',
                'private-password',
                'private-request-body',
                'private-response-body',
                'private-owner@example.invalid',
                'database-password',
                'private-db.invalid',
                'private_database',
            ] as $prohibitedValue) {
                $this->assertStringNotContainsString($prohibitedValue, $serializedPayload);
            }
        }
    }

    /**
     * Verify an internal sanitizer failure drops only the remote event.
     */
    public function test_throwing_sanitizer_drops_only_remote_event(): void
    {
        $sanitizer = Mockery::mock(SentryTelemetrySanitizer::class);
        $sanitizer->shouldReceive('sanitize')
            ->twice()
            ->andThrow(new RuntimeException('private-sanitizer-failure'));
        $this->app->instance(SentryTelemetrySanitizer::class, $sanitizer);

        $originalLogger = Log::getFacadeRoot();
        Log::spy();

        $this->assertNull(SentryTelemetrySanitizer::beforeSend(
            Event::createEvent(),
            EventHint::fromArray([
                'exception' => new RuntimeException('Application exception for drop proof.'),
            ]),
        ));

        foreach ([
            'emergency',
            'alert',
            'critical',
            'error',
            'warning',
            'notice',
            'info',
            'debug',
            'log',
        ] as $level) {
            Log::shouldNotHaveReceived($level);
        }

        Log::swap($originalLogger);
        Log::spy();

        $laterCallbackRan = false;
        $this->app->make(ExceptionHandler::class)->reportable(
            function (RuntimeException $exception) use (&$laterCallbackRan): void {
                if ($exception->getMessage() === 'Application exception for isolation proof.') {
                    $laterCallbackRan = true;
                }
            },
        );
        Route::get('/__test/sentry-sanitizer-failure', static function () {
            report(new RuntimeException('Application exception for isolation proof.'));

            return response('normal handling continued', 202);
        });

        $this->get('/__test/sentry-sanitizer-failure')
            ->assertStatus(202)
            ->assertSeeText('normal handling continued');

        $this->assertTrue($laterCallbackRan);
    }

    /**
     * Verify deferred Sentry products and unsafe automatic context stay absent.
     */
    public function test_sentry_error_envelope_contains_no_deferred_product_payloads(): void
    {
        $this->assertFalse(config('sentry.enable_logs'));
        $this->assertFalse(config('sentry.enable_metrics'));
        $this->assertSame(0.0, config('sentry.traces_sample_rate'));
        $this->assertSame(0.0, config('sentry.profiles_sample_rate'));
        $this->assertSame(0, config('sentry.max_breadcrumbs'));
        $this->assertNotContains(true, config('sentry.breadcrumbs'));
        $this->assertNotContains(true, config('sentry.tracing'));
        $this->assertSame(
            [SentryTelemetrySanitizer::class, 'beforeSend'],
            config('sentry.before_send'),
        );
        $this->assertSame(
            false,
            config('sentry.default_integrations'),
        );

        $event = Event::createEvent();
        $event->setBreadcrumb([
            new Breadcrumb(
                Breadcrumb::LEVEL_INFO,
                Breadcrumb::TYPE_DEFAULT,
                'deferred',
                'Deferred breadcrumb',
            ),
        ]);
        $event->setContext('trace', [
            'trace_id' => '0123456789abcdef0123456789abcdef',
            'span_id' => '0123456789abcdef',
        ]);

        $payload = $this->capturePayload(
            $this->withTrace(new RuntimeException('Safe Error Monitoring event.')),
            event: $event,
        );

        foreach ([
            'breadcrumbs',
            'spans',
            'profile',
            'logs',
            'metrics',
            'attachments',
            'replay',
            'feedback',
        ] as $deferredPayload) {
            $this->assertArrayNotHasKey($deferredPayload, $payload);
        }

        $this->assertArrayNotHasKey('trace', $payload['contexts'] ?? []);
    }

    /**
     * Capture one exception through the SDK and return its final serialized event item.
     *
     * @return array<string, mixed>
     */
    private function capturePayload(
        Throwable $exception,
        ?Scope $scope = null,
        ?Event $event = null,
    ): array {
        $beforeSend = config('sentry.before_send');

        $this->assertIsCallable($beforeSend);

        $options = new Options([
            'before_send' => $beforeSend,
            'dsn' => 'https://public@example.invalid/1',
            'enable_logs' => false,
            'enable_metrics' => false,
            'environment' => 'contract-test',
            'profiles_sample_rate' => 0.0,
            'release' => 'full-release-commit',
            'send_default_pii' => false,
            'traces_sample_rate' => 0.0,
        ]);
        $transport = new InMemorySentryTransport(new PayloadSerializer($options));
        $client = (new ClientBuilder($options))
            ->setTransport($transport)
            ->getClient();

        $client->captureEvent(
            $event ?? Event::createEvent(),
            EventHint::fromArray(['exception' => $exception]),
            $scope,
        );

        $this->assertCount(1, $transport->envelopes());

        $lines = explode("\n", $transport->envelopes()[0], 3);
        $this->assertCount(3, $lines);

        /** @var array<string, mixed> $payload */
        $payload = json_decode($lines[2], true, flags: JSON_THROW_ON_ERROR);

        return $payload;
    }

    /**
     * Throw and catch an exception so the SDK has a meaningful application frame.
     */
    private function withTrace(Throwable $exception): Throwable
    {
        try {
            throw $exception;
        } catch (Throwable $caught) {
            return $caught;
        }
    }
}
