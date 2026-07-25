# Resume Download Incident Runbook

Use this runbook when the post-live deployment smoke, a future uptime monitor, or a
visitor report indicates that `https://www.kennen.dev/resume/download` is unavailable
or no longer returns the expected attachment. The deployment smoke is detective:
Render has already made the selected release live, and no automatic rollback occurs.

## Capture the safe incident facts

Record the first failure time, production environment, full release commit, safe
Render deployment URL, observed HTTP status, closed header-check result, and any Sentry
alert URL. Do not copy the resume body, `CONTACT_RESUME_URL`, a Sentry DSN, credentials,
raw exception objects, URL query strings, or unclassified response metadata into logs,
tickets, chat, or public workflow output.

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
3. Use Render's manual rollback action for the web service and monitor it until Render
   reports `live`.
4. Repeat the bounded production `HEAD` verification.
5. Correct the code or configuration cause, let automatic `main` CI pass, and deploy
   the exact corrective commit through the normal single-approval workflow.

Do not enable Render Auto-Deploy, trigger a second concurrent deploy, weaken `/up`, or
change the resume limiter to recover the smoke.

## Close the incident

After correction, rerun the production contract check and, once configured, wait for
the uptime monitor's two-success recovery. Record root cause and remediation in the
repository only when they change code, configuration conventions, or this runbook.
