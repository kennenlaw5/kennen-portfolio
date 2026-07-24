<?php

namespace App\Services\Observability;

use App\Services\Resume\Exceptions\ResumeDownloadException;
use Illuminate\Log\LogManager;
use Throwable;

/**
 * Emit code-owned operational records with closed, bounded context.
 */
class OperationalTelemetryLogger
{
    /**
     * The constant event name for handled resume failures.
     */
    public const RESUME_DOWNLOAD_FAILED_EVENT = 'resume_download_failed';

    /**
     * The constant component name for resume download handling.
     */
    public const RESUME_DOWNLOAD_COMPONENT = 'resume_download';

    /**
     * Laravel's log manager used to select the explicit stderr channel.
     */
    private readonly LogManager $logManager;

    /**
     * Create an operational telemetry logger.
     */
    public function __construct(LogManager $logManager)
    {
        $this->logManager = $logManager;
    }

    /**
     * Emit one closed resume failure record without affecting request handling.
     */
    public function resumeDownloadFailed(ResumeDownloadException $exception): void
    {
        try {
            $this->logManager
                ->channel('stderr')
                ->warning(
                    self::RESUME_DOWNLOAD_FAILED_EVENT,
                    self::resumeDownloadContext($exception),
                );
        } catch (Throwable) {
            // Render stderr is best-effort and must never replace the controlled response.
        }
    }

    /**
     * Build the context shared by resume Error events and stderr records.
     *
     * @return array<string, int|string>
     */
    public static function resumeDownloadContext(
        ResumeDownloadException $exception,
        ?string $environment = null,
        ?string $release = null,
    ): array {
        $environment ??= (string) (config('sentry.environment') ?: app()->environment());
        $release ??= config('sentry.release');

        $context = [
            'event' => self::RESUME_DOWNLOAD_FAILED_EVENT,
            'component' => self::RESUME_DOWNLOAD_COMPONENT,
            ...$exception->context(),
            'environment' => $environment,
        ];

        if (is_string($release) && $release !== '') {
            $context['release'] = $release;
        }

        return $context;
    }
}
