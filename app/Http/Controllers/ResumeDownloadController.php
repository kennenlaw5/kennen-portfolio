<?php

namespace App\Http\Controllers;

use App\Services\Observability\OperationalTelemetryLogger;
use App\Services\Resume\Exceptions\ResumeConfigurationException;
use App\Services\Resume\Exceptions\ResumeDownloadException;
use App\Services\Resume\Exceptions\ResumeUnavailableException;
use App\Services\Resume\ResumeDownloadService;
use Illuminate\Http\Response;
use Throwable;

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
     * The closed operational stderr boundary used if reporting itself throws.
     */
    private readonly OperationalTelemetryLogger $operationalTelemetryLogger;

    /**
     * Create a resume download controller.
     */
    public function __construct(
        ResumeDownloadService $resumeDownloadService,
        OperationalTelemetryLogger $operationalTelemetryLogger,
    ) {
        $this->resumeDownloadService = $resumeDownloadService;
        $this->operationalTelemetryLogger = $operationalTelemetryLogger;
    }

    /**
     * Download the configured resume.
     */
    public function download(): Response
    {
        try {
            $body = $this->resumeDownloadService->fetch();
        } catch (ResumeConfigurationException $exception) {
            $this->reportFailure($exception);

            return $this->unavailableResponse(503, 'Resume is temporarily unavailable.');
        } catch (ResumeUnavailableException $exception) {
            $this->reportFailure($exception);

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
     * Report one handled failure while preserving the closed stderr fallback.
     */
    private function reportFailure(ResumeDownloadException $exception): void
    {
        try {
            report($exception);
        } catch (Throwable) {
            $this->operationalTelemetryLogger->resumeDownloadFailed($exception);
        }
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
