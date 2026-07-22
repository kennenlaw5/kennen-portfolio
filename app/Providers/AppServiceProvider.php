<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

/**
 * Register application services and cross-cutting request policies.
 */
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('resume-download', static function (Request $request): array {
            return [
                Limit::perMinute((int) config('resume.rate_limits.global'))->by('resume-download:global'),
                Limit::perMinute((int) config('resume.rate_limits.per_ip'))
                    ->by('resume-download:ip:'.$request->ip()),
            ];
        });
    }
}
