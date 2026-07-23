<?php

namespace Tests\Feature;

use DOMDocument;
use DOMXPath;
use Symfony\Component\Process\Process;
use Tests\TestCase;

/**
 * Verifies the dormant, privacy-safe Sentry configuration boundary.
 */
class SentryConfigurationTest extends TestCase
{
    /**
     * Ensure PHPUnit cannot inherit either supported Sentry DSN from a local environment.
     */
    public function test_sentry_transport_is_forced_off_in_tests(): void
    {
        $environment = $this->phpunitEnvironment();

        $this->assertSame(
            'bootstrap/cache/phpunit-config.php',
            $environment['APP_CONFIG_CACHE']['value'] ?? null,
        );
        $this->assertSame('true', $environment['APP_CONFIG_CACHE']['force'] ?? null);
        $this->assertFalse($this->app->configurationIsCached());

        foreach (['SENTRY_LARAVEL_DSN', 'SENTRY_DSN'] as $name) {
            $this->assertArrayHasKey($name, $environment);
            $this->assertSame('', $environment[$name]['value']);
            $this->assertSame('true', $environment[$name]['force']);
        }

        $dsn = config('sentry.dsn');

        $this->assertTrue(
            $dsn === null || $dsn === '',
            'The test Sentry DSN must be blank without displaying a potentially sensitive value.',
        );
    }

    /**
     * Ensure only Error Monitoring can be activated by a future server-side DSN.
     */
    public function test_only_sentry_error_monitoring_is_configured(): void
    {
        $environment = $this->phpunitEnvironment();
        $expectedTestEnvironment = [
            'SENTRY_ENABLE_LOGS' => '(false)',
            'SENTRY_ENABLE_METRICS' => '(false)',
            'SENTRY_SEND_DEFAULT_PII' => '(false)',
            'SENTRY_MAX_REQUEST_BODY_SIZE' => 'none',
            'SENTRY_TRACES_SAMPLE_RATE' => '0',
            'SENTRY_PROFILES_SAMPLE_RATE' => '0',
        ];

        foreach ($expectedTestEnvironment as $name => $value) {
            $this->assertSame($value, $environment[$name]['value'] ?? null);
            $this->assertSame('true', $environment[$name]['force'] ?? null);
        }

        $exampleEnvironment = $this->exampleEnvironment();
        $expectedExamples = [
            'SENTRY_LARAVEL_DSN' => '',
            'SENTRY_DSN' => '',
            'SENTRY_RELEASE' => '',
            'SENTRY_ENABLE_LOGS' => 'false',
            'SENTRY_ENABLE_METRICS' => 'false',
            'SENTRY_SEND_DEFAULT_PII' => 'false',
            'SENTRY_MAX_REQUEST_BODY_SIZE' => 'none',
            'SENTRY_TRACES_SAMPLE_RATE' => '0',
            'SENTRY_PROFILES_SAMPLE_RATE' => '0',
        ];

        foreach ($expectedExamples as $name => $value) {
            $this->assertArrayHasKey($name, $exampleEnvironment);
            $this->assertSame($value, $exampleEnvironment[$name]);
        }

        $this->assertSame(1.0, config('sentry.sample_rate'));
        $this->assertFalse(config('sentry.enable_logs'));
        $this->assertFalse(config('sentry.enable_metrics'));
        $this->assertSame(0.0, config('sentry.traces_sample_rate'));
        $this->assertSame(0.0, config('sentry.profiles_sample_rate'));
        $this->assertFalse(config('sentry.send_default_pii'));
        $this->assertSame('none', config('sentry.max_request_body_size'));
    }

    /**
     * Ensure supported Sentry switches remain configurable through environment variables.
     */
    public function test_sentry_product_switches_remain_environment_driven(): void
    {
        $config = $this->loadSentryConfig([
            'SENTRY_ENABLE_LOGS' => 'true',
            'SENTRY_ENABLE_METRICS' => 'true',
            'SENTRY_SEND_DEFAULT_PII' => 'true',
            'SENTRY_MAX_REQUEST_BODY_SIZE' => 'always',
            'SENTRY_TRACES_SAMPLE_RATE' => '0.25',
            'SENTRY_PROFILES_SAMPLE_RATE' => '0.5',
        ]);

        $this->assertTrue($config['enable_logs']);
        $this->assertTrue($config['enable_metrics']);
        $this->assertTrue($config['send_default_pii']);
        $this->assertSame('always', $config['max_request_body_size']);
        $this->assertSame(0.25, $config['traces_sample_rate']);
        $this->assertSame(0.5, $config['profiles_sample_rate']);
    }

    /**
     * Ensure environment and release values use the approved server-owned precedence.
     */
    public function test_sentry_environment_and_release_use_runtime_fallbacks(): void
    {
        $explicitRelease = $this->loadSentryConfig([
            'APP_ENV' => 'contract-test',
            'RENDER_GIT_COMMIT' => 'render-release',
            'SENTRY_RELEASE' => 'explicit-release',
        ]);

        $this->assertSame('contract-test', $explicitRelease['environment']);
        $this->assertSame('explicit-release', $explicitRelease['release']);

        $renderRelease = $this->loadSentryConfig([
            'APP_ENV' => 'contract-test',
            'RENDER_GIT_COMMIT' => 'render-release',
            'SENTRY_RELEASE' => '',
        ]);

        $this->assertSame('contract-test', $renderRelease['environment']);
        $this->assertSame('render-release', $renderRelease['release']);
    }

    /**
     * Ensure the Sentry policy remains compatible with Laravel's production config cache.
     */
    public function test_sentry_configuration_can_be_cached(): void
    {
        $relativeCachePath = 'storage/framework/cache/sentry-config-test-'
            .bin2hex(random_bytes(8)).'.php';
        $absoluteCachePath = base_path($relativeCachePath);
        $process = new Process(
            [PHP_BINARY, 'artisan', 'config:cache'],
            base_path(),
            [
                'APP_CONFIG_CACHE' => $relativeCachePath,
                'RENDER_GIT_COMMIT' => 'cached-release',
                'SENTRY_DSN' => '',
                'SENTRY_ENABLE_METRICS' => 'true',
                'SENTRY_LARAVEL_DSN' => '',
                'SENTRY_MAX_REQUEST_BODY_SIZE' => 'always',
                'SENTRY_RELEASE' => '',
            ],
        );

        try {
            $process->run();

            $this->assertTrue(
                $process->isSuccessful(),
                'Laravel config caching failed: '.$process->getErrorOutput(),
            );
            $this->assertFileExists($absoluteCachePath);

            /** @var array<string, mixed> $cachedConfig */
            $cachedConfig = require $absoluteCachePath;

            $this->assertSame('cached-release', $cachedConfig['sentry']['release']);
            $this->assertTrue($cachedConfig['sentry']['enable_metrics']);
            $this->assertSame('always', $cachedConfig['sentry']['max_request_body_size']);
        } finally {
            if (is_file($absoluteCachePath)) {
                unlink($absoluteCachePath);
            }
        }
    }

    /**
     * Ensure normal Laravel logging remains independent from Sentry Structured Logs.
     */
    public function test_sentry_logs_channel_remains_available_but_stderr_is_the_active_stack(): void
    {
        /** @var array{channels: array<string, mixed>} $logging */
        $logging = require config_path('logging.php');

        $this->assertArrayHasKey('sentry_logs', $logging['channels']);
        $this->assertSame('sentry_logs', $logging['channels']['sentry_logs']['driver']);
        $this->assertNotContains('sentry_logs', config('logging.channels.stack.channels'));
        $this->assertNotContains('sentry', config('logging.channels.stack.channels'));
        $this->assertArrayHasKey('stderr', $logging['channels']);
        $this->assertSame('stack', config('logging.default'));
        $this->assertSame(['stderr'], config('logging.channels.stack.channels'));
    }

    /**
     * Ensure the Render image verifies the effective production privacy configuration.
     */
    public function test_production_image_verifies_safe_sentry_and_php_configuration(): void
    {
        $phpConfiguration = file_get_contents(base_path('docker/php/php.ini'));
        $dockerfile = file_get_contents(base_path('docker/php/Dockerfile'));
        $dockerIgnore = file_get_contents(base_path('.dockerignore'));

        $this->assertIsString($phpConfiguration);
        $this->assertIsString($dockerfile);
        $this->assertIsString($dockerIgnore);
        $this->assertMatchesRegularExpression(
            '/^zend\.exception_ignore_args\s*=\s*On$/m',
            $phpConfiguration,
        );
        $this->assertMatchesRegularExpression(
            '/^bootstrap\\/cache\\/\\*\\.php$/m',
            $dockerIgnore,
        );
        $this->assertFileExists(base_path('docker/php/verify-production-config.php'));
        $this->assertStringContainsString(
            'RUN php docker/php/verify-production-config.php',
            $dockerfile,
        );
    }

    /**
     * Read forced environment values from PHPUnit's configuration without exposing process secrets.
     *
     * @return array<string, array{value: string, force: string}>
     */
    private function phpunitEnvironment(): array
    {
        $document = new DOMDocument;
        $loaded = $document->load(base_path('phpunit.xml'));

        $this->assertTrue($loaded);

        $xpath = new DOMXPath($document);
        $nodes = $xpath->query('/phpunit/php/env');

        $this->assertNotFalse($nodes);

        $environment = [];

        foreach ($nodes as $node) {
            $name = $node->attributes?->getNamedItem('name')?->nodeValue;

            if ($name === null) {
                continue;
            }

            $environment[$name] = [
                'value' => $node->attributes?->getNamedItem('value')?->nodeValue ?? '',
                'force' => $node->attributes?->getNamedItem('force')?->nodeValue ?? '',
            ];
        }

        return $environment;
    }

    /**
     * Read the sanitized environment template as raw key/value pairs.
     *
     * @return array<string, string>
     */
    private function exampleEnvironment(): array
    {
        $lines = file(base_path('.env.example'), FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        $this->assertIsArray($lines);

        $environment = [];

        foreach ($lines as $line) {
            if (str_starts_with($line, '#') || ! str_contains($line, '=')) {
                continue;
            }

            [$name, $value] = explode('=', $line, 2);
            $environment[$name] = $value;
        }

        return $environment;
    }

    /**
     * Load the Sentry config in an isolated process with controlled fake runtime values.
     *
     * @param  array<string, string|false>  $environment
     * @return array{
     *     environment: ?string,
     *     release: ?string,
     *     enable_logs: bool,
     *     enable_metrics: bool,
     *     send_default_pii: bool,
     *     max_request_body_size: string,
     *     traces_sample_rate: ?float,
     *     profiles_sample_rate: ?float
     * }     */
    private function loadSentryConfig(array $environment): array
    {
        $code = <<<'PHP'
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$config = $app->make(\Illuminate\Contracts\Config\Repository::class);
$options = $app->make(\Sentry\State\HubInterface::class)->getClient()->getOptions();
echo json_encode([
    'environment' => $options->getEnvironment(),
    'release' => $options->getRelease(),
    'enable_logs' => $config->get('sentry.enable_logs'),
    'enable_metrics' => $config->get('sentry.enable_metrics'),
    'send_default_pii' => $config->get('sentry.send_default_pii'),
    'max_request_body_size' => $config->get('sentry.max_request_body_size'),
    'traces_sample_rate' => $config->get('sentry.traces_sample_rate'),
    'profiles_sample_rate' => $config->get('sentry.profiles_sample_rate'),
], JSON_THROW_ON_ERROR);
PHP;

        $process = new Process(
            [PHP_BINARY, '-r', $code],
            base_path(),
            array_merge([
                'SENTRY_DSN' => '',
                'SENTRY_LARAVEL_DSN' => '',
            ], $environment),
        );
        $process->mustRun();

        /**
         * @var array{
         *     environment: ?string,
         *     release: ?string,
         *     enable_logs: bool,
         *     enable_metrics: bool,
         *     send_default_pii: bool,
         *     max_request_body_size: string,
         *     traces_sample_rate: ?float,
         *     profiles_sample_rate: ?float
         * } $config
         */ $config = json_decode($process->getOutput(), true, flags: JSON_THROW_ON_ERROR);

        return $config;
    }
}
