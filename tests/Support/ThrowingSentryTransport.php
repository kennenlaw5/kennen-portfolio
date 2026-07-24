<?php

namespace Tests\Support;

use RuntimeException;
use Sentry\Event;
use Sentry\Transport\Result;
use Sentry\Transport\ResultStatus;
use Sentry\Transport\TransportInterface;

/**
 * Simulate a Sentry transport failure without network access.
 */
class ThrowingSentryTransport implements TransportInterface
{
    /**
     * The number of attempted event sends.
     */
    private int $sendCount = 0;

    /**
     * Fail every attempted event send.
     */
    public function send(Event $event): Result
    {
        $this->sendCount++;

        throw new RuntimeException('Simulated Sentry transport failure.');
    }

    /**
     * Close the transport without additional work.
     */
    public function close(?int $timeout = null): Result
    {
        return new Result(ResultStatus::success());
    }

    /**
     * Return the number of attempted sends.
     */
    public function sendCount(): int
    {
        return $this->sendCount;
    }
}
