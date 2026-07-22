<?php

namespace App\Http\Controllers;

use App\Services\Resume\Exceptions\ResumeConfigurationException;
use App\Services\Resume\Exceptions\ResumeUnavailableException;
use App\Services\Resume\ResumeDownloadService;
use Illuminate\Http\Response;

/**
 * Serve the configured resume as a same-origin file download.
 */
class ResumeDownloadController extends Controller
{
    /**
     * The filename presented to the person downloading the resume.
     */
    private const FILENAME = 'Kennen Lawrence - Resume.pdf';

    /**
     * The service responsible for retrieving and validating the resume.
     */
    private readonly ResumeDownloadService $resumeDownloadService;

    /**
     * Create a resume download controller.
     */
    public function __construct(ResumeDownloadService $resumeDownloadService)
    {
        $this->resumeDownloadService = $resumeDownloadService;
    }

    /**
     * Download the configured resume.
     */
    public function download(): Response
    {
        try {
            $body = $this->resumeDownloadService->fetch();
        } catch (ResumeConfigurationException) {
            return $this->unavailableResponse(503, 'Resume is temporarily unavailable.');
        } catch (ResumeUnavailableException) {
            return $this->unavailableResponse(502, 'Resume download is temporarily unavailable.');
        }

        return response($body, 200, [
            'Cache-Control' => 'private, no-store',
            'Content-Disposition' => 'attachment; filename="'.self::FILENAME.'"',
            'Content-Type' => 'application/octet-stream',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    /**
     * Build a non-cacheable plain-text response for an unavailable download.
     */
    private function unavailableResponse(int $status, string $message): Response
    {
        return response($message, $status, [
            'Cache-Control' => 'no-store',
            'Content-Type' => 'text/plain; charset=UTF-8',
        ]);
    }
}
