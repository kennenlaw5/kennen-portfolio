<?php

namespace App\Services\Observability;

use GuzzleHttp\Exception\ConnectException as GuzzleConnectException;
use GuzzleHttp\Exception\RequestException as GuzzleRequestException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Client\ConnectionException as LaravelConnectionException;
use Illuminate\Http\Client\RequestException as LaravelRequestException;
use PDOException;
use Sentry\Event;
use Sentry\EventHint;
use Sentry\ExceptionDataBag;
use Sentry\ExceptionMechanism;
use Sentry\Frame;
use Sentry\Stacktrace;
use Throwable;

/**
 * Enforce the final privacy boundary for server-side Sentry Error events.
 */
class SentryTelemetrySanitizer
{
    /**
     * Code-owned replacement for outbound HTTP-client exception messages.
     */
    public const OUTBOUND_HTTP_FAILURE_MESSAGE = 'An outbound HTTP request failed.';

    /**
     * Code-owned replacement for database exception messages.
     */
    public const DATABASE_FAILURE_MESSAGE = 'A database operation failed.';

    /**
     * Stable marker used when a prohibited value is removed.
     */
    private const REDACTION = '[redacted]';

    /**
     * HTTP exception families whose messages can contain URLs, credentials, or bodies.
     *
     * @var list<class-string<Throwable>>
     */
    private const RISKY_HTTP_EXCEPTION_TYPES = [
        LaravelRequestException::class,
        LaravelConnectionException::class,
        GuzzleRequestException::class,
        GuzzleConnectException::class,
    ];

    /**
     * Database exception families whose messages can contain SQL, bindings, or connection data.
     *
     * @var list<class-string<Throwable>>
     */
    private const RISKY_DATABASE_EXCEPTION_TYPES = [
        QueryException::class,
        PDOException::class,
    ];

    /**
     * Total SDK adapter that drops only the affected event if sanitization fails.
     */
    public static function beforeSend(Event $event, ?EventHint $hint): ?Event
    {
        try {
            return app(self::class)->sanitize($event, $hint);
        } catch (Throwable) {
            return null;
        }
    }

    /**
     * Build a new allowlisted Error event instead of mutating unknown inbound context.
     */
    public function sanitize(Event $event, ?EventHint $hint): Event
    {
        $sanitized = Event::createEvent($event->getId());
        $sanitized->setTimestamp($event->getTimestamp());
        $sanitized->setLevel($event->getLevel());
        $sanitized->setLogger($this->sanitizeNullableString($event->getLogger()));
        $sanitized->setTransaction($this->sanitizeNullableString($event->getTransaction()));
        $sanitized->setRelease($event->getRelease());
        $sanitized->setEnvironment($event->getEnvironment());
        $sanitized->setFingerprint($this->sanitizeStringList($event->getFingerprint()));
        $sanitized->setModules($this->sanitizeStringMap($event->getModules()));
        $sanitized->setTags($this->sanitizeStringMap($event->getTags()));
        $sanitized->setSdkIdentifier($event->getSdkIdentifier());
        $sanitized->setSdkVersion($event->getSdkVersion());

        if ($event->getMessage() !== null) {
            $sanitized->setMessage(
                $this->replacementMessageForEvent($event, $hint)
                    ?? $this->sanitizeString($event->getMessage()),
            );
        }

        $sanitized->setExceptions($this->sanitizeExceptions($event->getExceptions()));

        if ($event->getStacktrace() !== null) {
            $sanitized->setStacktrace($this->sanitizeStacktrace($event->getStacktrace()));
        }

        return $sanitized;
    }

    /**
     * Rebuild exception data with safe values, frames, and bounded mechanism evidence.
     *
     * @param  ExceptionDataBag[]  $exceptions
     * @return ExceptionDataBag[]
     */
    private function sanitizeExceptions(array $exceptions): array
    {
        return array_map(
            function (ExceptionDataBag $exception): ExceptionDataBag {
                $message = $this->replacementMessageFor($exception->getType())
                    ?? $this->sanitizeString($exception->getValue());
                $stacktrace = $exception->getStacktrace() === null
                    ? null
                    : $this->sanitizeStacktrace($exception->getStacktrace());
                $mechanism = $this->sanitizeMechanism($exception->getMechanism());
                $sanitized = new ExceptionDataBag(
                    new \RuntimeException($message),
                    $stacktrace,
                    $mechanism,
                );
                $sanitized->setType($exception->getType());
                $sanitized->setValue($message);

                return $sanitized;
            },
            $exceptions,
        );
    }

    /**
     * Return the code-owned replacement for a confirmed risky exception family.
     */
    private function replacementMessageFor(string $exceptionType): ?string
    {
        foreach (self::RISKY_HTTP_EXCEPTION_TYPES as $type) {
            if (is_a($exceptionType, $type, true)) {
                return self::OUTBOUND_HTTP_FAILURE_MESSAGE;
            }
        }

        foreach (self::RISKY_DATABASE_EXCEPTION_TYPES as $type) {
            if (is_a($exceptionType, $type, true)) {
                return self::DATABASE_FAILURE_MESSAGE;
            }
        }

        return null;
    }

    /**
     * Replace a top-level message only when it belongs to a confirmed risky exception.
     */
    private function replacementMessageForEvent(Event $event, ?EventHint $hint): ?string
    {
        if ($hint?->exception !== null) {
            $replacement = $this->replacementMessageFor($hint->exception::class);

            if ($replacement !== null) {
                return $replacement;
            }
        }

        if ($event->getMessage() === null) {
            return null;
        }

        foreach ($event->getExceptions() as $exception) {
            if ($exception->getValue() !== $event->getMessage()) {
                continue;
            }

            $replacement = $this->replacementMessageFor($exception->getType());

            if ($replacement !== null) {
                return $replacement;
            }
        }

        return null;
    }

    /**
     * Preserve only mechanism type, handled state, and a scalar exception code.
     */
    private function sanitizeMechanism(?ExceptionMechanism $mechanism): ?ExceptionMechanism
    {
        if ($mechanism === null) {
            return null;
        }

        $data = [];
        $code = $mechanism->getData()['code'] ?? null;

        if (is_int($code)) {
            $data['code'] = $code;
        } elseif (is_string($code)) {
            $data['code'] = $this->sanitizeString($code);
        }

        return new ExceptionMechanism(
            $this->sanitizeString($mechanism->getType()),
            $mechanism->isHandled(),
            $data,
        );
    }

    /**
     * Rebuild a stacktrace without variables or source-code context lines.
     */
    private function sanitizeStacktrace(Stacktrace $stacktrace): Stacktrace
    {
        return new Stacktrace(array_map(
            fn (Frame $frame): Frame => new Frame(
                $this->sanitizeNullableString($frame->getFunctionName()),
                $this->sanitizeString($frame->getFile()),
                $frame->getLine(),
                $this->sanitizeNullableString($frame->getRawFunctionName()),
                $this->sanitizeNullableString($frame->getAbsoluteFilePath()),
                [],
                $frame->isInApp(),
            ),
            $stacktrace->getFrames(),
        ));
    }

    /**
     * Sanitize a nullable diagnostic string.
     */
    private function sanitizeNullableString(?string $value): ?string
    {
        return $value === null ? null : $this->sanitizeString($value);
    }

    /**
     * Redact configured values, absolute URLs, emails, query strings, and credential patterns.
     */
    private function sanitizeString(string $value): string
    {
        foreach ($this->configuredSensitiveValues() as $sensitiveValue) {
            $value = $this->redactConfiguredValue($value, $sensitiveValue);
        }

        $patterns = [
            '/\b[A-Z][A-Z0-9+.\-]*:\/\/[^\s<>"\']+/iu',
            '/\b[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}\b/iu',
            '/(?<![A-Z0-9])(?:[A-Z0-9]+[_-])*[A-Z0-9]*?(?:AUTHORIZATION|PROXY[_-]?AUTHORIZATION)(?![A-Z0-9])["\']?\s*(?:=>|:|=)\s*[^\r\n;]+/iu',
            '/(?<![A-Z0-9])(?:[A-Z0-9]+[_-])*[A-Z0-9]*?(?:COOKIE|SET[_-]?COOKIE)(?![A-Z0-9])["\']?\s*(?:=>|:|=)\s*[^\r\n]+/iu',
            '/\b(?:Bearer|Basic)\s+[A-Z0-9._~+\/=\-]+/iu',
            '/(?<![A-Z0-9])(?:[A-Z0-9]+[_-])*[A-Z0-9]*?(?:KEYS?|ACCESS[_-]?TOKEN|REFRESH[_-]?TOKEN|AUTH[_-]?TOKEN|TOKEN|PASSWORD|PASSWD|SECRET(?:[_-]?ACCESS[_-]?KEY)?|CLIENT[_-]?SECRET)(?![A-Z0-9])["\']?\s*(?:=>|:|=)\s*(?:"(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\'|[^\s,;}\]]+)/iu',
            '/\?[^\s#]+/u',
        ];

        return preg_replace($patterns, self::REDACTION, $value) ?? self::REDACTION;
    }

    /**
     * Redact longer configured values as substrings and short values only as standalone tokens.
     */
    private function redactConfiguredValue(string $value, string $sensitiveValue): string
    {
        if (strlen($sensitiveValue) >= 4) {
            return str_ireplace($sensitiveValue, self::REDACTION, $value);
        }

        $pattern = '/(?<![\p{L}\p{N}])'.preg_quote($sensitiveValue, '/').'(?![\p{L}\p{N}])/iu';

        return preg_replace($pattern, self::REDACTION, $value) ?? self::REDACTION;
    }

    /**
     * Sanitize every value in a list of grouping strings.
     *
     * @param  string[]  $values
     * @return string[]
     */
    private function sanitizeStringList(array $values): array
    {
        return array_map($this->sanitizeString(...), $values);
    }

    /**
     * Sanitize a string map without admitting objects or nested arbitrary context.
     *
     * @param  array<string, string>  $values
     * @return array<string, string>
     */
    private function sanitizeStringMap(array $values): array
    {
        $sanitized = [];

        foreach ($values as $key => $value) {
            $sanitized[$this->sanitizeString($key)] = $this->isSensitiveMapKey($key)
                ? self::REDACTION
                : $this->sanitizeString($value);
        }

        return $sanitized;
    }

    /**
     * Identify map keys whose associated opaque value is prohibited context.
     */
    private function isSensitiveMapKey(string $key): bool
    {
        $normalized = preg_replace('/[^a-z0-9]+/i', '', $key);

        if ($normalized === null) {
            return true;
        }

        $normalized = strtolower($normalized);

        if (in_array($normalized, [
            'ip',
            'user',
            'email',
            'phone',
            'contact',
            'body',
            'headers',
            'request',
            'response',
            'exception',
            'throwable',
        ], true)) {
            return true;
        }

        foreach ([
            'authorization',
            'key',
            'keys',
            'appkey',
            'apikey',
            'accesstoken',
            'refreshtoken',
            'authtoken',
            'token',
            'password',
            'passwd',
            'secretaccesskey',
            'secretkey',
            'clientsecret',
            'secret',
            'cookie',
            'clientip',
            'userip',
            'remoteaddr',
            'useragent',
            'referer',
            'referrer',
            'username',
            'userid',
            'requestbody',
            'responsebody',
            'querystring',
            'email',
            'phone',
            'contact',
            'dsn',
            'url',
        ] as $suffix) {
            if (str_ends_with($normalized, $suffix)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Return configured server-owned values that must never be duplicated into event context.
     *
     * @return list<string>
     */
    private function configuredSensitiveValues(): array
    {
        $values = [
            config('app.key'),
            config('resume.url'),
            config('sentry.dsn'),
        ];
        $this->appendStringValues($values, config('app.previous_keys', []));
        $this->appendStringValues($values, config('app.contact', []));
        $values = array_values(array_filter(
            $values,
            static fn (mixed $value): bool => is_string($value) && $value !== '',
        ));
        usort(
            $values,
            static fn (string $left, string $right): int => strlen($right) <=> strlen($left),
        );

        return array_values(array_unique($values));
    }

    /**
     * Recursively collect configured string values without retaining their keys or containers.
     *
     * @param  array<int, mixed>  $values
     */
    private function appendStringValues(array &$values, mixed $candidate): void
    {
        if (is_string($candidate)) {
            $values[] = $candidate;

            return;
        }

        if (! is_array($candidate)) {
            return;
        }

        foreach ($candidate as $value) {
            $this->appendStringValues($values, $value);
        }
    }
}
