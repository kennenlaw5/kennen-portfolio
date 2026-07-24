<?php

namespace Tests\Support;

use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Http\Request;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * Record every report call while preserving the application's real exception pipeline.
 */
class RecordingExceptionHandler implements ExceptionHandler
{
    /**
     * The real application exception handler.
     */
    private ExceptionHandler $handler;

    /**
     * Exceptions passed through the reporting boundary.
     *
     * @var list<Throwable>
     */
    private array $reported = [];

    /**
     * Create a recording decorator around the real exception handler.
     */
    public function __construct(ExceptionHandler $handler)
    {
        $this->handler = $handler;
    }

    /**
     * Record and delegate an exception report.
     */
    public function report(Throwable $exception): void
    {
        $this->reported[] = $exception;
        $this->handler->report($exception);
    }

    /**
     * Determine whether the real handler would report the exception.
     */
    public function shouldReport(Throwable $exception): bool
    {
        return $this->handler->shouldReport($exception);
    }

    /**
     * Delegate HTTP exception rendering.
     *
     * @param  Request  $request
     */
    public function render($request, Throwable $exception): Response
    {
        /** @var Request $request */
        return $this->handler->render($request, $exception);
    }

    /**
     * Delegate console exception rendering.
     *
     * @param  OutputInterface  $output
     */
    public function renderForConsole($output, Throwable $exception): void
    {
        /** @var OutputInterface $output */
        $this->handler->renderForConsole($output, $exception);
    }

    /**
     * Return every exception passed to report.
     *
     * @return list<Throwable>
     */
    public function reported(): array
    {
        return $this->reported;
    }
}
