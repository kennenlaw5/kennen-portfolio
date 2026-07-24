<?php

namespace App\Services\Resume\Exceptions;

use InvalidArgumentException;
use RuntimeException;

/**
 * Carry one closed resume failure reason and its bounded scalar context.
 */
abstract class ResumeDownloadException extends RuntimeException
{
    /**
     * Resume configuration is missing.
     */
    public const REASON_MISSING_URL = 'missing_url';

    /**
     * Resume configuration is not a valid HTTPS URL.
     */
    public const REASON_INVALID_URL = 'invalid_url';

    /**
     * The upstream service could not be reached.
     */
    public const REASON_UPSTREAM_UNAVAILABLE = 'upstream_unavailable';

    /**
     * The upstream service returned an unsuccessful response.
     */
    public const REASON_UPSTREAM_RESPONSE = 'upstream_response';

    /**
     * The upstream response was not a valid PDF.
     */
    public const REASON_INVALID_PDF = 'invalid_pdf';

    /**
     * The upstream declared PDF content.
     */
    public const CONTENT_CLASS_PDF = 'pdf';

    /**
     * The upstream declared HTML content.
     */
    public const CONTENT_CLASS_HTML = 'html';

    /**
     * The upstream declared another content type.
     */
    public const CONTENT_CLASS_OTHER = 'other';

    /**
     * The upstream omitted its content type.
     */
    public const CONTENT_CLASS_MISSING = 'missing';

    /**
     * The closed failure reason.
     */
    private readonly string $reason;

    /**
     * The validated upstream HTTP status, when applicable.
     */
    private readonly ?int $upstreamStatus;

    /**
     * The normalized upstream content class, when applicable.
     */
    private readonly ?string $contentClass;

    /**
     * Create a resume failure from code-owned, closed values.
     */
    protected function __construct(
        string $message,
        string $reason,
        ?int $upstreamStatus = null,
        ?string $contentClass = null,
    ) {
        if (! self::isValidContext($reason, $upstreamStatus, $contentClass)) {
            throw new InvalidArgumentException('Invalid resume failure context.');
        }

        parent::__construct($message);

        $this->reason = $reason;
        $this->upstreamStatus = $upstreamStatus;
        $this->contentClass = $contentClass;
    }

    /**
     * Return the closed failure reason.
     */
    public function reason(): string
    {
        return $this->reason;
    }

    /**
     * Return the validated upstream HTTP status when the failure permits it.
     */
    public function upstreamStatus(): ?int
    {
        return $this->upstreamStatus;
    }

    /**
     * Return the normalized content class when the failure permits it.
     */
    public function contentClass(): ?string
    {
        return $this->contentClass;
    }

    /**
     * Return the closed exception-owned telemetry context.
     *
     * @return array{reason: string, upstream_status?: int, content_class?: string}
     */
    public function context(): array
    {
        $context = ['reason' => $this->reason];

        if ($this->upstreamStatus !== null) {
            $context['upstream_status'] = $this->upstreamStatus;
        }

        if ($this->contentClass !== null) {
            $context['content_class'] = $this->contentClass;
        }

        return $context;
    }

    /**
     * Validate the allowed reason and context combinations.
     */
    private static function isValidContext(
        string $reason,
        ?int $upstreamStatus,
        ?string $contentClass,
    ): bool {
        if ($upstreamStatus !== null && ($upstreamStatus < 100 || $upstreamStatus > 599)) {
            return false;
        }

        return match ($reason) {
            self::REASON_MISSING_URL,
            self::REASON_INVALID_URL,
            self::REASON_UPSTREAM_UNAVAILABLE => $upstreamStatus === null
                && $contentClass === null,
            self::REASON_UPSTREAM_RESPONSE => $upstreamStatus !== null
                && $contentClass === null,
            self::REASON_INVALID_PDF => $upstreamStatus !== null
                && in_array($contentClass, [
                    self::CONTENT_CLASS_PDF,
                    self::CONTENT_CLASS_HTML,
                    self::CONTENT_CLASS_OTHER,
                    self::CONTENT_CLASS_MISSING,
                ], true),
            default => false,
        };
    }
}
