<?php

namespace Tests\Feature;

use Illuminate\Routing\Route as RouteDefinition;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

/**
 * Verify the removed custom analytics ingestion boundary stays absent.
 */
class AnalyticsTest extends TestCase
{
    /**
     * Verify no route or fallback handles the obsolete analytics endpoint.
     */
    public function test_obsolete_analytics_route_is_not_registered(): void
    {
        $isRegistered = collect(Route::getRoutes()->getRoutes())->contains(
            static fn (RouteDefinition $route): bool => in_array('POST', $route->methods(), true)
                && $route->uri() === 'api/analytics/events',
        );

        $this->assertFalse($isRegistered);

        $this->postJson('/api/analytics/events', [
            'event' => 'page_view',
            'path' => '/',
        ])->assertNotFound();
    }
}
