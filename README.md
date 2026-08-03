# kennen.dev

Source code for [Kennen Lawrence's portfolio](https://kennen.dev). The site presents professional experience, featured projects, technical skills, contact information, and a pair of interactive engineering experiments.

The project uses Laravel as a thin server-side shell for a React single-page application. Nearly all routing, content, presentation, and interaction live in the TypeScript frontend.

## Tech stack

- Laravel 13 and PHP 8.5
- React 19 and TypeScript in strict mode
- React Router 8
- Vitest, jsdom, and React Testing Library
- Webpack 5 with `ts-loader`
- Tailwind CSS 3 and SCSS Modules
- Docker Compose with nginx, PHP-FPM, and MySQL 8
- Render deployment through the production Docker target

## Architecture

Laravel SPA page routes return Blade views that contain the React mount point. The shared Blade layout loads the compiled assets and exposes public contact and analytics configuration through `window.APP_CONFIG`. React then renders the requested page through `BrowserRouter`.

```text
Request
  -> routes/web.php
  -> Blade SPA shell
  -> resources/js/App.tsx
  -> React Router page
```

SPA page routes are declared in both of these files and must remain synchronized:

- `routes/web.php` handles direct requests and browser refreshes for SPA pages.
- `resources/js/constants/routes.ts` controls client-side rendering and navigation.

Tracked client routes must also be present in the canonical analytics allowlist in
`resources/js/analytics/contracts.ts`. A contract test enforces synchronization between
the client route table and that allowlist.

Blade views are mount shells only. Visible page content belongs in `resources/js`, not in the route-specific Blade files.

`routes/api.php` remains loaded for future application APIs but currently registers no
routes. Browser analytics never traverse Laravel; any future API must define its own
explicit origin, schema, validation, and rate-limit boundaries.

`GET` and `HEAD /resume/download` use the same server-only file endpoint. Both methods
retrieve and validate the complete configured upstream PDF through the normal limiter;
`GET` returns it as a same-origin attachment, while `HEAD` returns the same status and
attachment metadata without transferring the body. This is not a React route and does
not belong in the client route table.

## Prerequisites

For local development without Docker:

- PHP 8.5
- Composer
- Node.js 24 and Yarn 1.22

For the containerized environment:

- Docker Desktop with Docker Compose
- Git Bash or WSL when running `docker-reboot` on Windows

## Initial setup

Install the PHP and JavaScript dependencies:

```bash
composer install
yarn install --frozen-lockfile
```

Create the local environment file and application key:

```bash
cp .env.example .env
php artisan key:generate
```

The default environment uses SQLite. Create and migrate the local database on a fresh checkout:

```bash
php -r "file_exists('database/database.sqlite') || touch('database/database.sqlite');"
php artisan migrate
```

Compile the frontend assets:

```bash
yarn dev
```

Webpack writes generated JavaScript and CSS to `public/js` and `public/css`. Those directories are intentionally ignored by Git.

## Running locally

Start Laravel's development server:

```bash
php artisan serve
```

The application will be available at [http://127.0.0.1:8000](http://127.0.0.1:8000). During frontend development, run the asset watcher in a second terminal:

```bash
yarn watch
```

## Running with Docker

The Docker environment expects these values in `.env`:

```dotenv
APP_URL=http://localhost:8080
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=kennen_portfolio
DB_USERNAME=root
DB_PASSWORD=
DOCKER_HTTP_PORT=8080
DOCKER_MYSQL_PORT=3306
```

After installing dependencies and building the frontend assets, start or restart the Docker environment from Git Bash or WSL:

```bash
./docker-reboot
```

From PowerShell, invoke the same script through Bash:

```powershell
bash ./docker-reboot
```

The script creates the shared nginx proxy network when necessary, removes orphaned project containers, rebuilds the development image, and starts the stack. Open [http://localhost:8080](http://localhost:8080) after the containers are healthy.

The local Compose stack uses the `development` stage in `docker/php/Dockerfile`. Render uses the final `production` stage from the same file, which builds the PHP dependencies and minified frontend assets into the deployed image.

Useful Docker commands:

```bash
docker compose ps
docker compose logs -f
docker compose down
```

## Environment-backed contact and resume configuration

Visible contact details must not be hardcoded in React. Configure them in `.env` using these variables:

```dotenv
CONTACT_PHONE=
CONTACT_EMAIL=
CONTACT_LINKEDIN_URL=
CONTACT_GITHUB_URL=
CONTACT_CITY=
CONTACT_STATE_ABBREVIATION=
```

The values flow through the application in this order:

```text
.env
  -> config/app.php
  -> window.APP_CONFIG
  -> React components
```

The upstream resume URL is configured separately and remains server-side:

```dotenv
CONTACT_RESUME_URL=https://docs.google.com/document/d/document-id/export?format=pdf
RESUME_DOWNLOAD_RATE_LIMIT_PER_IP=30
RESUME_DOWNLOAD_RATE_LIMIT_GLOBAL=120
```

`config/resume.php` reads this value, and `ResumeDownloadService` retrieves it when a
visitor requests `/resume/download`. The URL must be an absolute HTTPS URL whose
response declares `application/pdf` and begins with the PDF signature. Laravel's named
`GET` route also accepts `HEAD`; the framework still executes the controller's real
upstream `GET` and complete PDF validation before removing the downstream response
body. Laravel returns validated content as a same-origin attachment; the upstream URL
is never serialized into `window.APP_CONFIG`.

Missing or invalid configuration returns `503`; upstream and validation failures return
`502`. Each handled failure crosses Laravel's reporting pipeline once, produces one
sanitized Sentry Error event when transport is healthy, and writes one closed
`resume_download_failed` warning to the explicit `stderr` channel without Laravel's
generic duplicate. Successful responses use `no-store` so a newly published resume is
picked up on the next request.

`HEAD` consumes the same per-IP and shared global limiter as `GET`. It preserves the
same `502`/`503` typed failure reporting and returns `429` normally when the limiter is
exhausted; monitoring must not bypass those policies.

The React links intentionally omit the HTML `download` attribute. A successful Laravel
response supplies `Content-Disposition: attachment`, while an upstream or configuration
error remains visible in the browser instead of being saved under a misleading PDF filename.

Render terminates public traffic at its load balancer and does not publish stable ingress
CIDRs, so `bootstrap/app.php` trusts the proxy address while accepting only the forwarded
client address and protocol. Forwarded host, port, and path-prefix values are intentionally
ignored.

Render normalizes the first `X-Forwarded-For` address and keeps the service origin behind its
edge. The per-IP limit relies on that deployment contract and remains a best-effort fairness
control rather than an authentication boundary. Moving the application off Render or exposing
its origin directly requires revalidating this assumption.

The named resume limiter defaults to 30 requests per client and 120 requests globally per
minute. Both values are environment-configurable. The global bucket bounds upstream work even
when callers rotate genuine addresses. Limiter state uses Laravel's configured cache; keep
that cache shared if the service is scaled to multiple instances.

## Browser analytics

The React application routes page views, resume-download clicks, project-link clicks,
and contact-link clicks through a typed GA4 adapter. Events use closed, non-personal
parameters: canonical page paths, contact methods, stable project IDs, and the home or
experience resume placement. The resulting data is forgeable, best-effort,
browser-reported directional telemetry—not proof of a human visitor or an auditable
interaction ledger.

The adapter stays inert unless analytics is configured and the visitor has granted
permission. Do Not Track and Global Privacy Control prevent analytics from becoming
active, and GA4 automatic page views are disabled so React Router remains the page-view
authority. Analytics failures are isolated from the underlying navigation and download
interactions.

The `resume_download_clicked` event represents click intent, not confirmation that the
browser saved the response. The former public Laravel analytics-ingestion endpoint was
removed rather than maintained as a partial custom analytics platform; no replacement
proxy or application-owned analytics datastore exists.

Before enabling analytics, the GA4 web stream must also disable Enhanced Measurement's
**Page changes based on browser history events** option. `send_page_view: false` disables
the tag-load page view but does not disable that property-level history listener. The
adapter supplies only canonical same-origin page context and suppresses referrer
attribution so query strings, fragments, and external referrer details are not sent.

## Backend error monitoring

Laravel exceptions flow through the installed Sentry Error Monitoring integration, but
transport remains off until a server-side `SENTRY_LARAVEL_DSN` or `SENTRY_DSN` is
deliberately configured. Structured Logs, tracing, profiling, metrics, browser Sentry,
replay, user feedback, and attachments remain outside this phase. The dormant
`sentry_logs` channel is not part of the active logging stack; Render stderr remains the
independent framework, startup, and provider-outage fallback.

`SentryTelemetrySanitizer` is the single final `before_send` boundary for Error events.
It constructs a new allowlisted event that preserves environment, full release, exception
type, safe file/line frames, safe generic messages, and normal grouping evidence. It
removes request URLs and queries, bodies, headers, cookies, user/contact fields, IPs,
referrers, user agents, breadcrumbs, arbitrary extra/context objects, frame variables,
OS/runtime context bags, and inbound trace or baggage context. Known configured URLs,
DSNs, contact values, absolute URLs, email addresses, and credential/token patterns are
redacted from retained strings.

Generic exception messages remain diagnostic by default. The locked Laravel/Guzzle
request and connection exception families use the code-owned message
`An outbound HTTP request failed.` because their native messages may embed URLs,
credentials, or response bodies. Laravel `QueryException` and `PDOException` use
`A database operation failed.` because their native messages may embed SQL, bindings,
or connection details. These are explicit type checks; the application does not parse
arbitrary messages into tags, fingerprints, or product meaning.

The total adapter catches every internal `Throwable`, performs no recursive logging, and
returns `null` so only the affected remote event is dropped. Laravel's later report
callbacks, normal HTTP handling, and stderr fallback continue. Automated tests use a
synthetic in-memory transport and never a real DSN.

Handled resume failures use typed domain exceptions with a closed reason and optional
validated upstream status plus normalized `pdf`, `html`, `other`, or `missing` content
class. The Sentry callback runs first; the last typed callback emits the closed stderr
record and suppresses Laravel's generic typed-family log. Both surfaces share only the
constant event/component, reason, bounded context, environment, and release. Raw
requests, responses, URLs, bodies, headers, content types, and upstream exceptions are
not retained or chained. If reporting or logging fails, the existing controlled HTTP
response remains authoritative.

## Telemetry ownership and activation readiness

### Signal ownership and trust

Each signal has one primary question and an independent failure boundary:

- GA4 owns browser-reported intent after effective analytics permission. It provides
  commodity browser analytics—durable event collection, navigation reports, and
  provider-side filtering—that the portfolio should not rebuild as a partial custom
  platform. Its public events remain forgeable, best-effort directional telemetry.
- Sentry Error Monitoring owns Laravel exceptions. It groups application failures and
  preserves safe diagnostic evidence after the final sanitizer.
- Render owns deployment, container, bootstrap, and stderr evidence. It remains
  authoritative when a failure happens before Laravel starts or while Sentry is
  unavailable.
- The Sentry uptime monitor owns sustained end-to-end resume availability after its
  separate activation gate. It calls the real route, which makes Laravel fetch and
  validate the complete upstream PDF.

No browser event proves humanity, authorization, or a completed device save. Laravel
still owns application behavior, authorization boundaries, upstream PDF validation,
typed failures, and the closed operational vocabulary. Sentry cannot replace
pre-bootstrap or platform evidence because its SDK runs inside Laravel.

The post-live smoke is detective: Render has already made the release live when the
check runs. The recurring monitor detects later drift between deployments. Neither
signal gates traffic or triggers an automatic rollback.

The current Sentry phase is Error Monitoring only. The generated `sentry_logs` channel
stays available but outside the active stack, with `LOG_STACK=stderr` preserving the
independent Render fallback. Structured Logs remains deferred until the Square Off
operational catalog contains several meaningful non-exception events. That later phase
must make a fresh price, privacy, transport, and quota decision instead of inheriting
this dormant channel as approval.

### Safe configuration matrix

These are sanitized names and repository defaults or production rules, not live
provider values:

| Variable | Default or production rule | Purpose |
|---|---|---|
| `ANALYTICS_ENABLED` | `false` | Master GA4 activation boundary |
| `GOOGLE_ANALYTICS_MEASUREMENT_ID` | blank | Public stream identifier; add while analytics remains off |
| `SENTRY_LARAVEL_DSN` / `SENTRY_DSN` | blank | Server-only Error Monitoring transport boundary |
| `SENTRY_RELEASE` | blank | Falls back to the full `RENDER_GIT_COMMIT` |
| `SENTRY_ENABLE_LOGS` | `false` | Keeps Structured Logs disabled |
| `SENTRY_ENABLE_METRICS` | `false` | Keeps Application Metrics disabled |
| `SENTRY_SEND_DEFAULT_PII` | `false` | Prevents default PII collection |
| `SENTRY_MAX_REQUEST_BODY_SIZE` | `none` | Prevents request-body capture |
| `SENTRY_DEFAULT_INTEGRATIONS` | `false` | Keeps unsafe automatic integrations off |
| `SENTRY_MAX_BREADCRUMBS` | `0` | Keeps breadcrumbs out of Error events |
| `SENTRY_TRACES_SAMPLE_RATE` | `0` | Keeps tracing disabled |
| `SENTRY_PROFILES_SAMPLE_RATE` | `0` | Keeps profiling disabled |
| `LOG_CHANNEL` | `stack` | Uses Laravel's normal logging stack |
| `LOG_STACK` | `stderr` | Keeps Render stderr independent from Sentry |
| `CONTACT_RESUME_URL` | required in production; blank is the fail-closed default | Server-only upstream PDF export URL; never publish its value |

The production image also enforces `zend.exception_ignore_args=On`; stack frames retain
safe file and line evidence without serializing argument values.

### GA4 activation gate

1. Deploy the compatible commit with both providers off. Keep
   `ANALYTICS_ENABLED=false` while adding the public measurement ID.
2. Create the production Web stream for `https://www.kennen.dev` and, when the account
   structure permits it, a separate non-production stream. Keep Google Signals,
   advertising personalization, unnecessary Enhanced Measurement events, and
   **Page changes based on browser history events** disabled.
3. Choose the event-level retention deliberately and record the account choice. Register
   a closed custom parameter only when a report actually requires it.
4. In a non-production stream, use browser Network inspection and Tag Assistant to prove
   no Google request occurs before effective permission; all four Basic Consent Mode v2
   defaults are denied before configuration; only `analytics_storage` becomes granted;
   and automatic page views remain off. Then confirm the closed events in DebugView.
   Never send automated tests to the production stream.
5. Obtain separate owner approval, set `ANALYTICS_ENABLED=true`, redeploy the compatible
   commit, and repeat the production Network/Tag Assistant checks without synthetic
   events. DNT or detected GPC continues to override a stored grant without erasing it.

This is Basic Consent Mode v2: denied visitors send no pre-consent or cookieless Google
pings because the tag is not loaded. Advertising-related consent remains denied.

### Sentry activation gate

1. Deploy the compatible commit with both DSNs blank, `SENTRY_ENABLE_LOGS=false`,
   `LOG_CHANNEL=stack`, and `LOG_STACK=stderr`.
2. Verify Composer still locks `sentry/sentry-laravel` `4.27.0` and `sentry/sentry`
   `4.29.0`, and confirm those versions remain compatible with Laravel 13 before
   activation.
3. Revalidate the actual account entitlements and usage. As checked against Sentry's
   published Developer pricing on 2026-07-24, the working assumptions are 5,000
   errors/month, one uptime monitor, and 30-day retention. Confirm paid overage is
   disabled. If any entitlement differs, keep both DSNs blank and require a new
   plan/owner decision. No-cost quota exhaustion can drop later Error events and owner
   emails for the rest of the billing period. Confirm from the current account
   entitlements or provider documentation whether uptime checks, issue lifecycle, and
   owner-email delivery remain available when Error quota is exhausted. Review usage
   after spikes and never treat Error-email delivery as guaranteed. Treat Render stderr
   as the unconditional fallback and uptime as an independent fallback only after that
   confirmation.
4. Enable Spike Protection and its owner notification when the account exposes them.
   Treat Spike Protection as adaptive defense-in-depth, never as a configurable hard
   quota.
5. In non-production only, configure the DSN and run `php artisan sentry:test` without
   `--transaction`. Treat that command as transport proof only; it does not prove the
   application's final sanitizer. Separately exercise an application-generated safe generic
   exception, seeded-risky generic exceptions, and every typed resume reason:
   `missing_url`, `invalid_url`, `upstream_unavailable`, `upstream_response`, and
   `invalid_pdf`.
6. Use those application-generated events to verify environment, full release,
   final-envelope privacy, safe-message retention, targeted replacement/redaction, closed
   resume fields sourced from exception getters, normal grouping without message-derived
   fingerprints, reportable-callback order, and transport/sanitizer failure isolation.
7. After that proof and separate owner approval, configure only the server-side DSN and
   redeploy the same compatible commit. Keep repository integration, release uploads,
   Structured Logs, tracing, profiling, metrics, browser Sentry, replay, feedback, and
   attachments disabled.

### Resume alert and monitor gate

Release Gate 2 is complete only after the compatible release is deployed, the non-production
Sentry envelope checks pass, account entitlements are revalidated, and the deployed full-path
`HEAD` verification succeeds. Then configure the two production signals:

- Create one production issue notification for a new or regressed
  `feature=resume_download` and `environment=production` Error Monitoring issue. Send
  one owner email; do not notify on every occurrence.
- Create one owner-email alert workflow for uptime issues and attach it to the account's
  one uptime monitor. The eventual Production configuration uses
  `HEAD https://www.kennen.dev/resume/download` every 30 minutes, harmless fixed user
  agent `kennen-resume-uptime/1.0` when configurable, and expected status `200`. Open
  after two consecutive failures and resolve after two consecutive successful checks.
- Keep paid overage disabled and create no third log alert. The Error Monitoring alert
  represents the triggering application exception; the uptime issue represents a
  sustained end-to-end outage.

Release Gate 3 proves the hosted lifecycle without buying or creating a second monitor.
Before production cutover, create the one monitor and keep it disabled while pointing it at an
isolated, owner-controlled non-production target. The URL must be unauthenticated, query- and
credential-free, return only fixed non-sensitive headers/body, and support deterministic
failure and recovery at the same unchanged URL without a third-party request catcher. If no
such target is available, stop the gate with the monitor disabled. Configure the same method,
interval, thresholds, user agent, and owner-email workflow; enable it; and prove that one
failure creates no issue or email, two consecutive failures create one uptime issue and one
owner email, and two consecutive successful checks resolve the issue without changing the
monitor configuration. Disable the monitor before retargeting it to the Production URL and
environment, then enable it and confirm a successful production check plus the attached
owner-email workflow. This consumes one entitlement; production coverage begins only after the
transition, so lifecycle proof does not interrupt an existing production monitor. Repository
tests do not claim to exercise Sentry's hosted alert service.

### Provider rollback order

For an incompatible target—or a provider-caused incident that requires transport
shutdown—stage steps 1–4 without saving intermediate environment states. For a
compatible rollback unrelated to a provider incident, skip steps 1, 2, and 4; perform
step 3 only while the monitored route may be unavailable, then continue with step 6.

1. Stage `ANALYTICS_ENABLED=false`.
2. Stage removal of `SENTRY_LARAVEL_DSN` and `SENTRY_DSN` to stop Error Monitoring
   transport while preserving Render stderr.
3. Pause the Sentry issue notification and uptime monitor while the provider or monitored
   route is intentionally unavailable, and disable the uptime owner-email workflow.
4. Stage `SENTRY_ENABLE_LOGS=false`, ensure no active log stack names `sentry_logs`, and
   stage removal of
   `GOOGLE_ANALYTICS_MEASUREMENT_ID`.
5. Save the staged provider settings together through exactly one compatible
   environment-change deployment and wait until it is live before starting an incompatible
   rollback. Do not trigger an additional concurrent deploy. Do not change
   `CONTACT_RESUME_URL`.
6. Roll back manually, verify `/up`, run the bounded resume `HEAD` check, and restore
   provider settings only after the compatible release and separate approval return.
7. Restore only provider settings and signals that had separate approval and were enabled
   before the rollback. After the compatible release and renewed approval are in place,
   explicitly re-enable only the resume issue notification, uptime owner-email workflow, and
   Production monitor that were paused. Leave absent or pre-gate signals disabled. Confirm the
   intended owner recipient, one successful live check, and the normal two-success recovery
   before treating alerting as restored.

Never store or publish a Sentry DSN, API key, deploy-hook secret,
`CONTACT_RESUME_URL`, PDF contents, seeded sensitive values, raw exception, response
body, raw response headers, or unclassified provider payload in tests, screenshots,
tickets, workflow summaries, or review artifacts. Safe evidence is limited to time,
environment, full release, closed failure category, normalized status/header state, safe
provider or Render links, and pass/fail results.

Provider references:

- [Sentry pricing](https://sentry.io/pricing/)—recheck the actual account before activation.
- [Google Basic versus advanced Consent Mode](https://developers.google.com/tag-platform/security/concepts/consent-mode).
- [Google Consent Mode setup and Tag Assistant verification](https://developers.google.com/tag-platform/security/guides/consent).
- [GA4 data retention controls](https://support.google.com/analytics/answer/7667196).

## Frontend commands

```bash
yarn dev          # one-time development build and TypeScript check
yarn watch        # rebuild when source files change
yarn prod         # minified production build
yarn typecheck    # strict TypeScript check without emitting assets
yarn test         # run the frontend test suite once
yarn test:watch   # run frontend tests in watch mode
yarn lint         # lint JavaScript, TypeScript, React, and JSX accessibility
yarn lint:styles  # lint SCSS and SCSS Modules
yarn format       # format frontend JavaScript and TypeScript with Prettier
```

## Tests and formatting

Run the PHP and frontend test suites:

```bash
php artisan test
yarn test
```

Format PHP code with Laravel Pint:

```bash
./vendor/bin/pint
```

Check PHP code independently with the Pint-compatible PHP_CodeSniffer ruleset:

```bash
composer lint:php
```

TypeScript is checked by `ts-loader` during every frontend build. ESLint checks
JavaScript, TypeScript, React Hooks, and JSX accessibility. Vitest runs the TypeScript
unit and component tests in jsdom. Prettier is configured for frontend source, but the
existing frontend has not been bulk-reformatted; `yarn format` is an explicit write
operation rather than a current CI gate.

Audit the locked dependencies:

```bash
composer audit --locked
yarn audit --groups dependencies
```

## Continuous integration

`.github/workflows/ci.yml` follows the production toolchain and runs on pull requests
and pushes to `main`:

- PHP 8.5, Pint, PHP_CodeSniffer, and PHPUnit
- Node.js 24, ESLint, Stylelint, strict TypeScript, Vitest, and a production Webpack build
- Composer and production JavaScript dependency audits
- A BuildKit build of the Docker `production` target without pushing an image

The Docker job is the deployment safety check: it builds `docker/php/Dockerfile` with the same target Render uses. To run that check locally:

```bash
docker build --file docker/php/Dockerfile --target production .
```

## Production deployments

Merging to `main` does not deploy automatically. Production releases use the manual
`Deploy to Render` GitHub Actions workflow:

1. Open **Actions → Deploy to Render → Run workflow** and select `main`.
2. The workflow verifies that the selected commit already has a successful automatic
   `main` CI run; it does not repeat the build and test suite.
3. Approve the pending `production` environment deployment.
4. GitHub calls the Render deploy hook with that exact commit SHA.
5. GitHub monitors that specific Render deploy until Render reports it as `live` or
   reports a terminal failure.
6. After Render reports `live`, the same deploy job makes at most three bounded `HEAD`
   requests to the public resume endpoint and requires status `200`, exact
   `application/octet-stream` content type, and an attachment disposition.

The GitHub `production` environment is restricted to `main` and protects the
`RENDER_DEPLOY_HOOK_URL` and `RENDER_API_KEY` secrets behind required approval. Keep
Render **Auto-Deploy** set to **Off** and its health check path set to `/up`. The deploy
hook URL comes from the Render service's **Settings** page. Create the API key in
Render's **Account Settings**; the workflow uses it only to retrieve the status of the
deploy ID returned by the hook. Store both values as environment secrets, never in this
repository.

This flow allows multiple changes to accumulate on `main` before intentionally
releasing the latest validated commit. Wait for the automatic CI run to succeed before
starting a deployment. The resume smoke is detective: a failure happens after the
release is already live, does not trigger an automatic rollback, and links the
[resume-download runbook](docs/runbooks/resume-download.md). If a release needs to be
reverted, use Render's rollback action and then deploy the corrective commit through
the same workflow.

Render supplies application secrets and contact configuration at runtime. `.dockerignore`
prevents local `.env` files, dependencies, generated assets, and repository metadata
from entering the Docker build context.

## Repository structure

```text
app/                         Thin Laravel layer, including SPA and resume support
config/app.php               Application and public contact configuration
config/analytics.php         Public fail-closed analytics configuration
config/resume.php            Server-only upstream resume configuration
docker/                      nginx, PHP, and MySQL configuration
.github/workflows/           CI checks and the approved Render deployment workflow
resources/js/                React application, content, and browser logic
resources/js/components/     Reusable and feature components
resources/js/constants/      Routes and static domain data
resources/js/pages/          Top-level route components
resources/sass/              Global styles and SCSS Modules
resources/views/             Blade shells for the React application
routes/api.php               Empty route file reserved for explicitly designed future APIs
routes/web.php               Server-side SPA routes and the resume download endpoint
tests/                       PHPUnit feature and unit tests
vitest.config.ts             Frontend unit and component test configuration
webpack.config.js            Active frontend build configuration
```

## Development conventions

- Keep visible content and UI behavior in React/TypeScript.
- Keep Blade views limited to mounting and configuring the SPA.
- Use the configured `JS`, `Components`, `Constants`, and `Sass` import aliases.
- Prefix TypeScript types with `T` and keep strict typing intact.
- Prefer Tailwind utilities for layout and SCSS Modules for component-specific or stateful styles.
- Preserve distinct project entries and their external links unless a content change explicitly calls for consolidation.
- Use Yarn for JavaScript dependencies; `yarn.lock` is the tracked deployment lockfile.
- Run `yarn lint`, `yarn lint:styles`, `yarn typecheck`, `yarn test`, and `yarn prod` before submitting frontend changes.

The `/projects` and `/skills` Laravel routes currently have no corresponding client routes. Project and skill content is presented through the existing home and experience pages.
