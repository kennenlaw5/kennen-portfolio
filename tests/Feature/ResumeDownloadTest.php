<?php

namespace Tests\Feature;

use App\Http\Controllers\ResumeDownloadController;
use GuzzleHttp\Psr7\Response as Psr7Response;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Client\Response as ClientResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/**
 * Verify the same-origin resume download endpoint.
 */
class ResumeDownloadTest extends TestCase
{
    /**
     * The configured upstream URL used by the HTTP fakes.
     */
    private const RESUME_URL = 'https://docs.google.com/document/d/resume-id/export?format=pdf';

    /**
     * Verify the download route names its controller action explicitly.
     */
    public function test_the_route_uses_the_named_download_action(): void
    {
        $route = Route::getRoutes()->getByName('resume.download');

        $this->assertNotNull($route);
        $this->assertSame(ResumeDownloadController::class.'@download', $route->getActionName());
        $this->assertContains('throttle:resume-download', $route->gatherMiddleware());
    }

    /**
     * Verify analytics traffic cannot consume the resume throttle budget.
     */
    public function test_analytics_requests_do_not_consume_the_resume_download_limit(): void
    {
        $pdf = "%PDF-1.4\nportfolio resume";

        config(['resume.url' => self::RESUME_URL]);
        Http::fake([
            self::RESUME_URL => Http::response($pdf, 200, ['Content-Type' => 'application/pdf']),
        ]);

        for ($attempt = 0; $attempt < 30; $attempt++) {
            $this->postJson('/api/analytics/events', [
                'event' => 'page_view',
                'path' => '/',
            ])->assertNoContent();
        }

        $this->get('/resume/download')->assertOk();
        Http::assertSentCount(1);
    }

    /**
     * Verify the resume limit is enforced independently for forwarded clients.
     */
    public function test_trusted_forwarded_clients_receive_independent_resume_limits(): void
    {
        $pdf = "%PDF-1.4\nportfolio resume";

        config(['resume.url' => self::RESUME_URL]);
        Http::fake([
            self::RESUME_URL => Http::response($pdf, 200, ['Content-Type' => 'application/pdf']),
        ]);
        $this->withServerVariables(['REMOTE_ADDR' => '10.0.0.10']);

        for ($attempt = 0; $attempt < 30; $attempt++) {
            $this->get('/resume/download', ['X-Forwarded-For' => '203.0.113.10'])
                ->assertOk();
        }

        $this->get('/resume/download', ['X-Forwarded-For' => '203.0.113.10'])
            ->assertStatus(429);
        $this->get('/resume/download', ['X-Forwarded-For' => '203.0.113.11'])
            ->assertOk();

        Http::assertSentCount(31);
    }

    /**
     * Verify the global resume budget cannot be bypassed by changing client addresses.
     */
    public function test_the_resume_limit_includes_a_global_request_budget(): void
    {
        $pdf = "%PDF-1.4\nportfolio resume";

        config([
            'resume.url' => self::RESUME_URL,
            'resume.rate_limits.per_ip' => 10,
            'resume.rate_limits.global' => 2,
        ]);
        Http::fake([
            self::RESUME_URL => Http::response($pdf, 200, ['Content-Type' => 'application/pdf']),
        ]);
        $this->withServerVariables(['REMOTE_ADDR' => '10.0.0.10']);

        $this->get('/resume/download', ['X-Forwarded-For' => '203.0.113.10'])
            ->assertOk();
        $this->get('/resume/download', ['X-Forwarded-For' => '203.0.113.11'])
            ->assertOk();
        $this->get('/resume/download', ['X-Forwarded-For' => '203.0.113.12'])
            ->assertStatus(429);

        Http::assertSentCount(2);
    }

    /**
     * Verify only the forwarded client address and protocol affect request interpretation.
     */
    public function test_unneeded_forwarded_request_metadata_is_not_trusted(): void
    {
        Route::get('/test/proxy-metadata', static function (Request $request) {
            return response()->json([
                'ip' => $request->ip(),
                'host' => $request->host(),
                'scheme' => $request->getScheme(),
                'port' => $request->getPort(),
                'base_url' => $request->getBaseUrl(),
            ]);
        });

        $this->withServerVariables(['REMOTE_ADDR' => '10.0.0.10'])
            ->get('https://www.kennen.dev/test/proxy-metadata', [
                'X-Forwarded-For' => '203.0.113.55',
                'X-Forwarded-Proto' => 'https',
                'X-Forwarded-Host' => 'attacker.invalid',
                'X-Forwarded-Port' => '81',
                'X-Forwarded-Prefix' => '/spoofed',
            ])
            ->assertOk()
            ->assertExactJson([
                'ip' => '203.0.113.55',
                'host' => 'www.kennen.dev',
                'scheme' => 'https',
                'port' => 443,
                'base_url' => '',
            ]);
    }

    /**
     * Verify only public contact configuration is exposed to the browser.
     */
    public function test_it_keeps_the_upstream_url_out_of_browser_configuration(): void
    {
        config([
            'app.contact.email' => 'public@example.test',
            'resume.url' => self::RESUME_URL,
        ]);

        $this->get('/')
            ->assertOk()
            ->assertSee('public@example.test', false)
            ->assertDontSee('resume_url', false)
            ->assertDontSee(self::RESUME_URL, false);
    }

    /**
     * Verify a valid upstream PDF is returned as an attachment.
     */
    public function test_it_downloads_a_valid_configured_pdf(): void
    {
        $pdf = "%PDF-1.4\nportfolio resume";

        config(['resume.url' => self::RESUME_URL]);
        Http::fake([
            self::RESUME_URL => Http::response($pdf, 200, ['Content-Type' => 'application/pdf']),
        ]);

        $response = $this->get('/resume/download');

        $response->assertOk()
            ->assertDownload('Kennen Lawrence - Resume.pdf')
            ->assertHeader('Content-Type', 'application/octet-stream')
            ->assertContent($pdf);

        $this->assertStringContainsString('no-store', $response->headers->get('Cache-Control'));
        Http::assertSentCount(1);
        Http::assertSent(fn ($request) => $request->url() === self::RESUME_URL);
    }

    /**
     * Verify the HTTPS scheme comparison is case-insensitive.
     */
    public function test_it_accepts_an_uppercase_https_scheme(): void
    {
        $url = 'HTTPS://docs.google.com/document/d/resume-id/export?format=pdf';
        $pdf = "%PDF-1.4\nportfolio resume";

        config(['resume.url' => $url]);
        Http::fake([
            '*' => Http::response($pdf, 200, ['Content-Type' => 'application/pdf']),
        ]);

        $this->get('/resume/download')->assertOk();
        Http::assertSentCount(1);
    }

    /**
     * Verify missing and non-HTTPS configuration is rejected before an HTTP request.
     */
    #[DataProvider('invalidConfiguredUrls')]
    public function test_it_rejects_missing_or_non_https_configuration(string $url, string $reason): void
    {
        config(['resume.url' => $url]);
        Http::fake();
        Log::spy();

        $this->get('/resume/download')
            ->assertStatus(503)
            ->assertSeeText('Resume is temporarily unavailable.');

        Http::assertNothingSent();
        Log::shouldHaveReceived('warning')
            ->once()
            ->with('resume_download_failed', ['reason' => $reason]);
    }

    /**
     * Verify an unsuccessful upstream response becomes a controlled gateway error.
     */
    public function test_it_reports_an_upstream_http_failure(): void
    {
        config(['resume.url' => self::RESUME_URL]);
        Http::fake([
            self::RESUME_URL => Http::response('Unavailable', 503),
        ]);
        Log::spy();

        $this->get('/resume/download')
            ->assertStatus(502)
            ->assertSeeText('Resume download is temporarily unavailable.');

        Log::shouldHaveReceived('warning')
            ->once()
            ->with('resume_download_failed', [
                'reason' => 'upstream_response',
                'status' => 503,
            ]);
    }

    /**
     * Verify a connection failure becomes a controlled gateway error.
     */
    public function test_it_reports_an_unreachable_upstream(): void
    {
        config(['resume.url' => self::RESUME_URL]);
        Http::fake([
            self::RESUME_URL => Http::failedConnection(),
        ]);
        Log::spy();

        $this->get('/resume/download')
            ->assertStatus(502)
            ->assertSeeText('Resume download is temporarily unavailable.');

        Log::shouldHaveReceived('warning')
            ->once()
            ->with('resume_download_failed', ['reason' => 'upstream_unavailable']);
    }

    /**
     * Verify an upstream request exception becomes a controlled gateway error.
     */
    public function test_it_reports_an_upstream_request_failure(): void
    {
        config(['resume.url' => self::RESUME_URL]);
        Http::fake([
            self::RESUME_URL => function () {
                throw new RequestException(new ClientResponse(new Psr7Response(502)));
            },
        ]);
        Log::spy();

        $this->get('/resume/download')
            ->assertStatus(502)
            ->assertSeeText('Resume download is temporarily unavailable.');

        Log::shouldHaveReceived('warning')
            ->once()
            ->with('resume_download_failed', ['reason' => 'upstream_unavailable']);
    }

    /**
     * Verify responses that are not valid PDFs are rejected.
     */
    #[DataProvider('invalidPdfResponses')]
    public function test_it_rejects_an_invalid_pdf_response(string $body, string $contentType): void
    {
        config(['resume.url' => self::RESUME_URL]);
        Http::fake([
            self::RESUME_URL => Http::response($body, 200, ['Content-Type' => $contentType]),
        ]);
        Log::spy();

        $this->get('/resume/download')
            ->assertStatus(502)
            ->assertSeeText('Resume download is temporarily unavailable.');

        Log::shouldHaveReceived('warning')
            ->once()
            ->with('resume_download_failed', [
                'reason' => 'invalid_pdf',
                'status' => 200,
                'content_type' => $contentType,
            ]);
    }

    /**
     * Provide invalid configured resume URLs and their expected log reasons.
     *
     * @return array<string, array{string, string}>
     */
    public static function invalidConfiguredUrls(): array
    {
        return [
            'missing URL' => ['', 'missing_url'],
            'non-HTTPS URL' => ['http://example.com/resume.pdf', 'invalid_url'],
        ];
    }

    /**
     * Provide invalid upstream bodies and their reported content types.
     *
     * @return array<string, array{string, string}>
     */
    public static function invalidPdfResponses(): array
    {
        return [
            'HTML response' => ['<!doctype html>', 'text/html'],
            'mislabelled response' => ['not a PDF', 'application/pdf'],
        ];
    }
}
