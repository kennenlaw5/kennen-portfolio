<?php

return [
    'url' => env('CONTACT_RESUME_URL', ''),
    'rate_limits' => [
        'per_ip' => (int) env('RESUME_DOWNLOAD_RATE_LIMIT_PER_IP', 30),
        'global' => (int) env('RESUME_DOWNLOAD_RATE_LIMIT_GLOBAL', 120),
    ],
];
