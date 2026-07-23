<?php

declare(strict_types=1);

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
