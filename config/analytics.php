<?php

$environment = (string) env('APP_ENV', 'production');
$enabled = filter_var(env('ANALYTICS_ENABLED', false), FILTER_VALIDATE_BOOL);

return [
    'enabled' => $enabled && ! in_array($environment, ['local', 'testing'], true),
    'measurement_id' => (string) env('GOOGLE_ANALYTICS_MEASUREMENT_ID', ''),
];
