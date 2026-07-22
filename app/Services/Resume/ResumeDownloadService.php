<?php

namespace App\Services\Resume;

use App\Services\Resume\Exceptions\ResumeConfigurationException;
use App\Services\Resume\Exceptions\ResumeUnavailableException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Retrieve and validate the configured resume document.
 */
class ResumeDownloadService
{
    /**
     * Fetch the configured resume as validated PDF contents.
     */
    public function fetch(): string
    {
        $resumeUrl = (string) config('resume.url');

        if ($resumeUrl === '') {
            $this->configurationFailure('missing_url');
        }

        if (filter_var($resumeUrl, FILTER_VALIDATE_URL) === false || strtolower((string) parse_url($resumeUrl, PHP_URL_SCHEME)) !== 'https') {
            $this->configurationFailure('invalid_url');
        }

        try {
            $upstream = Http::withOptions([
                'allow_redirects' => [
                    'max' => 5,
                    'strict' => true,
                    'referer' => false,
                    'protocols' => ['https'],
                ],
            ])
                ->connectTimeout(5)
                ->timeout(15)
                ->get($resumeUrl);
        } catch (ConnectionException|RequestException) {
            $this->upstreamFailure(['reason' => 'upstream_unavailable']);
        }

        if (! $upstream->successful()) {
            $this->upstreamFailure([
                'reason' => 'upstream_response',
                'status' => $upstream->status(),
            ]);
        }

        $body = $upstream->body();
        $contentType = $upstream->header('Content-Type');

        if (! str_starts_with(strtolower($contentType), 'application/pdf') || ! str_starts_with($body, '%PDF-')) {
            $this->upstreamFailure([
                'reason' => 'invalid_pdf',
                'status' => $upstream->status(),
                'content_type' => $contentType,
            ]);
        }

        return $body;
    }

    /**
     * Log and report an invalid resume configuration.
     */
    private function configurationFailure(string $reason): never
    {
        Log::warning('resume_download_failed', ['reason' => $reason]);

        throw new ResumeConfigurationException;
    }

    /**
     * Log and report a failure to retrieve a valid resume.
     *
     * @param  array<string, int|string>  $context
     */
    private function upstreamFailure(array $context): never
    {
        Log::warning('resume_download_failed', $context);

        throw new ResumeUnavailableException;
    }
}
