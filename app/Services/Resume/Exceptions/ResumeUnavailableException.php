<?php

namespace App\Services\Resume\Exceptions;

use RuntimeException;

/**
 * Report a failure while retrieving or validating the configured resume.
 */
class ResumeUnavailableException extends RuntimeException {}
