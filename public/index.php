<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// --- ADD THIS LINE (Early Logging) ---
file_put_contents('/var/log/laravel_startup.log', 'index.php loaded: ' . date('Y-m-d H:i:s') . "\n", FILE_APPEND);

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
$app = require_once __DIR__.'/../bootstrap/app.php';

// --- ADD THIS LINE (Before handling the request) ---
file_put_contents('/var/log/laravel_startup.log', 'Before handleRequest: ' . date('Y-m-d H:i:s') . "\n", FILE_APPEND);

$response = $app->handleRequest(Request::capture());

// --- ADD THIS LINE (After handling the request) ---
file_put_contents('/var/log/laravel_startup.log', 'After handleRequest: ' . date('Y-m-d H:i:s') . "\n", FILE_APPEND);

$response->send();

$app->terminate(Request::capture(), $response);