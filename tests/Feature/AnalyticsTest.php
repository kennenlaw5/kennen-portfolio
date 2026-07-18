<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class AnalyticsTest extends TestCase
{
    public function test_it_logs_an_allowed_anonymous_event(): void
    {
        Log::shouldReceive('info')
            ->once()
            ->with('portfolio_event', [
                'event' => 'project_link_clicked',
                'path' => '/experience',
                'label' => 'Amazon Autos',
            ]);

        $this->postJson('/api/analytics/events', [
            'event' => 'project_link_clicked',
            'path' => '/experience',
            'label' => 'Amazon Autos',
        ])->assertNoContent();
    }

    public function test_it_rejects_unknown_event_types(): void
    {
        $this->postJson('/api/analytics/events', [
            'event' => 'arbitrary_event',
            'path' => '/',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('event');
    }
}
