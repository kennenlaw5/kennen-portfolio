<?php

namespace Tests\Feature;

use PHPUnit\Framework\Attributes\DataProvider;
use Symfony\Component\Process\Process;
use Tests\TestCase;

/**
 * Verify the public, behaviorally inert analytics configuration contract.
 */
class AnalyticsConfigurationTest extends TestCase
{
    /**
     * Verify local, test, disabled, and malformed enabled values fail closed.
     */
    #[DataProvider('inertAnalyticsEnvironments')]
    public function test_analytics_configuration_fails_closed(
        string $environment,
        string $enabled,
    ): void {
        $analytics = $this->loadAnalyticsConfig($environment, $enabled);

        $this->assertFalse($analytics['enabled']);
    }

    /**
     * Verify production may expose an explicitly enabled public configuration.
     */
    public function test_production_analytics_configuration_can_be_enabled(): void
    {
        $analytics = $this->loadAnalyticsConfig('production', 'true');

        $this->assertTrue($analytics['enabled']);
        $this->assertSame('G-TEST1234', $analytics['measurement_id']);
    }

    /**
     * Verify the SPA shell exposes only the intended public analytics values.
     */
    public function test_only_public_analytics_configuration_reaches_the_browser(): void
    {
        $contact = [
            'phone' => '555-555-5555',
            'email' => 'public@example.test',
            'linkedin_url' => 'https://www.linkedin.com/in/example',
            'github_url' => 'https://github.com/example',
            'city' => 'Denver',
            'state_abbreviation' => 'CO',
        ];
        $analytics = [
            'enabled' => true,
            'measurement_id' => 'G-TEST1234',
        ];
        $privateResumeUrl = 'https://private.example.test/resume.pdf';
        $privateSentryDsn = 'https://private@example.ingest.sentry.io/123';

        config([
            'app.contact' => $contact,
            'analytics' => $analytics,
            'resume.url' => $privateResumeUrl,
            'sentry.dsn' => $privateSentryDsn,
        ]);

        $content = $this->get('/')->assertOk()->getContent();

        $this->assertIsString($content);
        $matched = preg_match("/window\\.APP_CONFIG = JSON\\.parse\\('(.+)'\\);/", $content, $matches);

        $this->assertSame(1, $matched);

        /** @var string $serializedJson */
        $serializedJson = json_decode('"'.$matches[1].'"', true, flags: JSON_THROW_ON_ERROR);

        /** @var array<string, mixed> $publicConfig */
        $publicConfig = json_decode($serializedJson, true, flags: JSON_THROW_ON_ERROR);

        $this->assertSame([...$contact, 'analytics' => $analytics], $publicConfig);
        $this->assertStringNotContainsString($privateResumeUrl, $content);
        $this->assertStringNotContainsString($privateSentryDsn, $content);
    }

    /**
     * Provide runtime environments that must keep analytics inert.
     *
     * @return array<string, array{string, string}>
     */
    public static function inertAnalyticsEnvironments(): array
    {
        return [
            'local environment' => ['local', 'true'],
            'test environment' => ['testing', 'true'],
            'disabled production' => ['production', 'false'],
            'malformed enabled value' => ['production', 'not-a-boolean'],
        ];
    }

    /**
     * Load analytics configuration in an isolated application environment.
     *
     * @return array{enabled: bool, measurement_id: string}
     */
    private function loadAnalyticsConfig(string $environment, string $enabled): array
    {
        $code = <<<'PHP'
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();
echo json_encode($app->make(\Illuminate\Contracts\Config\Repository::class)->get('analytics'), JSON_THROW_ON_ERROR);
PHP;

        $process = new Process(
            [PHP_BINARY, '-r', $code],
            base_path(),
            [
                'ANALYTICS_ENABLED' => $enabled,
                'APP_ENV' => $environment,
                'GOOGLE_ANALYTICS_MEASUREMENT_ID' => 'G-TEST1234',
                'SENTRY_DSN' => '',
                'SENTRY_LARAVEL_DSN' => '',
            ],
        );
        $process->mustRun();

        /** @var array{enabled: bool, measurement_id: string} $analytics */
        $analytics = json_decode($process->getOutput(), true, flags: JSON_THROW_ON_ERROR);

        return $analytics;
    }
}
