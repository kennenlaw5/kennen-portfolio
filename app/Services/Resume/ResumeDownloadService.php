<?php

namespace App\Services\Resume;

use App\Services\Resume\Exceptions\ResumeConfigurationException;
use App\Services\Resume\Exceptions\ResumeUnavailableException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;

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
            throw ResumeConfigurationException::missingUrl();
        }

        if (filter_var($resumeUrl, FILTER_VALIDATE_URL) === false || strtolower((string) parse_url($resumeUrl, PHP_URL_SCHEME)) !== 'https') {
            throw ResumeConfigurationException::invalidUrl();
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
            throw ResumeUnavailableException::upstreamUnavailable();
        }

        if (! $upstream->successful()) {
            throw ResumeUnavailableException::upstreamResponse($upstream->status());
        }

        $body = $upstream->body();
        $contentType = $upstream->header('Content-Type');

        if (! str_starts_with(strtolower($contentType), 'application/pdf') || ! str_starts_with($body, '%PDF-')) {
            throw ResumeUnavailableException::invalidPdf(
                $upstream->status(),
                $this->classifyContentType($contentType),
            );
        }

        return $body;
    }

    /**
     * Normalize an upstream content type into the closed telemetry vocabulary.
     */
    private function classifyContentType(string $contentType): string
    {
        $mediaType = strtolower(trim(explode(';', $contentType, 2)[0]));

        if ($mediaType === '') {
            return ResumeUnavailableException::CONTENT_CLASS_MISSING;
        }

        if ($mediaType === 'application/pdf') {
            return ResumeUnavailableException::CONTENT_CLASS_PDF;
        }

        if (in_array($mediaType, ['text/html', 'application/xhtml+xml'], true)) {
            return ResumeUnavailableException::CONTENT_CLASS_HTML;
        }

        return ResumeUnavailableException::CONTENT_CLASS_OTHER;
    }
}
