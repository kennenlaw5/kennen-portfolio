# Resume Download Incident Runbook

Use this runbook when the post-live deployment smoke, a future uptime monitor, or a
visitor report indicates that `https://www.kennen.dev/resume/download` is unavailable
or no longer returns the expected attachment. The deployment smoke is detective:
Render has already made the selected release live, and no automatic rollback occurs.

## Capture the safe incident facts

Record the first failure time, production environment, full release commit, safe
Render deployment URL, closed failure category, observed HTTP status, closed
header-check result, and any Sentry alert URL. Do not copy the resume body,
`CONTACT_RESUME_URL`, a Sentry DSN, credentials, raw exception objects, URL query
strings, or unclassified response metadata into logs, tickets, chat, or public workflow
output.

Never store or publish a Sentry DSN, API key, deploy-hook secret,
`CONTACT_RESUME_URL`, PDF contents, seeded sensitive values, raw exception, response
body, raw content-type value, or unclassified response metadata. This applies equally
to Sentry, Render logs, Tag Assistant, DebugView, screenshots, tickets, chat, workflow
summaries, and repository evidence. Never send automated tests to the production stream.

## Sentry-first diagnosis

When Sentry Error Monitoring is enabled and healthy, start with the matching Error
event. Confirm its environment and full release, then inspect the safe message, exception
type, stack frames, and closed `resume_download` fields. Use the closed reason to narrow
the investigation:

- `missing_url` or `invalid_url`: verify in Render that `CONTACT_RESUME_URL` is present,
  uses the Google Docs PDF export form, and has no Markdown wrapping. Never paste its
  value into evidence.
- `upstream_unavailable` or `upstream_response`: check Google Docs availability and the
  document's sharing/export permissions.
- `invalid_pdf`: use only the status and normalized `content_class`; do not retain or
  publish the upstream response.

Treat the Sentry event as the primary application-exception view. Compare its release
with the safe Render deployment link from the workflow summary.

## Render fallback

Use Render when Sentry is disabled, unavailable, delayed, incomplete, or when the
failure occurred during deployment, container startup, or before Laravel could report
it. Inspect the closed `resume_download_failed` stderr record and relevant platform
output from approximately 15 minutes before through 15 minutes after the first failure.
Do not broaden log capture or copy unrelated request data.

If both Sentry Error Monitoring and a future uptime monitor notify, treat Sentry as the
triggering application failure and uptime as sustained-outage confirmation. Do not add
a duplicate log alert.

## Alert semantics

Release Gate 2 means the compatible release is deployed, the non-production Sentry envelope
checks pass, account entitlements are revalidated, and deployed full-path `HEAD` proof
succeeds. The separately approved provider setup then uses exactly two resume signals:

1. One production Error Monitoring rule sends an owner email for a new or regressed
   issue filtered to `feature=resume_download` and `environment=production`. It does not
   email for every occurrence.
2. One owner-email alert workflow is attached to the account's one uptime monitor. Its
   eventual Production configuration calls
   `HEAD https://www.kennen.dev/resume/download` every 30 minutes with harmless fixed
   user agent `kennen-resume-uptime/1.0` when configurable and expected status `200`.
   It opens after two consecutive failures and resolves after two consecutive successful
   checks.

There is no third log alert. The Error Monitoring notification may arrive immediately
for an application exception; the uptime notification is deliberately delayed until a
sustained end-to-end failure. A monitor-only failure can indicate routing, limiter,
platform, or upstream drift that produced no application exception.

Before enablement, revalidate the actual account rather than relying on repository
prose. As checked against Sentry's published Developer pricing on 2026-07-24, the
working assumptions are 5,000 errors/month, one uptime monitor, and 30-day retention.
Confirm paid overage is disabled. If the entitlement differs, keep both Sentry DSNs
blank and require a new plan/owner decision. Enable Spike Protection and its owner
notification if available, but treat it as adaptive defense-in-depth rather than a hard
cap. No-cost quota exhaustion can drop later Error events and owner emails for the rest
of the billing period. Confirm from the current account entitlements or provider
documentation whether uptime checks, issue lifecycle, and owner-email delivery remain
available when Error quota is exhausted. Review usage after spikes and never treat
Error-email delivery as guaranteed. Treat Render stderr as the unconditional fallback
and uptime as an independent fallback only after that confirmation.

Release Gate 3 uses that same monitor before production cutover. Create it and keep it
disabled while pointing it at an isolated, owner-controlled non-production target. The URL
must be unauthenticated, query- and credential-free, return only fixed non-sensitive
headers/body, and support deterministic failure and recovery at the same unchanged URL
without a third-party request catcher. If no such target exists, stop with the monitor
disabled. Configure the same method, cadence, thresholds, user agent, and owner-email
workflow; enable it; and prove one failure creates no issue or email, two failures create one
uptime issue and one owner email, and two successes resolve it without changing the monitor
configuration. Disable the monitor before retargeting it to the Production URL and
environment, enable it, and confirm a successful production check plus its attached email
workflow. This consumes one entitlement without interrupting production coverage. Do not
mutate the production resume URL, document permissions, limiter, or route to test the
lifecycle.

## Bounded production verification

Make one bounded `HEAD` request from a trusted operator machine. It uses a
five-second connection timeout and a 25-second total timeout:

```bash
curl --head --location --silent --show-error \
  --connect-timeout 5 \
  --max-time 25 \
  --output /dev/null \
  --write-out 'status=%{http_code}\ncontent_type=%{content_type}\ncontent_disposition=%header{content-disposition}\n' \
  https://www.kennen.dev/resume/download
```

Success requires status `200`, exact content type `application/octet-stream`, and a
`Content-Disposition` value whose disposition type is `attachment`. A `429` means the
normal limiter is active and is an availability failure to investigate, not a reason
to add a bypass.

Treat the printed content type and disposition as transient local inspection only.
Immediately reduce each field to `ok`, `mismatch`, or `missing`; store only that closed
header-check result, never the raw values.

If `HEAD` results and provider evidence disagree, make at most one bounded `GET` to a
local temporary file, verify the same headers and the leading `%PDF-` signature, and
delete the file immediately. Do not print or attach the document. Never create failure
evidence by changing production resume configuration, Google Docs permissions, limiter
settings, or public routing.

## Manual rollback

The failed smoke means the deployment is already live and no automatic rollback has
occurred. GitHub may therefore show the protected environment deployment as failed even
though Render reports the release as `live`; use the workflow summary and Render deploy
record to distinguish a smoke failure from a failed release. If the failure began with
that release and warrants rollback:

1. Open the safe Render deployment link from the GitHub Actions summary.
2. Compare its commit with the failing Sentry release when that evidence is available.
   When Sentry evidence is unavailable, use the exact workflow commit and Render
   deployment record instead; Render remains authoritative for deployment, container,
   and startup state. Confirm the preceding deploy is known-good.
3. Decide whether the target release supports the current analytics, Sentry privacy, and
   full-path `HEAD` contracts. Before an incompatible rollback, stage
   `ANALYTICS_ENABLED=false`; remove or unset `GOOGLE_ANALYTICS_MEASUREMENT_ID`,
   `SENTRY_LARAVEL_DSN`, and `SENTRY_DSN`; confirm `SENTRY_ENABLE_LOGS=false`,
   `LOG_CHANNEL=stack`, and `LOG_STACK=stderr`; then pause the resume issue notification,
   uptime monitor, and uptime owner-email workflow. Do not save intermediate environment
   states. Save the staged provider settings together through exactly one compatible
   environment-change deployment and wait until it is live before starting the incompatible
   rollback; do not trigger an additional concurrent deploy and do not change
   `CONTACT_RESUME_URL`. For a compatible rollback, leave provider environment values in
   place and pause only the resume issue notification and uptime signal while the monitored
   route may be unavailable.
4. Use Render's manual rollback action for the web service and monitor it until Render
   reports `live`.
5. Repeat the bounded production `HEAD` verification.
6. Correct the code or configuration cause, let automatic `main` CI pass, and deploy
   the exact corrective commit through the normal single-approval workflow.

Do not enable Render Auto-Deploy, trigger a second concurrent deploy, weaken `/up`, or
change the resume limiter to recover the smoke.

## Close the incident

After correction, rerun the production contract check. Restore only provider settings and
signals that had separate approval and were enabled before the incident. After the compatible
release and renewed approval are in place, explicitly re-enable only the resume issue
notification, uptime owner-email workflow, and Production monitor that were paused; leave
absent or pre-gate signals disabled. Confirm the intended owner recipient and a successful live
check, then wait for the uptime monitor's two consecutive successful checks when that monitor
was restored. When correction included a deployment, require the new post-live workflow smoke;
otherwise the repeated bounded `HEAD` check is the new recovery smoke. Record root cause and
remediation in the repository only when they change code, configuration conventions, or this
runbook.
