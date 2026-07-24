<?php

namespace App\Services\Resume\Exceptions;

/**
 * Report invalid or missing resume configuration.
 */
class ResumeConfigurationException extends ResumeDownloadException
{
    /**
     * Create a failure for missing resume URL configuration.
     */
    public static function missingUrl(): self
    {
        return new self(
            'The resume download URL is not configured.',
            self::REASON_MISSING_URL,
        );
    }

    /**
     * Create a failure for invalid resume URL configuration.
     */
    public static function invalidUrl(): self
    {
        return new self(
            'The resume download URL is invalid.',
            self::REASON_INVALID_URL,
        );
    }
}
