<?php

namespace Tests\Feature;

use Tests\TestCase;

/**
 * Verify the final analytics and observability activation-readiness contract.
 */
class ObservabilityDocumentationTest extends TestCase
{
    /**
     * The maintainer-facing architecture and activation guide.
     */
    private const README_PATH = 'README.md';

    /**
     * The agent-facing architecture constraints.
     */
    private const AGENTS_PATH = 'AGENTS.md';

    /**
     * The resume incident and alert response guide.
     */
    private const RUNBOOK_PATH = 'docs/runbooks/resume-download.md';

    /**
     * The deployment-authoritative PHP dependency lockfile.
     */
    private const COMPOSER_LOCK_PATH = 'composer.lock';

    /**
     * Verify every telemetry signal has one explicit owner and trust boundary.
     */
    public function test_documentation_assigns_each_signal_and_trust_boundary(): void
    {
        $readme = $this->document(self::README_PATH);
        $agents = $this->document(self::AGENTS_PATH);

        $this->assertContainsAll($readme, [
            'GA4 owns browser-reported intent',
            'Sentry Error Monitoring owns Laravel exceptions',
            'Render owns deployment, container, bootstrap, and stderr evidence',
            'The Sentry uptime monitor owns sustained end-to-end resume availability',
            'No browser event proves humanity, authorization, or a completed device save',
            'commodity browser analytics',
            'Laravel still owns application behavior',
            'post-live smoke is detective',
            'recurring monitor detects later drift',
        ]);
        $this->assertContainsAll($agents, [
            'GA4 owns browser-reported intent',
            'Sentry Error Monitoring owns Laravel exceptions',
            'Render owns deployment, container, bootstrap, and stderr evidence',
            'uptime monitor owns sustained end-to-end resume availability',
            'No browser event proves humanity, authorization, or a completed device save',
        ]);
    }

    /**
     * Verify Structured Logs remains a deliberate future decision.
     */
    public function test_documentation_defers_structured_logs_until_square_off_catalog(): void
    {
        $readme = $this->document(self::README_PATH);
        $agents = $this->document(self::AGENTS_PATH);

        $this->assertContainsAll($readme, [
            'Error Monitoring only',
            '`sentry_logs`',
            '`LOG_STACK=stderr`',
            'Square Off operational catalog',
            'price, privacy, transport, and quota',
        ]);
        $this->assertContainsAll($agents, [
            'Error Monitoring only',
            'dormant `sentry_logs` channel',
            'outside the active stack',
            'Square Off operational catalog',
            'fresh Logs/cost/privacy activation decision',
        ]);
    }

    /**
     * Verify provider activation and incompatible rollback are staged safely.
     */
    public function test_documentation_requires_staged_provider_activation_and_safe_rollback(): void
    {
        $readme = $this->document(self::README_PATH);
        $runbook = $this->document(self::RUNBOOK_PATH);

        $this->assertSame(
            '4.27.0',
            $this->lockedComposerPackageVersion('sentry/sentry-laravel'),
        );
        $this->assertSame(
            '4.29.0',
            $this->lockedComposerPackageVersion('sentry/sentry'),
        );
        $this->assertContainsAll($readme, [
            '### Safe configuration matrix',
            '| `ANALYTICS_ENABLED` | `false` |',
            '| `GOOGLE_ANALYTICS_MEASUREMENT_ID` | blank |',
            '| `SENTRY_LARAVEL_DSN` / `SENTRY_DSN` | blank |',
            '| `SENTRY_ENABLE_LOGS` | `false` |',
            '| `LOG_CHANNEL` | `stack` |',
            '| `LOG_STACK` | `stderr` |',
            '| `SENTRY_SEND_DEFAULT_PII` | `false` |',
            '| `SENTRY_MAX_REQUEST_BODY_SIZE` | `none` |',
            '| `SENTRY_TRACES_SAMPLE_RATE` | `0` |',
            '| `SENTRY_PROFILES_SAMPLE_RATE` | `0` |',
            '| `CONTACT_RESUME_URL` | required in production; blank is the fail-closed default |',
            '`zend.exception_ignore_args=On`',
            '### GA4 activation gate',
            '### Sentry activation gate',
            'Deploy the compatible commit with both providers off',
            'separate owner approval',
            '`php artisan sentry:test`',
            'without `--transaction`',
            'transport proof only',
            'does not prove the application\'s final sanitizer',
            'application-generated events',
            '`sentry/sentry-laravel` `4.27.0`',
            '`sentry/sentry` `4.29.0`',
            '### Provider rollback order',
            'stage steps 1–4 without saving intermediate environment states',
            'compatible rollback unrelated to a provider incident, skip steps 1, 2, and 4',
            'Stage `ANALYTICS_ENABLED=false`',
            'Stage removal of `SENTRY_LARAVEL_DSN` and `SENTRY_DSN`',
            'stage removal of `GOOGLE_ANALYTICS_MEASUREMENT_ID`',
            'exactly one compatible environment-change deployment',
            'Do not trigger an additional concurrent deploy',
            'Do not change `CONTACT_RESUME_URL`',
        ]);
        $this->assertContainsAll($runbook, [
            'Before an incompatible rollback',
            '`ANALYTICS_ENABLED=false`',
            '`GOOGLE_ANALYTICS_MEASUREMENT_ID`, `SENTRY_LARAVEL_DSN`, and `SENTRY_DSN`',
            '`SENTRY_ENABLE_LOGS=false`',
            '`LOG_CHANNEL=stack`',
            '`LOG_STACK=stderr`',
            'pause the resume issue notification, uptime monitor, and uptime owner-email workflow',
            'Do not save intermediate environment states',
            'exactly one compatible environment-change deployment and wait until it is live',
            'do not trigger an additional concurrent deploy',
            'do not change `CONTACT_RESUME_URL`',
            'For a compatible rollback, leave provider environment values in place',
            'pause only the resume issue notification and uptime signal',
            'Restore only provider settings and signals that had separate approval and were enabled before the incident',
            'explicitly re-enable only the resume issue notification, uptime owner-email workflow, and Production monitor that were paused',
            'leave absent or pre-gate signals disabled',
            'Confirm the intended owner recipient',
            'When correction included a deployment, require the new post-live workflow smoke',
            'otherwise the repeated bounded `HEAD` check is the new recovery smoke',
        ]);
    }

    /**
     * Verify resume alerting has one bounded, non-duplicative lifecycle.
     */
    public function test_documentation_pins_bounded_resume_alert_and_monitor_semantics(): void
    {
        $readme = $this->document(self::README_PATH);
        $runbook = $this->document(self::RUNBOOK_PATH);

        $requiredMonitorContract = [
            'new or regressed',
            '`feature=resume_download`',
            '`environment=production`',
            'owner-email alert workflow',
            '`HEAD https://www.kennen.dev/resume/download`',
            'every 30 minutes',
            '`kennen-resume-uptime/1.0`',
            'expected status `200`',
            'two consecutive failures',
            'two consecutive successful checks',
            'no third log alert',
            '5,000 errors/month',
            'one uptime monitor',
            '30-day retention',
            'paid overage',
            'revalidate',
            'Release Gate 3',
            'one failure creates no issue or email',
            'one uptime issue and one owner email',
            'production cutover',
            'owner-controlled non-production target',
            'unauthenticated, query- and credential-free',
            'fixed non-sensitive headers/body',
            'same unchanged URL',
            'without a third-party request catcher',
            'If no such target',
            'keep it disabled',
            'without changing the monitor configuration',
            'Disable the monitor before retargeting it to the Production URL and environment',
            'confirm a successful production check',
            'email workflow',
            'one entitlement',
            'No-cost quota exhaustion can drop later Error events and owner emails',
            'whether uptime checks, issue lifecycle, and owner-email delivery remain available when Error quota is exhausted',
            'never treat Error-email delivery as guaranteed',
            'Render stderr as the unconditional fallback',
            'uptime as an independent fallback only after that confirmation',
        ];

        $this->assertContainsAll($readme, $requiredMonitorContract);
        $this->assertContainsAll($runbook, $requiredMonitorContract);
    }

    /**
     * Verify stored activation and incident evidence cannot expose sensitive values.
     */
    public function test_documentation_forbids_sensitive_activation_evidence(): void
    {
        $readme = $this->document(self::README_PATH);
        $agents = $this->document(self::AGENTS_PATH);
        $runbook = $this->document(self::RUNBOOK_PATH);
        $documentation = $readme."\n".$agents."\n".$runbook;

        $sharedEvidenceRules = [
            'Never store or publish',
            'Sentry DSN',
            'API key',
            'deploy-hook secret',
            '`CONTACT_RESUME_URL`',
            'PDF contents',
            'seeded sensitive values',
            'raw exception',
            'response body',
            'Tag Assistant',
            'DebugView',
            'automated tests to the production stream',
        ];

        $this->assertContainsAll($readme, [
            ...$sharedEvidenceRules,
            'raw response headers',
            'normalized status/header state',
        ]);
        $this->assertContainsAll($runbook, [
            ...$sharedEvidenceRules,
            'raw content-type value',
            'closed header-check result',
            'transient local inspection only',
            'store only that closed header-check result',
            'never the raw values',
        ]);

        $this->assertDoesNotMatchRegularExpression(
            '/https:\/\/[^@\s]+@[^\/\s]*sentry\.io\/\d+/',
            $documentation,
        );
        $this->assertDoesNotMatchRegularExpression(
            '/https:\/\/(?:docs|drive|drive\.usercontent)\.google\.com\/[^\s]*(?:\/d\/(?:e\/)?|[?&]id=)[A-Za-z0-9_-]{20,}/',
            $documentation,
        );
        $this->assertDoesNotMatchRegularExpression(
            '/\bprivate-[a-z0-9-]+\b|\bPRIVATE_[A-Z0-9_]+\b/',
            $documentation,
        );
        $this->assertDoesNotMatchRegularExpression(
            '/\bsntrys_[A-Za-z0-9_-]{20,}\b/',
            $documentation,
        );
        $this->assertDoesNotMatchRegularExpression(
            '/https:\/\/api\.render\.com\/deploy\/[^?\s]+\?key=[^&\s]+/',
            $documentation,
        );
    }

    /**
     * Read one exact package version from Composer's deployment lockfile.
     */
    private function lockedComposerPackageVersion(string $packageName): string
    {
        $lockfile = file_get_contents(base_path(self::COMPOSER_LOCK_PATH));

        $this->assertIsString($lockfile);

        $decoded = json_decode($lockfile, true, flags: JSON_THROW_ON_ERROR);

        $this->assertIsArray($decoded);
        $this->assertArrayHasKey('packages', $decoded);
        $this->assertIsArray($decoded['packages']);

        foreach ($decoded['packages'] as $package) {
            if (! is_array($package) || ($package['name'] ?? null) !== $packageName) {
                continue;
            }

            $version = $package['version'] ?? null;

            $this->assertIsString($version);

            return $version;
        }

        $this->fail("Composer package [{$packageName}] is not locked.");
    }

    /**
     * Read one tracked documentation artifact.
     */
    private function document(string $path): string
    {
        $document = file_get_contents(base_path($path));

        $this->assertIsString($document);

        $normalized = preg_replace('/\s+/', ' ', $document);

        $this->assertIsString($normalized);

        return $normalized;
    }

    /**
     * Assert every required fragment exists in one document.
     *
     * @param  list<string>  $fragments
     */
    private function assertContainsAll(string $document, array $fragments): void
    {
        foreach ($fragments as $fragment) {
            $this->assertStringContainsString($fragment, $document);
        }
    }
}
