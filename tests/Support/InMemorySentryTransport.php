<?php

namespace Tests\Support;

use Sentry\Event;
use Sentry\Serializer\PayloadSerializerInterface;
use Sentry\Transport\Result;
use Sentry\Transport\ResultStatus;
use Sentry\Transport\TransportInterface;

/**
 * Capture serialized Sentry envelopes without performing network requests.
 */
class InMemorySentryTransport implements TransportInterface
{
    /**
     * The serializer used by the production transport path.
     */
    private PayloadSerializerInterface $serializer;

    /**
     * Serialized envelopes captured by the transport.
     *
     * @var list<string>
     */
    private array $envelopes = [];

    /**
     * Create an in-memory transport around the SDK payload serializer.
     */
    public function __construct(PayloadSerializerInterface $serializer)
    {
        $this->serializer = $serializer;
    }

    /**
     * Serialize and retain an event exactly where the HTTP transport would send it.
     */
    public function send(Event $event): Result
    {
        $this->envelopes[] = $this->serializer->serialize($event);

        return new Result(ResultStatus::success(), $event);
    }

    /**
     * Close the transport without performing external work.
     */
    public function close(?int $timeout = null): Result
    {
        return new Result(ResultStatus::success());
    }

    /**
     * Return every captured serialized envelope.
     *
     * @return list<string>
     */
    public function envelopes(): array
    {
        return $this->envelopes;
    }
}
