<?php

use App\Http\Controllers\AnalyticsController;
use Illuminate\Support\Facades\Route;

Route::post('/analytics/events', AnalyticsController::class)
    ->middleware('throttle:120,1');
