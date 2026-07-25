<?php

namespace Tests\Feature;

use Symfony\Component\Process\Process;
use Tests\TestCase;

/**
 * Verify the manual production workflow's post-live resume smoke contract.
 */
class DeploymentWorkflowTest extends TestCase
{
    /**
     * The workflow file under contract.
     */
    private const WORKFLOW_PATH = '.github/workflows/deploy.yml';

    /**
     * The runbook required by workflow summaries.
     */
    private const RUNBOOK_PATH = 'docs/runbooks/resume-download.md';

    /**
     * Verify the smoke stays inside the existing single-approval deployment topology.
     */
    public function test_deploy_workflow_keeps_one_approval_and_one_deploy_trigger(): void
    {
        $workflow = $this->workflow();
        $jobs = $this->workflowJobs($workflow);
        $triggerStart = strpos($workflow, "on:\n");

        $this->assertNotFalse($triggerStart);

        $permissionsStart = strpos($workflow, "\npermissions:", $triggerStart);

        $this->assertNotFalse($permissionsStart);

        $triggers = substr($workflow, $triggerStart, $permissionsStart - $triggerStart);

        preg_match_all('/^  ([a-z][a-z0-9_-]*):/m', $triggers, $triggerMatches);
        preg_match_all('/^  ([a-z][a-z0-9_-]*):$/m', $jobs, $jobMatches);

        $this->assertSame(['workflow_dispatch'], $triggerMatches[1]);
        $this->assertSame(['verify-ci', 'deploy'], $jobMatches[1]);
        $this->assertSame(1, substr_count($workflow, "    environment:\n      name: production"));
        $this->assertSame(1, substr_count($workflow, '--request POST'));
        $this->assertStringContainsString('      - name: Verify live resume download', $workflow);
        $this->assertGreaterThan(
            strpos($workflow, '      - name: Wait for Render to report success'),
            strpos($workflow, '      - name: Verify live resume download'),
        );
        $this->assertStringNotContainsString('/rollback', $workflow);
    }

    /**
     * Verify the post-live check has the exact bounded request and response contract.
     */
    public function test_deploy_workflow_adds_bounded_resume_smoke(): void
    {
        $workflow = $this->workflow();
        $deployJob = $this->workflowJob($workflow, 'deploy');
        $renderMonitorStep = $this->workflowStep(
            $workflow,
            'Wait for Render to report success',
        );
        $step = $this->smokeStep($workflow);
        $jobTimeout = $this->timeoutMinutes($deployJob, 4);
        $monitorTimeout = $this->timeoutMinutes($renderMonitorStep, 8);
        $smokeTimeout = $this->timeoutMinutes($step, 8);

        $this->assertGreaterThanOrEqual(35, $jobTimeout);
        $this->assertGreaterThanOrEqual($monitorTimeout + $smokeTimeout, $jobTimeout);
        $this->assertSame(30, $monitorTimeout);
        $this->assertSame(3, $smokeTimeout);
        $this->assertStringContainsString(
            '          RESUME_URL: https://www.kennen.dev/resume/download',
            $step,
        );
        $this->assertStringContainsString('max_attempts=3', $step);
        $this->assertStringContainsString('backoff_seconds=5', $step);
        $this->assertStringContainsString('connect_timeout_seconds=5', $step);
        $this->assertStringContainsString('attempt_timeout_seconds=25', $step);
        $this->assertStringContainsString(
            'for (( attempt=1; attempt<=max_attempts; attempt++ )); do',
            $step,
        );
        $this->assertStringContainsString('sleep "$backoff_seconds"', $step);
        $this->assertStringContainsString('--head', $step);
        $this->assertStringContainsString('--output /dev/null', $step);
        $this->assertStringContainsString('rm -f "$response_file"', $step);
        $this->assertStringContainsString('--connect-timeout "$connect_timeout_seconds"', $step);
        $this->assertStringContainsString('--max-time "$attempt_timeout_seconds"', $step);
        $this->assertStringContainsString('"$http_status" = "200"', $step);
        $this->assertStringContainsString(
            '"$content_type" = "application/octet-stream"',
            $step,
        );
        $this->assertStringContainsString('^attachment[[:space:]]*(\\;.*)?$', $step);
    }

    /**
     * Execute success and failure fixtures to verify summaries stay actionable and safe.
     */
    public function test_deploy_workflow_writes_actionable_safe_resume_smoke_summaries(): void
    {
        $step = $this->smokeStep($this->workflow());
        $script = $this->smokeScript($step);

        $this->assertStringNotContainsString('RENDER_DEPLOY_HOOK_URL', $step);
        $this->assertStringNotContainsString('${{ secrets.', $step);

        $success = $this->runSmokeFixture(
            $script,
            "200\napplication/octet-stream\nattachment; filename=\"resume.pdf\"\n"
                ."PRIVATE_RESPONSE_BODY_MARKER\n",
        );

        $this->assertTrue($success['successful'], $success['output']);
        $this->assertSame(1, $success['attempts']);
        $this->assertStringContainsString('Resume post-live smoke passed', $success['summary']);
        $this->assertStringContainsString('https://dashboard.render.com/safe-deploy', $success['summary']);
        $this->assertStringContainsString('resume-download.md', $success['summary']);
        $this->assertStringContainsString('manual rollback', $success['summary']);
        $this->assertStringNotContainsString('PRIVATE_RESPONSE_BODY_MARKER', $success['summary']);

        $failure = $this->runSmokeFixture(
            $script,
            "503\ntext/html\ninline\nPRIVATE_RESPONSE_BODY_MARKER\n",
        );

        $this->assertFalse($failure['successful']);
        $this->assertSame(3, $failure['attempts']);
        $this->assertStringContainsString('Resume post-live smoke failed', $failure['summary']);
        $this->assertStringContainsString('production is already live', $failure['summary']);
        $this->assertStringContainsString('No automatic rollback occurred', $failure['summary']);
        $this->assertStringContainsString('status=503', $failure['summary']);
        $this->assertStringContainsString('content_type=mismatch', $failure['summary']);
        $this->assertStringContainsString(
            'content_disposition=mismatch',
            $failure['summary'],
        );
        $this->assertStringContainsString('https://dashboard.render.com/safe-deploy', $failure['summary']);
        $this->assertStringContainsString('resume-download.md', $failure['summary']);
        $this->assertStringContainsString('manual rollback', $failure['summary']);
        $this->assertStringNotContainsString('PRIVATE_RESPONSE_BODY_MARKER', $failure['summary']);

        $requestFailure = $this->runSmokeFixture(
            $script,
            '',
            7,
        );

        $this->assertFalse($requestFailure['successful']);
        $this->assertSame(3, $requestFailure['attempts']);
        $this->assertStringContainsString('status=request_failed', $requestFailure['summary']);
        $this->assertStringContainsString('content_type=missing', $requestFailure['summary']);
        $this->assertStringContainsString(
            'content_disposition=missing',
            $requestFailure['summary'],
        );

        $missingHeaders = $this->runSmokeFixture(
            $script,
            "200\n\n\n",
        );

        $this->assertFalse($missingHeaders['successful']);
        $this->assertSame(3, $missingHeaders['attempts']);
        $this->assertStringContainsString('status=200', $missingHeaders['summary']);
        $this->assertStringContainsString('content_type=missing', $missingHeaders['summary']);
        $this->assertStringContainsString(
            'content_disposition=missing',
            $missingHeaders['summary'],
        );

        $recovered = $this->runSmokeFixture(
            $script,
            "200\napplication/octet-stream\nattachment ; filename=\"resume.pdf\"\n",
            0,
            true,
        );

        $this->assertTrue($recovered['successful'], $recovered['output']);
        $this->assertSame(2, $recovered['attempts']);
        $this->assertStringContainsString('attempt 1/3 failed', $recovered['output']);
        $this->assertStringContainsString('Resume post-live smoke passed', $recovered['summary']);
        $this->assertStringNotContainsString('Resume post-live smoke failed', $recovered['summary']);
    }

    /**
     * Verify the workflow's response path exists in the same checkout.
     */
    public function test_resume_runbook_documents_the_post_live_response_path(): void
    {
        $this->assertFileExists(base_path(self::RUNBOOK_PATH));

        $runbook = file_get_contents(base_path(self::RUNBOOK_PATH));
        $readme = file_get_contents(base_path('README.md'));

        $this->assertIsString($runbook);
        $this->assertIsString($readme);
        $this->assertStringContainsString('Sentry-first diagnosis', $runbook);
        $this->assertStringContainsString('Render fallback', $runbook);
        $this->assertStringContainsString('Bounded production verification', $runbook);
        $this->assertStringContainsString('Manual rollback', $runbook);
        $this->assertStringContainsString('already live', $runbook);
        $this->assertStringContainsString('no automatic rollback', $runbook);
        $this->assertStringContainsString('When Sentry evidence is unavailable', $runbook);
        $this->assertStringContainsString('five-second connection timeout', $runbook);
        $this->assertStringContainsString('25-second total timeout', $runbook);
        $this->assertStringContainsString('docs/runbooks/resume-download.md', $readme);
    }

    /**
     * Read the deployment workflow under contract.
     */
    private function workflow(): string
    {
        $workflow = file_get_contents(base_path(self::WORKFLOW_PATH));

        $this->assertIsString($workflow);

        return $workflow;
    }

    /**
     * Extract the workflow's jobs mapping.
     */
    private function workflowJobs(string $workflow): string
    {
        $start = strpos($workflow, "jobs:\n");

        $this->assertNotFalse($start);

        return substr($workflow, $start + strlen("jobs:\n"));
    }

    /**
     * Extract one named job from the workflow.
     */
    private function workflowJob(string $workflow, string $name): string
    {
        $jobs = $this->workflowJobs($workflow);
        $start = strpos($jobs, '  '.$name.":\n");

        $this->assertNotFalse($start);

        $job = substr($jobs, $start);
        $matched = preg_match(
            '/\n  [a-z][a-z0-9_-]*:\n/',
            $job,
            $nextJob,
            PREG_OFFSET_CAPTURE,
            1,
        );

        if ($matched === 1) {
            return substr($job, 0, $nextJob[0][1]);
        }

        return $job;
    }

    /**
     * Extract the named smoke step without depending on a YAML parser.
     */
    private function smokeStep(string $workflow): string
    {
        return $this->workflowStep($workflow, 'Verify live resume download');
    }

    /**
     * Extract one named workflow step without depending on a YAML parser.
     */
    private function workflowStep(string $workflow, string $name): string
    {
        $start = strpos($workflow, '      - name: '.$name);

        $this->assertNotFalse($start);

        $nextStep = strpos($workflow, "\n      - name:", $start + 1);

        return $nextStep === false
            ? substr($workflow, $start)
            : substr($workflow, $start, $nextStep - $start);
    }

    /**
     * Read a timeout from a job or step at its expected indentation.
     */
    private function timeoutMinutes(string $yaml, int $indentation): int
    {
        $matched = preg_match(
            '/^'.str_repeat(' ', $indentation).'timeout-minutes: (\d+)$/m',
            $yaml,
            $matches,
        );

        $this->assertSame(1, $matched);

        return (int) $matches[1];
    }

    /**
     * Extract and de-indent the smoke step's shell program.
     */
    private function smokeScript(string $step): string
    {
        $lines = explode("\n", $step);
        $runLine = array_search('        run: |', $lines, true);

        $this->assertIsInt($runLine);

        $script = [];

        foreach (array_slice($lines, $runLine + 1) as $line) {
            if ($line === '') {
                $script[] = '';

                continue;
            }

            if (! str_starts_with($line, '          ')) {
                break;
            }

            $script[] = substr($line, 10);
        }

        return implode("\n", $script);
    }

    /**
     * Run the workflow script with deterministic curl and sleep fixtures.
     *
     * @return array{successful: bool, attempts: int, summary: string, output: string}
     */
    private function runSmokeFixture(
        string $script,
        string $curlResult,
        int $curlExitCode = 0,
        bool $failFirstAttempt = false,
    ): array {
        $fixtureDirectory = sys_get_temp_dir().'/resume-smoke-'.bin2hex(random_bytes(8));
        $summaryPath = $fixtureDirectory.'/summary.md';
        $callsPath = $fixtureDirectory.'/curl-calls.txt';

        mkdir($fixtureDirectory, 0700, true);

        file_put_contents(
            $fixtureDirectory.'/curl',
            <<<'BASH'
#!/usr/bin/env bash
printf 'call\n' >> "$CURL_CALLS_FILE"
call_number=$(wc -l < "$CURL_CALLS_FILE")
if [ "$CURL_FAIL_FIRST_ATTEMPT" = "1" ] && [ "$call_number" -eq 1 ]; then
    printf '503\ntext/html\ninline\n'
    exit 0
fi
printf '%s' "$CURL_RESULT"
exit "$CURL_EXIT_CODE"
BASH,
        );
        file_put_contents(
            $fixtureDirectory.'/sleep',
            <<<'BASH'
#!/usr/bin/env bash
exit 0
BASH,
        );
        chmod($fixtureDirectory.'/curl', 0700);
        chmod($fixtureDirectory.'/sleep', 0700);

        $process = new Process(
            ['/bin/bash', '-e', '-o', 'pipefail', '-c', $script],
            base_path(),
            [
                'CURL_CALLS_FILE' => $callsPath,
                'CURL_EXIT_CODE' => (string) $curlExitCode,
                'CURL_FAIL_FIRST_ATTEMPT' => $failFirstAttempt ? '1' : '0',
                'CURL_RESULT' => $curlResult,
                'GITHUB_REPOSITORY' => 'kennenlaw5/kennen-portfolio',
                'GITHUB_SERVER_URL' => 'https://github.com',
                'GITHUB_SHA' => str_repeat('a', 40),
                'GITHUB_STEP_SUMMARY' => $summaryPath,
                'PATH' => $fixtureDirectory.':/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
                'RENDER_DEPLOY_URL' => 'https://dashboard.render.com/safe-deploy',
                'RESUME_URL' => 'https://www.kennen.dev/resume/download',
            ],
        );

        try {
            $process->run();
            $calls = is_file($callsPath) ? file($callsPath, FILE_IGNORE_NEW_LINES) : [];
            $summary = is_file($summaryPath) ? file_get_contents($summaryPath) : '';

            $this->assertIsArray($calls);
            $this->assertIsString($summary);

            return [
                'successful' => $process->isSuccessful(),
                'attempts' => count($calls),
                'summary' => $summary,
                'output' => $process->getOutput().$process->getErrorOutput(),
            ];
        } finally {
            foreach (['curl', 'sleep', 'curl-calls.txt', 'summary.md'] as $file) {
                $path = $fixtureDirectory.'/'.$file;

                if (is_file($path)) {
                    unlink($path);
                }
            }

            rmdir($fixtureDirectory);
        }
    }
}
