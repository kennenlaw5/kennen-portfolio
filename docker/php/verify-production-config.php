<?php

declare(strict_types=1);

use App\Services\Observability\SentryTelemetrySanitizer;
use Illuminate\Contracts\Console\Kernel;

require __DIR__.'/../../vendor/autoload.php';

$app = require __DIR__.'/../../bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

/**
 * Each key names a production safety property without including its configured value.
 *
 * @var array<string, bool>
 */
$checks = [
    'php_exception_arguments_hidden' => ini_get('zend.exception_ignore_args') === '1',
    'sentry_logs_disabled' => config('sentry.enable_logs') === false,
    'sentry_metrics_disabled' => config('sentry.enable_metrics') === false,
    'sentry_tracing_disabled' => in_array(
        config('sentry.traces_sample_rate'),
        [null, 0.0],
        true,
    ),
    'sentry_profiling_disabled' => in_array(
        config('sentry.profiles_sample_rate'),
        [null, 0.0],
        true,
    ),
    'sentry_pii_disabled' => config('sentry.send_default_pii') === false
        && config('sentry.max_request_body_size') === 'none',
    'sentry_unsafe_collectors_disabled' => config('sentry.default_integrations') === false
        && config('sentry.max_breadcrumbs') === 0
        && ! in_array(true, config('sentry.breadcrumbs'), true)
        && ! in_array(true, config('sentry.tracing'), true),
    'sentry_total_sanitizer_configured' => config('sentry.before_send') === [
        SentryTelemetrySanitizer::class,
        'beforeSend',
    ] && is_callable(config('sentry.before_send')),
    'stderr_stack_active' => config('logging.default') === 'stack'
        && config('logging.channels.stack.channels') === ['stderr'],
];
$failedChecks = array_keys(array_filter(
    $checks,
    static fn (bool $passed): bool => ! $passed,
));

if ($failedChecks !== []) {
    throw new RuntimeException(
        'Unsafe production configuration: '.implode(', ', $failedChecks),
    );
}

fwrite(STDOUT, "Production privacy configuration verified.\n");
