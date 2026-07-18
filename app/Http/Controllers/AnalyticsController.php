<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class AnalyticsController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $event = $request->validate([
            'event' => [
                'required',
                'string',
                Rule::in([
                    'contact_link_clicked',
                    'page_view',
                    'project_link_clicked',
                    'resume_download',
                ]),
            ],
            'path' => ['required', 'string', 'max:255', 'regex:/^\//'],
            'label' => ['sometimes', 'nullable', 'string', 'max:120'],
        ]);

        $context = [
            'event' => $event['event'],
            'path' => $event['path'],
        ];

        if (! empty($event['label'])) {
            $context['label'] = $event['label'];
        }

        Log::info('portfolio_event', $context);

        return response()->noContent();
    }
}
