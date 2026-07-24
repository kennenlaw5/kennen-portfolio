<?php

namespace App\Services\Resume\Exceptions;

/**
 * Report a failure while retrieving or validating the configured resume.
 */
class ResumeUnavailableException extends ResumeDownloadException
{
    /**
     * Create a failure for an unreachable upstream service.
     */
    public static function upstreamUnavailable(): self
    {
        return new self(
            'The resume upstream service is unavailable.',
            self::REASON_UPSTREAM_UNAVAILABLE,
        );
    }

    /**
     * Create a failure for an unsuccessful upstream response.
     */
    public static function upstreamResponse(int $status): self
    {
        return new self(
            'The resume upstream service returned an unsuccessful response.',
            self::REASON_UPSTREAM_RESPONSE,
            $status,
        );
    }

    /**
     * Create a failure for an upstream response that is not a valid PDF.
     */
    public static function invalidPdf(int $status, string $contentClass): self
    {
        return new self(
            'The resume upstream response was not a valid PDF.',
            self::REASON_INVALID_PDF,
            $status,
            $contentClass,
        );
    }
}
