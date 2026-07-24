<?php

namespace Tests\Feature;

use App\Services\Resume\Exceptions\ResumeDownloadException;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\RecordingExceptionHandler;
use Tests\TestCase;

/**
 * Verify HEAD requests exercise the complete resume download contract.
 */
class ResumeHeadContractTest extends TestCase
{
    /**
     * The configured upstream URL used by the HTTP fakes.
     */
    private const RESUME_URL = 'https://docs.google.com/document/d/resume-id/export?format=pdf';

    /**
     * Verify HEAD performs the same upstream GET and PDF validation as a download.
     */
    public function test_head_executes_the_real_resume_validation_path(): void
    {
        $pdf = "%PDF-1.4\nportfolio resume";

        config(['resume.url' => self::RESUME_URL]);
        Http::fake([
            self::RESUME_URL => Http::response($pdf, 200, ['Content-Type' => 'application/pdf']),
        ]);

        $response = $this->head('/resume/download');

        $response->assertOk()
            ->assertHeader('Content-Type', 'application/octet-stream')
            ->assertHeader(
                'Content-Disposition',
                'attachment; filename="Kennen Lawrence - Resume.pdf"',
            )
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertContent('');
        $cacheControl = (string) $response->headers->get('Cache-Control');

        $this->assertStringContainsString('private', $cacheControl);
        $this->assertStringContainsString('no-store', $cacheControl);

        Http::assertSentCount(1);
        Http::assertSent(
            static fn (Request $request): bool => $request->method() === 'GET'
                && $request->url() === self::RESUME_URL,
        );
    }

    /**
     * Verify GET and HEAD preserve the same status and typed failure context.
     *
     * @param  array{reason: string, upstream_status?: int, content_class?: string}  $expectedContext
     */
    #[DataProvider('resumeFailureCases')]
    public function test_head_and_get_share_resume_failure_semantics(
        string $failure,
        int $expectedStatus,
        array $expectedContext,
        int $expectedUpstreamRequests,
    ): void {
        $reports = $this->recordExceptionReports();
        $this->prepareResumeFailure($failure);
        $this->expectResumeFailureLogs($expectedContext, 2);

        $getResponse = $this->get('/resume/download');
        $headResponse = $this->head('/resume/download');

        $getResponse->assertStatus($expectedStatus);
        $headResponse->assertStatus($expectedStatus)
            ->assertContent('');

        $this->assertCount(2, $reports->reported());

        $getException = $reports->reported()[0];
        $headException = $reports->reported()[1];

        $this->assertInstanceOf(ResumeDownloadException::class, $getException);
        $this->assertInstanceOf(ResumeDownloadException::class, $headException);
        $this->assertSame($getException::class, $headException::class);
        $this->assertSame($expectedContext, $getException->context());
        $this->assertSame($expectedContext, $headException->context());

        Http::assertSentCount($expectedUpstreamRequests);

        foreach (Http::recorded() as [$request]) {
            $this->assertSame('GET', $request->method());
        }
    }

    /**
     * Verify HEAD consumes the named composite limiter without reaching upstream.
     */
    public function test_head_uses_the_normal_resume_limiter(): void
    {
        $pdf = "%PDF-1.4\nportfolio resume";

        config([
            'resume.url' => self::RESUME_URL,
            'resume.rate_limits.per_ip' => 1,
            'resume.rate_limits.global' => 10,
        ]);
        Http::fake([
            self::RESUME_URL => Http::response($pdf, 200, ['Content-Type' => 'application/pdf']),
        ]);
        $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.10']);

        $this->get('/resume/download')->assertOk();
        $this->head('/resume/download')->assertStatus(429);

        Http::assertSentCount(1);
    }

    /**
     * Provide every closed resume failure category and expected contract.
     *
     * @return array<string, array{string, int, array{reason: string, upstream_status?: int, content_class?: string}, int}>
     */
    public static function resumeFailureCases(): array
    {
        return [
            'missing URL' => [
                'missing_url',
                503,
                ['reason' => 'missing_url'],
                0,
            ],
            'invalid URL' => [
                'invalid_url',
                503,
                ['reason' => 'invalid_url'],
                0,
            ],
            'unreachable upstream' => [
                'upstream_unavailable',
                502,
                ['reason' => 'upstream_unavailable'],
                2,
            ],
            'upstream response' => [
                'upstream_response',
                502,
                [
                    'reason' => 'upstream_response',
                    'upstream_status' => 503,
                ],
                2,
            ],
            'invalid PDF' => [
                'invalid_pdf',
                502,
                [
                    'reason' => 'invalid_pdf',
                    'upstream_status' => 200,
                    'content_class' => 'html',
                ],
                2,
            ],
        ];
    }

    /**
     * Record exceptions passed through Laravel's real report pipeline.
     */
    private function recordExceptionReports(): RecordingExceptionHandler
    {
        $reports = new RecordingExceptionHandler(
            $this->app->make(ExceptionHandler::class),
        );
        $this->app->instance(ExceptionHandler::class, $reports);

        return $reports;
    }

    /**
     * Arrange one closed resume failure at the HTTP boundary.
     */
    private function prepareResumeFailure(string $failure): void
    {
        if ($failure === 'missing_url') {
            config(['resume.url' => '']);
            Http::fake();

            return;
        }

        if ($failure === 'invalid_url') {
            config(['resume.url' => 'http://example.invalid/resume.pdf']);
            Http::fake();

            return;
        }

        config(['resume.url' => self::RESUME_URL]);

        if ($failure === 'upstream_unavailable') {
            Http::fake([
                self::RESUME_URL => Http::failedConnection(),
            ]);

            return;
        }

        if ($failure === 'upstream_response') {
            Http::fake([
                self::RESUME_URL => Http::response('Unavailable', 503),
            ]);

            return;
        }

        Http::fake([
            self::RESUME_URL => Http::response(
                '<!doctype html>',
                200,
                ['Content-Type' => 'text/html'],
            ),
        ]);
    }

    /**
     * Expect the closed operational record for both request methods.
     *
     * @param  array{reason: string, upstream_status?: int, content_class?: string}  $exceptionContext
     */
    private function expectResumeFailureLogs(array $exceptionContext, int $times): void
    {
        $context = [
            'event' => 'resume_download_failed',
            'component' => 'resume_download',
            ...$exceptionContext,
            'environment' => app()->environment(),
        ];
        $release = config('sentry.release');

        if (is_string($release) && $release !== '') {
            $context['release'] = $release;
        }

        Log::shouldReceive('channel')
            ->times($times)
            ->with('stderr')
            ->andReturnSelf();
        Log::shouldReceive('warning')
            ->times($times)
            ->with('resume_download_failed', $context);
    }
}
