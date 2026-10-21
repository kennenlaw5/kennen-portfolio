<?php

namespace Tests\Feature;

use Tests\TestCase;

/**
 * Verifies that the Render production image cannot ship a PHP runtime missing critical fixes.
 */
class ProductionRuntimeSecurityTest extends TestCase
{
    /**
     * The earliest PHP 8.5 release containing the PHP2Shell fixes (CVE-2026-109618, CVE-2026-109619).
     */
    private const PATCHED_PHP_VERSION = '8.5.12';

    /**
     * Ensure the production stage fails before installing dependencies on a stale base image.
     */
    public function test_production_stage_requires_a_patched_php_runtime(): void
    {
        $dockerfile = file_get_contents(base_path('docker/php/Dockerfile'));

        $this->assertIsString($dockerfile);

        $productionStage = strstr($dockerfile, 'AS production');

        $this->assertIsString($productionStage);
        $this->assertSame(
            1,
            preg_match(
                '/version_compare\(PHP_VERSION, "(\d+\.\d+\.\d+)", "<"\)/',
                $productionStage,
                $matches,
                PREG_OFFSET_CAPTURE,
            ),
            'The production stage must declare a PHP version floor.',
        );
        $this->assertTrue(
            version_compare($matches[1][0], self::PATCHED_PHP_VERSION, '>='),
            'The production PHP version floor must not predate the PHP2Shell security release.',
        );
        $this->assertLessThan(
            strpos($productionStage, 'RUN composer install'),
            $matches[0][1],
            'The PHP version floor must run before production dependencies are installed.',
        );
    }

    /**
     * Ensure the production image disables and verifies the PHP2Shell interim attack paths.
     */
    public function test_production_image_disables_php2shell_attack_paths(): void
    {
        $phpConfiguration = file_get_contents(base_path('docker/php/php.ini'));
        $productionVerification = file_get_contents(
            base_path('docker/php/verify-production-config.php'),
        );

        $this->assertIsString($phpConfiguration);
        $this->assertIsString($productionVerification);
        $this->assertMatchesRegularExpression(
            '/^session\.upload_progress\.enabled\s*=\s*Off$/m',
            $phpConfiguration,
        );
        $this->assertMatchesRegularExpression(
            '/^fatal_error_backtraces\s*=\s*Off$/m',
            $phpConfiguration,
        );
        $this->assertStringContainsString(
            "'php_upload_progress_disabled'",
            $productionVerification,
        );
        $this->assertStringContainsString(
            "'php_fatal_error_backtraces_disabled'",
            $productionVerification,
        );
    }
}
