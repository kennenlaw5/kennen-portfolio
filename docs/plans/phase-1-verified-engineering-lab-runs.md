# Phase 1 Plan: Verified Square Off Runs, Replays, and Statistics

**Status:** Proposed; requires explicit approval before implementation
**Phase:** 1 of 3
**Depends on:** The current Laravel 13 + React 18 portfolio
**Precedes:** Phase 2 polyglot services and Phase 3 Engineering Lab accessibility remediation

## Summary

Build one deep backend vertical slice around Square Off Pro: completed browser games can be submitted to Laravel, replayed against a versioned server-side rules engine, classified as valid or invalid, and included in durable public aggregate statistics only after validation. Add a separate `/games/statistics` React page plus unlisted replay links while keeping the existing `/games` selector and local game behavior intact.

This phase is intentionally a modular Laravel monolith. It demonstrates API design, request validation, durable data modeling, idempotent jobs, rule-engine parity, observability, abuse controls, migrations, and operational thinking before Phase 2 introduces a BFF and Python service. It does not claim to prove that a human played a game: anonymous public endpoints are always scriptable. The security goal is to bound and detect abuse, validate every stored outcome, and preserve statistical integrity.

Most importantly, players receive **no deletion capability**. Allowing a player to selectively delete losses would make the aggregate statistics meaningless. Validated runs are immutable. This plan recommends a reversible, operator-only quarantine action with an append-only audit record as an administrative integrity safeguard; that recommendation remains pending approval with the rest of this plan.

## Current context

- Square Off Pro is entirely client-side. Its React reducer and helpers own move resolution, history, score calculation, undo, and the random computer opponent.
- `previousMoves.locations` is one-based for display/history while `SET_SQUARE` actions are zero-based. The API contract must normalize coordinates instead of serializing reducer state.
- Capture order is significant: the active player's captures resolve before the opponent's overlapping trap. Existing TypeScript coverage protects one version of this rule.
- `/games` is a React selector inside the shared SPA shell. `routes/web.php` and `resources/js/constants/routes.ts` must remain synchronized for hard loads.
- Laravel currently exposes only anonymous analytics and resume-download behavior. There is no queue worker or scheduler in the deployed topology.
- CI uses SQLite, local Docker uses MySQL 8, and production uses the existing Render Postgres datastore. New migrations and queries must work on all three.
- Render deploys the root production Docker image through the existing manually approved, commit-pinned GitHub workflow. `/up` must remain the portfolio liveness check.
- The current Render cost is approximately $13.30/month: one Starter web service plus a Basic-256MB Postgres datastore and disk. Phase 1 should add no Render service.

## Goals

1. Persist only completed Square Off games admitted through a bounded, idempotent API.
2. Recompute the full game on the server from a canonical move transcript before it affects public statistics.
3. Distinguish Person-versus-Person (PVP) from Person-versus-Computer (PVE), including difficulty and AI version metadata for PVE.
4. Expose durable aggregate statistics and unlisted, capability-protected replays without adding accounts or personal data.
5. Keep Square Off playable when the database, validation path, or statistics API is unavailable.
6. Make operational failure, abuse, data growth, validation outcomes, and deployment health diagnosable from Render logs and smoke checks.
7. Document why this architecture exists, which trust boundaries remain, and how Phase 2 can replace adapters without removing Phase 1 functionality.

## Resolved decisions and pending recommendation

| Decision | Answer | Source |
|---|---|---|
| Backend showcase | One deep Square Off verified-run/replay/statistics slice, not several shallow endpoints | User accepted recommendation |
| Statistics location | A separate `/games/statistics` page, linked from the Engineering Lab and completed Square Off state; not global navigation initially | User |
| Initial client | Phase 1 React reads Laravel REST through a replaceable data adapter | Recommended and accepted |
| Gameplay authority | React remains authoritative for immediate local play; Laravel validates a completed run once | User discussion |
| Submission timing | Submit only a full, completed 100-move game | User discussion |
| Validation execution | Persist pending, dispatch `ValidateSquareOffRun` after commit, and use a configurable queue connection set to `sync` initially | User accepted recommendation |
| Optimism | The completing player may see a local/pending status immediately; public statistics include only server-valid included runs and, if the recommended safeguard is approved, exclude quarantined runs | User accepted recommendation; quarantine condition is pending plan approval |
| Session trigger and minimum duration | The first accepted local move asynchronously requests the signed session without blocking the reducer; runs received less than 10 seconds after issuance are invalid, using a configurable server-observed verification-session duration rather than exact active play time | User threshold plus clarified implementation recommendation |
| PVE validation | Validate move legality and outcome, but do not attempt to reproduce the random AI strategy | User accepted recommendation |
| Public statistics | Total verified runs; PVP/PVE split; PVE difficulty split; red/blue/tie distribution; average and median server-observed verification-session duration; average score margin, captured squares, and lead changes; runs in the last 30 days | User accepted recommendation; duration label clarified |
| Public run visibility | Aggregate statistics are public; individual replays are unlisted capability URLs and are never publicly listed in Phase 1 | User accepted recommendation |
| Player deletion | No delete endpoint, delete token, or browser delete control | User: deletion would permit selective-loss removal and skew statistics |
| Exceptional moderation | **Recommended administrative safeguard pending plan approval:** operator-only, non-destructive quarantine/reinstate commands with an append-only audit trail; quarantine is reserved for confirmed abuse, system duplication, validation defects, or corruption—not an unfavorable outcome—and never mutates the verified transcript or outcome | Recommendation pending user approval |
| Valid-data retention | Valid runs are retained permanently; if the recommended safeguard is approved, quarantined runs and their audits are also permanent unless a future, separately approved retention policy changes this | User for valid runs; recommendation for quarantine |
| Invalid-data retention | Invalid raw transcripts are cleared when rejected; bounded reason metadata remains seven days; aggregate rejection counters remain | User accepted recommendation |
| Stale-data retention | Abandoned pending submissions and short-lived admission/idempotency receipts expire after approximately 24 hours | User accepted recommendation |
| Production database | Reuse durable Render Postgres; do not use container-local SQLite in production | Explored and recommended |
| Additional Render cost | No new service or workspace-plan upgrade in Phase 1; no dedicated worker until a measured need justifies roughly another Starter instance | User cost constraint |
| Existing analytics hardening | Explicitly excluded; it is a separate task. New Square Off endpoints still apply the same bounded-abuse principles | User |
| Phase 2 compatibility | Keep the root Laravel app in place, version contracts, and isolate the frontend data adapter so Phase 2 can add services without deleting Phase 1 features | User |

## Architecture

### Request and validation flow

```mermaid
sequenceDiagram
    participant Browser as React Square Off
    participant API as Laravel API
    participant DB as Postgres
    participant Job as ValidateSquareOffRun

    Note over Browser: Reducer accepts the first move immediately
    Browser->>API: POST /api/v1/square-off/sessions asynchronously
    API-->>Browser: Signed, expiring start token
    Note over Browser: Game remains local and responsive
    Browser->>Browser: Generate idempotency key + independent<br/>256-bit status/replay capabilities with Web Crypto
    Browser->>API: POST /api/v1/square-off/runs<br/>start token + key + both capabilities + 100 coordinates
    API->>API: Bound schema, signature, expiry,<br/>quota, nonce, and payload checks
    API->>DB: HMAC capabilities; insert pending run + admission receipt
    API->>Job: Dispatch after transaction commits
    Job->>DB: Lock pending run
    Job->>Job: Replay rules and derive outcome/metrics
    Job->>DB: Transition once to valid or invalid
    API-->>Browser: 202 with run ID and current status only
    Browser->>API: Poll status with bearer capability
    API-->>Browser: pending, verified, or rejected
    Browser->>Browser: If verified, build replay URL fragment<br/>from retained replay capability
```

The reducer accepts the first legal move immediately. That accepted move triggers the signed-session request asynchronously (or the request may start immediately beforehand) without awaiting it or delaying local play. A reset or mode/difficulty change invalidates the in-browser session state, and the next first accepted move starts a fresh request. If issuance fails or has not completed by game completion, verification is unavailable but the local game still completes.

The Laravel-issued start token is stateless and therefore does not create a database row an attacker can fill merely by starting a game. It binds issuance/expiry, nonce, ruleset version, transcript schema version, mode, difficulty when applicable, and AI version. Its default lifetime should be two hours and configurable. Issuance-to-submission-receipt is the **server-observed verification-session duration** used by the initial ten-second heuristic. It begins around the first accepted move, but network scheduling and the non-blocking request mean it is not represented as exact active play time.

Immediately before the completed-run submission, the browser uses Web Crypto—not `Math.random`—to generate two independent 256-bit base64url capabilities: one for status and one for replay. It retains both with the idempotency key and sends the exact same values on every identical retry. Laravel validates their encoding/length, stores only keyed HMAC hashes, and never returns either plaintext capability. Admission returns only the server-generated run ID and current status. Once status becomes verified, the browser builds `/games/statistics/replays/{runId}#token=...` from its retained replay capability.

The submission contains only ordered zero-based `{row, column}` coordinates. Laravel derives color, actor, board states, captures, scores, result, and metrics. It never stores React reducer snapshots or trusts client-provided scores. The current one-based `previousMoves.locations` data must be normalized explicitly; all resolved computer moves remain in the transcript after undo truncation.

### Trust boundary

The endpoint paths, request shape, a legitimate browser's start token, and the browser's own capabilities are observable to that browser. Neither CORS, CSRF, a JavaScript secret, a hidden endpoint, a signed token, nor Web Crypto proves that a human played. A script can wait ten seconds and submit a syntactically valid game.

Phase 1 therefore makes these narrower, defensible claims:

- Every included result is a complete transcript that the versioned Laravel rules engine replayed successfully.
- Duplicate/replayed admissions are idempotent and bounded.
- One client cannot create unbounded database growth under the configured network and global quotas.
- If the recommended administrative safeguard is approved, suspicious but technically valid runs can be quarantined only by the operator, with evidence and an audit event.
- The statistics are a portfolio demonstration, not an identity-backed competitive leaderboard or cheat-proof ranking.

### Laravel module boundaries

Controllers translate HTTP requests and responses only. Form Requests own input shape. API Resources/problem responses own the wire format. Concrete services under `app/Services/SquareOff` own start-token issuance, capability hashing/verification, admission, rules, validation, metrics, statistics, and retention. Laravel resolves concrete services without interfaces until Phase 2 creates a genuine substitution boundary.

Suggested actions:

| Endpoint | Controller action | Responsibility |
|---|---|---|
| `POST /api/v1/square-off/sessions` | `SquareOffSessionController::store` | Issue a stateless signed start token after bounded admission checks |
| `POST /api/v1/square-off/runs` | `SquareOffRunController::store` | Validate envelope and browser-generated capabilities, enforce idempotency/nonce, HMAC both capabilities, create pending run, dispatch validation |
| `GET /api/v1/square-off/runs/{run}/status` | `SquareOffRunStatusController::show` | Return a minimal status to the bearer of the status capability |
| `GET /api/v1/square-off/replays/{run}` | `SquareOffReplayController::show` | Return a valid, included transcript to the bearer of the replay capability |
| `GET /api/v1/square-off/statistics` | `SquareOffStatisticsController::index` | Return cached public aggregate statistics |
| `GET /up/square-off` | `SquareOffReadinessController::show` | Return only ready/unavailable for database and required tables; disclose no internals |

Do not add any public `DELETE`, moderation, or management route.

### Versioned rules and metrics

Create `contracts/fixtures/square-off/ruleset-v1.json` as the shared parity corpus consumed by both Vitest and PHPUnit. It must cover ordinary moves, each edge/corner rule, multi-square captures, a full tie, undo-normalized transcripts, illegal duplicate/out-of-range moves, and the overlapping-trap case where the active player's capture resolves before the opponent's trap.

Version and document these derived metrics:

- `captured_squares`: total number of squares converted from one color to the other across all move resolutions.
- `lead_changes`: changes from one outright leader to the other, carrying the last non-tied leader through ties so red → tie → blue counts once.
- `score_margin`: absolute final difference between red and blue scores.
- `verification_session_duration_ms`: server receipt time minus signed start-token issuance time; an approximate server-observed verification window, not exact active play time.
- `result`: `red`, `blue`, or `tie`.
- `runs_last_30_days`: rolling 30-day count in UTC, based on validation time.

Ruleset v1 must reproduce current behavior rather than silently “correcting” game rules. Any future rule change gets a new ruleset version and separate fixtures so historical replays remain interpretable.

## Data model and retention

Use portable Laravel migrations that pass SQLite, MySQL 8, and PostgreSQL. Avoid database-specific enum types; use PHP backed enums/constants plus validated strings and indexes.

### `square_off_runs`

- Server-generated ULID primary key.
- `validation_status`: `pending`, `valid`, or `invalid`.
- `moderation_status`: `included` or `quarantined`; independent from validation status.
- `mode`: PVP or PVE; difficulty is null for PVP and required for PVE.
- Ruleset, transcript-schema, and AI versions.
- Signed-session issuance, submit, and validate timestamps plus derived server-observed verification-session duration.
- Canonical normalized transcript JSON while pending and permanently when valid/quarantined.
- SHA-256 transcript digest for correlation/cache identity, never as proof of uniqueness by itself.
- Derived final scores, result, captured-square count, lead-change count, move count, and score margin.
- Bounded invalid reason code and expiry timestamp; no free-form client metadata.
- Independent HMAC-SHA-256 status and replay capability hashes, the HMAC key version used for each, and status-capability expiry; plaintext capabilities are generated and retained by the browser, processed transiently at admission, and never returned, logged, or persisted by Laravel.
- Indexes supporting status/moderation/time, mode/difficulty, result, ruleset, and rolling-window queries.

After a run reaches `valid`, its transcript, validation outcome, scores, versions, and derived metrics are immutable application invariants. Moderation changes only `moderation_status` in the same transaction that appends an audit event.

### `square_off_submission_receipts`

- Unique HMAC hashes of the idempotency key and start-token nonce.
- Request-body digest, linked run ID, and expiry timestamp.
- Same key and same digest returns the original run/status; same key or nonce with a different digest returns a conflict.
- Purged after the bounded retry window (default 24 hours) without affecting a valid run.

### `square_off_moderation_events`

- Append-only action (`quarantine` or `reinstate`), run ID, required operator identifier, required bounded reason code/detail, supporting incident reference, timestamp, and correlation ID.
- No update/delete path in application code.
- The current moderation state is updated transactionally with the new event.

### `square_off_rejection_aggregates`

- Internal daily counts by stable rejection reason, mode, and ruleset.
- Updated when a run becomes invalid before its raw transcript is cleared.
- Retained for operational trend analysis but omitted from public statistics.

### Retention execution without another service

Add a bounded, idempotent pruning service and Artisan command. Invoke the same service opportunistically under a once-per-day shared cache lock after accepted submissions, so retention still runs without paying for a Render cron or queue worker. The command provides a manual recovery/runbook path. Process fixed-size batches and time-bound execution; never include valid or quarantined runs in a prune query.

Default retention:

| Data | Retention |
|---|---|
| Valid canonical run/replay | Permanent |
| Quarantined canonical run/replay and moderation audit, if the recommended safeguard is approved | Permanent |
| Invalid raw transcript | Clear immediately after rejection aggregation |
| Invalid reason/status metadata | 7 days |
| Pending run with no successful validation | 24 hours, then prune as abandoned |
| Idempotency/nonce receipts and status capability/hash access window | Approximately 24 hours |
| Replay capability hash for a valid included run | No automatic expiry |
| Aggregate rejection counters | Permanent, internal only |

## Abuse controls and privacy

All limits are configurable, use shared cache storage, and fail closed for writes while leaving local play available. Initial conservative defaults:

| Operation | Per-network limit | Global write/read budget |
|---|---:|---:|
| Issue session | 30/minute and 100/day | 1,000/hour |
| Submit completed run | 5/minute and 25/day | 250 accepted submissions/day |
| Poll private status | 60/minute per capability | Bounded response cache |
| Read unlisted replay | 30/minute per capability/network | Bounded response cache |
| Read public statistics/readiness | 60/minute per network | Short shared cache/ETag |

Implementation requirements:

- Validate the entire request recursively: exact 100 moves for a completed v1 board, integer zero-based coordinates, no duplicates, exact allowed keys, bound string lengths, and a small request-body ceiling at nginx and Laravel.
- Return `429` with `Retry-After` and an `application/problem+json` body. Do not allocate a run before admission succeeds.
- Hash normalized client-network keys before passing them to Laravel's rate limiter; do not persist or log IP addresses or user agents.
- Verify Render proxy handling before trusting forwarded client IP headers. Document the exact trusted-proxy configuration and include a test that spoofed headers do not collapse or bypass limits.
- Before completed-run submission, use `crypto.getRandomValues` to create independent 32-byte status and replay capabilities, encode them as base64url, retain them with the idempotency key, and resend the identical pair on every identical retry. Never use `Math.random`, derive one capability from the other, or ask Laravel to return plaintext capabilities.
- Validate capability encoding/length, store only keyed HMAC-SHA-256 hashes and their key version, compare hashes in constant time, and accept the retained plaintext values only in an `Authorization: Bearer` header after admission. Include both capabilities in the idempotent request digest so changing either on retry produces conflict.
- Use a versioned server-side HMAC key ring: new runs use the active key, while verification-only prior keys remain available for their stored key versions so valid replay capabilities do not expire merely because the active key rotates. Removing an old replay-verification key is an explicit, separately approved invalidation event.
- Expire status access and clear its stored hash with the approximately 24-hour status window. Do not automatically expire the replay hash for a valid included run.
- After verification, build the share link in the browser as `/games/statistics/replays/{runId}#token=...`; the fragment is not sent in the initial HTTP request. The React page extracts it and uses it as the replay API bearer token. Redact submission capability fields, authorization values, fragments, transcripts, nonces, and token hashes from logs.
- Apply strict same-origin CORS as browser hygiene, while documenting that it is not anti-automation.
- Store no player name, email, account, IP, user-agent, device identifier, free-form comment, or browser fingerprint with a run.
- Treat a database/cache failure as “verification unavailable,” not permission to bypass validation or quotas.

## Public statistics and replay UI

### Routes and component boundaries

- Add `/games/statistics` as a lazy page at `resources/js/pages/games/statistics/GameStatistics.tsx`.
- Add `/games/statistics/replays/:runId` as a lazy page at `resources/js/pages/games/statistics/SquareOffReplay.tsx`.
- Export these as non-navigation route definitions from `resources/js/constants/routes.ts` and register them explicitly in `resources/js/App.tsx`; do not put them in the `ROUTES` collection consumed by the global navigation.
- Serve hard loads for both paths from the existing `games.index` Blade SPA shell. Do not add presentation or business logic to Blade.
- Keep movable UI, hooks, types, and the Phase 1 REST adapter under `resources/js/components/go/statistics/` and `resources/js/components/go/runs/`. Presentation components depend on an adapter contract, not Axios calls directly, so Phase 2 can swap query transport.
- Link statistics from the Engineering Lab selector and from Square Off's completed state. Do not change the selection behavior of `/games`.

### Statistics behavior

The page displays:

- total verified included runs;
- PVP/PVE counts and percentages;
- PVE easy/normal/hard distribution;
- red/blue/tie result distribution;
- average and median server-observed verification-session duration, labeled so it is not mistaken for exact active play time;
- average score margin, captured squares, and lead changes;
- verified runs during the last rolling 30 days; and
- the ruleset versions represented and `updated_at` timestamp.

Do not show fastest-game rankings, public invalid/pending counters, player-specific win rates, or a recent-run feed. Use labeled text and semantic tables/lists; any decorative chart must expose the same values without relying on color.

The page also contains a concise “How verification works” case-study section: local play → bounded submission → pending → server rule replay → inclusion. It must explain the ten-second heuristic honestly, say “rules-verified” rather than “cheat-proof,” and state why this Laravel slice exists as a cost-conscious backend engineering demonstration.

### Submission and replay behavior

- The first accepted move triggers session issuance asynchronously without awaiting the request; issuance and save failure never block the board, mode controls, undo, reset, or final result.
- A completed game shows one of: saving, pending verification, verified with unlisted replay link, rejected/not included, or verification unavailable. Dynamic status uses an accessible live region.
- Only the completing browser sees pending/rejected state through its independently generated status capability, which expires with the approximately 24-hour status window. Public statistics never optimistically count it.
- A replay page reconstructs the board from the canonical transcript with previous/next/start/end controls, a labeled move counter, final result/metrics, and a complete text move list.
- A missing, malformed, or wrong replay capability—and a missing, malformed, expired, or wrong status capability—returns a generic unavailable state without revealing whether a run ID exists. A quarantined replay is unavailable through the public capability but remains stored for the operator.
- Laravel never sends a plaintext replay capability: once verified, the browser combines its retained replay capability with the returned run ID to construct the fragment link. Losing that capability means losing the unlisted link; there is no identity-backed recovery, automatic replay-capability expiry, or delete capability. The run remains in aggregate statistics if included.

## Implementation sequence

### Stage 0 — Baseline and contract checkpoint

1. Record current green PHP/TypeScript/style/test/build gates and capture browser evidence for `/games` and a completed Square Off game.
2. Define `contracts/openapi/square-off-v1.yaml`, shared rules fixtures, stable error codes, metric definitions, and state diagrams before controllers or schema.
3. Add an OpenAPI-derived TypeScript client/type generation script and a clean-tree CI freshness check. Keep a thin hand-written adapter around generated transport types.
4. **Pause for user review** of the API shapes, metric definitions, retention, rules fixtures, and UI wire-level copy before creating migrations.

### Stage 1 — Additive schema and configuration

1. Add portable, additive migrations for runs, receipts, moderation events, and rejection aggregates.
2. Add backed enums/value objects and Eloquent models with guarded immutable fields and explicit casts.
3. Add `config/square-off.php` and sanitized `.env.example` entries for feature flags, start-token TTL, versioned capability HMAC key ring/current key ID, minimum verification-session duration, quota limits, cache TTLs, retention, ruleset versions, and validation queue connection.
4. Leave `SQUARE_OFF_RUNS_ENABLED` and `SQUARE_OFF_STATISTICS_ENABLED` off by default in production until migrations and smoke checks pass.

### Stage 2 — Canonical PHP rules engine

1. Implement a pure PHP rules engine that consumes normalized coordinates and returns canonical board transitions, derived actors/colors, scores, result, and versioned metrics.
2. Make both PHP and TypeScript consume the same JSON parity corpus.
3. Preserve the existing active-player-first overlapping capture order and all existing edge/corner behavior.
4. Do not port or validate AI strategy; validate only the resolved moves against game rules and the signed PVE metadata.

### Stage 3 — Admission, idempotency, and validation job

1. Implement named controller actions, Form Requests, API Resources, problem responses, rate limiters, start-token and capability-hashing services, and transactional admission. Laravel accepts browser-generated capabilities only on completed-run admission and never returns their plaintext.
2. Persist pending and admission receipt atomically; dispatch `ValidateSquareOffRun` only after commit on the configured `sync` connection.
3. Make the job unique/idempotent by run ID, lock the run row, and permit only `pending → valid` or `pending → invalid`. Re-entry on a terminal run is a no-op.
4. Clear invalid transcripts after stable reason aggregation. Unexpected infrastructure failures leave pending, emit a structured error, and can be retried safely through an operator command.
5. Add bounded maintenance and retry commands; do not add a worker or scheduler service in this phase.

### Stage 4 — Read APIs, immutable moderation, and caching

1. Implement status, replay, statistics, and Square Off readiness reads.
2. Cache aggregate statistics using a versioned key; invalidate/bump only after a run is validated, quarantined, or reinstated. Return `ETag` and honor `If-None-Match`.
3. **Recommended safeguard pending plan approval:** add `square-off:runs:quarantine` and `square-off:runs:reinstate` Artisan commands requiring run ID, operator identifier, an allowlisted reason, and a supporting incident reference. Restrict quarantine reasons to confirmed abuse, system duplication, a known validation defect, or data corruption—never the result itself. Make each transaction append an audit event and update moderation state; never alter canonical run data.
4. Do not implement physical deletion of valid runs or any web moderation route.

### Stage 5 — React integration

1. Add normalized transcript extraction and a session lifecycle that starts asynchronously on the first accepted move without changing or blocking reducer behavior.
2. Before completed-run submission, generate independent 256-bit status/replay capabilities with Web Crypto; retain them with the idempotency key, reuse the exact bundle on retries, and add capability-protected status polling with bounded retry/backoff and cleanup on unmount/reset/expiry.
3. Add accessible completion status, statistics, and replay components behind adapter interfaces.
4. Add the two non-navigation React/server routes and links from the Lab selector and completed Square Off game.
5. Ensure empty, loading, unavailable, rate-limited, and stale/pending states are useful and do not blank the page.

### Stage 6 — Observability, CI, documentation, and production rollout

1. Add request/correlation IDs, structured JSON stderr logging in production, stable event names/reason codes, release SHA, route, outcome, and duration. Never log capabilities, transcripts, IPs, user agents, or GraphQL-style variable bodies.
2. Add focused Postgres and MySQL migration/feature compatibility coverage alongside the existing SQLite test suite without tripling unrelated frontend work.
3. Extend the existing production Docker build and manual deploy workflow only as needed for additive migrations and post-live Square Off readiness/statistics smoke checks. Keep one production approval, exact-commit CI verification, Render auto-deploy off, and `/up` unchanged.
4. Complete the documentation deliverables below.
5. **Pause before production migration and before enabling writes.** Verify a database snapshot/export path, current capacity, Render pre-deploy configuration, flags, logs, and rollback commands with the user.

## Scope

Files/areas expected to change. Anything beyond these areas is reportable scope drift:

- `routes/api.php`, `routes/web.php`, `routes/console.php` — versioned API, SPA hard-load routes, and operator commands/scheduling hooks if required.
- `bootstrap/app.php`, `app/Providers/AppServiceProvider.php` — narrowly scoped correlation/trusted-proxy/rate-limiter bootstrapping.
- `app/Http/Controllers/Api/V1/SquareOff/`, `app/Http/Requests/Api/V1/SquareOff/`, `app/Http/Resources/Api/V1/SquareOff/`, `app/Http/Middleware/` — HTTP boundary only.
- `app/Services/SquareOff/`, `app/Jobs/ValidateSquareOffRun.php`, `app/Console/Commands/SquareOff/`, `app/Enums/SquareOff/` — domain/application behavior, validation, maintenance, and operator moderation.
- `app/Models/SquareOffRun.php` and related receipt/moderation/aggregate models — persistence only.
- `database/migrations/`, `database/factories/` — additive portable schema and test data.
- `config/square-off.php`, `config/logging.php`, `.env.example` — flags, limits, retention, queue selection, JSON stderr, and sanitized configuration.
- `contracts/openapi/`, `contracts/fixtures/square-off/`, `contracts/README.md` — API schema, cross-runtime rule fixtures, versioning rules.
- `resources/js/components/go/` — transcript extraction/submission integration and co-located `runs/` and `statistics/` feature modules; no unrelated game-flow refactor.
- `resources/js/pages/Games.tsx`, `resources/js/pages/games/statistics/`, `resources/js/App.tsx`, `resources/js/constants/routes.ts` — links, pages, and non-navigation routes.
- `resources/sass/modules/` — only styles needed by the new Square Off status/statistics/replay UI.
- `tests/Feature/Api/V1/SquareOff/`, `tests/Unit/Services/SquareOff/`, relevant `resources/js/**/*.test.ts(x)` — planned coverage.
- `composer.json`, `composer.lock`, `package.json`, `yarn.lock`, `webpack.config.js`, `tsconfig.json` — only if a maintained contract validator/generator or a matching alias is required.
- `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, `docker/nginx/conf.d/app.conf` — database compatibility/contract checks, post-live smoke checks, and request-size ceiling.
- `README.md`, `AGENTS.md`, `docs/architecture/`, `docs/runbooks/` — contributor/agent overview, architecture rationale, commands, and operations.
- Render service settings — pre-deploy migration command and Phase 1 environment values, handled as an explicit operator step.

Explicitly preserve the current Blade convention: both new browser routes reuse the existing empty `games.index` SPA hook. Do not add page content or logic to Blade.

## Acceptance criteria

### AC1 — Bound, stateless game sessions

- **Given** Square Off run capture is enabled, **when** the reducer accepts the first legal move, **then** React starts the allowed mode/difficulty session request asynchronously without awaiting it or delaying that local move, and Laravel returns a signed, expiring token bound to nonce, ruleset, schema, mode, difficulty, AI version, and issuance time without creating a run row.
- **Given** a token is expired, tampered with, or submitted with different bound metadata, **when** it is used, **then** the request is rejected with a stable problem response and no run is created.
- Tests: `GoRunSubmission.test.tsx: requests_a_session_after_the_first_accepted_move_without_blocking_the_reducer` (integration), `SquareOffSessionTest::it_issues_a_bound_session_without_persisting_a_run` (integration), `SquareOffStartTokenServiceTest::it_rejects_tampered_expired_or_mismatched_tokens` (unit)

### AC2 — Backend failure never blocks local play

- **Given** session issuance, submission, or status requests fail or time out, **when** a visitor plays, undoes, resets, changes mode, and completes Square Off, **then** all local game behavior still works and the UI presents a non-blocking “verification unavailable/not recorded” state without an unhandled rejection or blank page.
- Tests: `GoRunSubmission.test.tsx: preserves local gameplay when run services fail` (integration)

### AC3 — Idempotent completed-run admission

- **Given** a valid session and exactly 100 normalized legal-looking coordinates, **when** the browser creates a new idempotency key plus independent 256-bit status/replay capabilities with Web Crypto and submits them, **then** Laravel stores only their HMAC hashes, commits one pending run/receipt, dispatches one validation job after commit, and returns only run ID/current status.
- **Given** the same key/nonce/body is retried concurrently or sequentially, **when** the browser resends the identical capability pair, **then** the original run representation is returned and no duplicate run/job is created; changing the body or either capability returns conflict.
- Tests: `GoRunSubmission.test.tsx: generates_independent_web_crypto_capabilities_and_reuses_the_submission_bundle_on_retry` (integration), `SquareOffRunSubmissionTest::it_persists_only_capability_hmacs_and_dispatches_one_completed_run_after_commit` (integration), `SquareOffRunSubmissionTest::it_is_idempotent_and_rejects_key_nonce_body_or_capability_changes` (integration)

### AC4 — Cross-runtime rule parity

- **Given** each shared ruleset-v1 fixture, **when** React and Laravel independently replay its moves, **then** they produce the same board transitions, capture order, final scores, result, captured-square count, and lead-change count.
- **Given** duplicate, out-of-range, out-of-turn, incomplete, or outcome-tampered input, **when** Laravel validates it, **then** the run cannot become valid.
- Tests: `helpers.test.ts: matches every ruleset-v1 parity fixture` (unit), `SquareOffRulesEngineTest::it_matches_every_ruleset_v1_parity_fixture` (unit), `SquareOffRulesEngineTest::it_rejects_illegal_or_incomplete_transcripts` (unit)

### AC5 — Honest verification-session duration and PVP/PVE classification

- **Given** server receipt occurs below the configured ten-second minimum after signed-session issuance, **when** validation runs, **then** the run becomes invalid with `duration_below_threshold` and never enters public statistics; API/UI/docs label the measurement as server-observed verification-session duration, not exact active play time.
- **Given** a PVP or PVE run above the threshold, **when** validation runs, **then** mode/difficulty/AI metadata matches the signed session; PVE resolved moves are checked for legal state transitions without claiming the random AI strategy was reproduced.
- Tests: `SquareOffRunValidatorTest::it_enforces_the_configured_verification_session_minimum` (unit), `SquareOffRunValidatorTest::it_binds_mode_difficulty_and_ai_version_without_replaying_ai_strategy` (unit), `GameStatistics.test.tsx: labels_verification_session_duration_as_server_observed` (integration)

### AC6 — One-way, idempotent validation state transitions

- **Given** a pending run, **when** validation succeeds, fails rules, runs twice, or overlaps with another worker attempt, **then** a row lock/conditional transition produces exactly one terminal `valid` or `invalid` outcome and subsequent execution is a no-op.
- **Given** an unexpected infrastructure exception, **when** the job fails, **then** the run remains pending, the failure is logged without sensitive data, and an operator retry can safely target it.
- Tests: `ValidateSquareOffRunTest::it_transitions_a_locked_pending_run_exactly_once` (integration), `ValidateSquareOffRunTest::it_leaves_infrastructure_failures_retryable_without_partial_metrics` (integration)

### AC7 — Statistically honest public aggregates

- **Given** valid included, pending, invalid, and quarantined runs across modes/results/difficulties/times, **when** statistics are requested, **then** only valid included runs contribute and every agreed metric uses the documented definition and UTC window.
- **Given** a valid run is old, **when** the rolling window moves, **then** it remains in permanent all-time totals but leaves only the 30-day count.
- Tests: `SquareOffStatisticsTest::it_aggregates_only_valid_included_runs_with_documented_metrics` (integration), `SquareOffStatisticsTest::it_preserves_all_time_runs_outside_the_rolling_window` (integration)

### AC8 — Separate, resilient statistics page

- **Given** a direct hard load or client navigation to `/games/statistics`, **when** the API returns populated, empty, cached, rate-limited, or unavailable data, **then** the lazy React page renders the corresponding useful state and leaves global navigation unchanged.
- **Given** a visitor is on the Engineering Lab selector or has completed Square Off, **when** they follow the statistics link, **then** they arrive at the separate page without changing `/games` selection behavior.
- Tests: `GameStatistics.test.tsx: renders populated empty unavailable and rate-limited states` (integration), `Games.test.tsx: links to statistics without changing experiment selection` (integration), `SquareOffWebRoutesTest::it_serves_the_games_spa_shell_for_statistics_and_replay_hard_loads` (integration)

### AC9 — Capability-protected unlisted replays

- **Given** a run becomes valid and included, **when** its completing browser obtains status with its independent short-lived status capability, **then** Laravel returns run ID/status without any plaintext capability and the browser constructs the unlisted fragment link from its retained, non-expiring replay capability.
- **Given** a missing/wrong capability, unknown run, invalid run, or quarantined run, **when** replay data is requested, **then** the same generic unavailable response is returned and no existence or status detail leaks.
- **Given** a valid capability, **when** the replay page loads, **then** it reconstructs all moves and exposes accessible controls, final metrics, and a complete text move list without listing the replay publicly.
- Tests: `SquareOffReplayTest::it_expires_status_access_but_preserves_the_valid_included_replay_capability_hash` (integration), `SquareOffReplayTest::it_keeps_valid_replays_accessible_through_a_versioned_hmac_key_rotation` (integration), `SquareOffReplayTest::it_serves_only_valid_included_replays_to_the_correct_bearer` (integration), `SquareOffReplay.test.tsx: builds_the_fragment_from_the_retained_capability_and_replays_a_canonical_transcript` (integration)

### AC10 — No player deletion; recommended auditable operator quarantine

- **Given** any public run ID, status token, or replay token, **when** a visitor attempts a delete or moderation request, **then** no route/capability exists and canonical/statistical data is unchanged.
- **Given** the user approves the recommended administrative safeguard with this plan and an operator supplies an included valid run, actor, allowlisted integrity reason, and supporting incident reference to the quarantine command, **when** it succeeds, **then** the run is excluded from subsequent aggregate results, its canonical transcript/outcome remains unchanged, and one append-only audit event is recorded; an outcome-based/free-form-only rationale is refused.
- **Given** the operator later reinstates that run, **when** the inverse command succeeds, **then** it returns to aggregates and another audit event is appended; redundant/invalid transitions fail safely.
- Tests: `SquareOffRunDeletionTest::it_exposes_no_player_delete_or_moderation_route` (integration), `SquareOffRunModerationCommandTest::it_quarantines_and_reinstates_without_mutating_verified_data` (integration)

### AC11 — Bounded retention without valid-data deletion

- **Given** expired receipts, stale pending runs, invalid metadata, valid runs, and quarantined runs, **when** bounded maintenance executes repeatedly, **then** only data past its documented temporary retention is pruned, invalid raw transcripts are absent, rejection aggregates remain, and valid/quarantined/audit records remain byte-for-byte intact.
- Tests: `SquareOffMaintenanceCommandTest::it_prunes_only_expired_temporary_data_in_bounded_idempotent_batches` (integration)

### AC12 — Bounded anonymous abuse and payloads

- **Given** per-network or global quotas are exhausted, an oversized/malformed body arrives, or shared cache/database admission is unavailable, **when** an anonymous write is attempted, **then** it fails before persistence with `429`, `413`/`422`, or `503`, appropriate retry guidance, and no fail-open path.
- **Given** trusted and spoofed proxy headers, **when** limiter keys are derived, **then** configured Render proxy handling identifies clients as designed, hashes the key, and neither persists nor logs raw IP/user-agent data.
- Tests: `SquareOffAbuseControlTest::it_enforces_per_network_and_global_limits_before_writes` (integration), `SquareOffAbuseControlTest::it_rejects_oversized_or_unknown_payload_fields` (integration), `SquareOffProxyTrustTest::it_does_not_allow_forwarded_header_spoofing_to_bypass_limits` (integration)

### AC13 — Stable v1 contract, problem responses, and caching

- **Given** every documented success and failure example, **when** Laravel responses are validated against OpenAPI 3.1, **then** status, headers, body, enums, and `application/problem+json` errors conform and the generated TypeScript types are current.
- **Given** a matching statistics `ETag`, **when** a client sends `If-None-Match`, **then** Laravel returns `304` without recalculating or retransmitting the body; validation/moderation changes invalidate the versioned cache.
- Tests: `SquareOffOpenApiContractTest::it_matches_documented_v1_success_and_problem_responses` (integration), `SquareOffStatisticsTest::it_honors_etags_and_invalidates_after_inclusion_changes` (integration), CI `generate-square-off-client --check` (integration)

### AC14 — Diagnosable degradation without secret leakage

- **Given** any session, admission, validation, statistics, replay, quarantine, or readiness outcome, **when** it is logged, **then** structured JSON includes service/environment/release SHA, generated request/correlation ID, route/outcome/duration, run ID when safe, and a stable reason code—but no capability, nonce, transcript, authorization value, IP, user agent, or free-form payload.
- **Given** Postgres or the Square Off schema is unavailable, **when** `/up`, the portfolio, and Square Off readiness are requested, **then** `/up` and the portfolio remain live while `/up/square-off` and feature APIs report generic unavailability.
- Tests: `SquareOffObservabilityTest::it_logs_correlated_structured_events_with_sensitive_fields_redacted` (integration), `SquareOffReadinessTest::it_separates_portfolio_liveness_from_square_off_readiness` (integration)

### AC15 — Accessible, responsive new UI

- **Given** keyboard, screen-reader, reduced-motion, high-contrast, mobile-width, and desktop-width use, **when** a visitor uses submission status, statistics, or replay UI, **then** headings/controls have accessible names, status changes are announced, focus remains predictable, all values have text equivalents, and no meaning relies only on color or animation.
- Tests: `GameStatistics.test.tsx: exposes semantic_labeled_statistics_and_announces_async_state` (integration), `SquareOffReplay.test.tsx: supports_keyboard_controls_and_reduced_motion` (integration), required real-browser verification matrix (manual evidence because no e2e harness exists)

### AC16 — Portable additive deployment and safe rollback

- **Given** an empty database and a database containing the current application schema, **when** Phase 1 migrations and tests run on SQLite, MySQL 8, and PostgreSQL, **then** they complete without destructive changes and the disabled-feature application remains compatible.
- **Given** a production deploy or rollback, **when** the pre-deploy migration, exact-commit CI gate, one approval, Render monitoring, Square Off smoke check, and feature flags are used, **then** no new service is required, `/up` stays healthy, writes can be disabled independently, and prior application code can run while additive tables remain.
- Tests: CI `square-off-database-compatibility` (integration), CI production Docker build plus scripted `/up` and `/up/square-off` smoke assertions (integration)

## Planned test list

| Test | Layer | Covers |
|---|---|---|
| `SquareOffSessionTest` | Integration | AC1, AC12 |
| `SquareOffStartTokenServiceTest` | Unit | AC1 |
| `GoRunSubmission.test.tsx` | Integration | AC1, AC2, AC3 |
| `SquareOffRunSubmissionTest` | Integration | AC3, AC12 |
| TypeScript `ruleset-v1` fixture test | Unit | AC4 |
| `SquareOffRulesEngineTest` | Unit | AC4 |
| `SquareOffRunValidatorTest` | Unit | AC5 |
| `ValidateSquareOffRunTest` | Integration | AC6 |
| `SquareOffStatisticsTest` | Integration | AC7, AC13 |
| `GameStatistics.test.tsx` | Integration | AC5, AC8, AC15 |
| `Games.test.tsx` and `SquareOffWebRoutesTest` | Integration | AC8 |
| `SquareOffReplayTest` and `SquareOffReplay.test.tsx` | Integration | AC9, AC15 |
| `SquareOffRunDeletionTest` and `SquareOffRunModerationCommandTest` | Integration | AC10 |
| `SquareOffMaintenanceCommandTest` | Integration | AC11 |
| `SquareOffAbuseControlTest` and `SquareOffProxyTrustTest` | Integration | AC12 |
| `SquareOffOpenApiContractTest` and generated-client freshness check | Integration | AC13 |
| `SquareOffObservabilityTest` and `SquareOffReadinessTest` | Integration | AC14 |
| SQLite/MySQL/Postgres compatibility and production-image smoke jobs | Integration | AC16 |

There is no Playwright, Cypress, WebdriverIO, or equivalent end-to-end harness in this repository. Do not scaffold one in this phase merely to satisfy a label. Component/feature tests remain automated authority, and the browser verification checklist below supplies real runtime evidence.

## Browser verification checklist

Use `./docker-reboot` and the repository's normal local port/host; do not invent a second port. Capture before evidence before implementation and after evidence once all automated gates pass.

1. Hard-load `/games`, enter Square Off, complete/reset/undo a game, and confirm existing flow remains intact.
2. Exercise successful save from both PVP and PVE, observe pending → verified, open the unlisted replay, and step through start/previous/next/end.
3. Hard-load `/games/statistics` and an unlisted replay URL on desktop and a narrow mobile viewport.
4. Simulate empty data, API timeout, database unavailable, rate limit, invalid run, and quarantined replay; confirm local gameplay and portfolio navigation remain usable.
5. Navigate every new interactive control by keyboard, inspect accessible names/live announcements, check reduced motion and forced colors, and verify no statistic depends on color.
6. Inspect network requests and logs: the browser generates independent capabilities before submission and resends the same pair on a forced identical retry; admission returns no plaintext capability; no capability appears in server URLs/logs; later status/replay reads use only authorization headers.
7. Confirm direct hard loads use the existing games Blade hook and `/up` remains healthy independently of `/up/square-off`.

## Observability and operations

Use stable event names such as:

- `square_off.session.issued|rejected`
- `square_off.run.admitted|duplicate|rejected`
- `square_off.validation.valid|invalid|failed|noop`
- `square_off.statistics.cache_hit|cache_miss|unavailable`
- `square_off.replay.served|denied`
- `square_off.moderation.quarantined|reinstated|rejected`
- `square_off.maintenance.completed|failed`

Each event includes a request/correlation ID, release SHA, ruleset version, safe run ULID where relevant, outcome/reason code, and elapsed milliseconds. Jobs inherit the admission correlation ID and add an attempt number. Do not log success payloads or secrets.

Operational commands/runbooks must cover:

- checking pending/invalid/valid/quarantined counts and oldest pending age;
- safely retrying a specific or bounded batch of pending runs;
- running dry-run and real retention maintenance;
- quarantining/reinstating with actor and reason;
- checking Postgres size/index growth and cache/queue tables;
- disabling only new run writes while preserving reads and local gameplay;
- rebuilding statistics cache; and
- rotating application/start-token secrets and the versioned capability HMAC key ring; start-token rotation expires unsubmitted sessions, while prior replay-verification keys remain until an explicit, separately approved invalidation.

Use the existing 1GB database deliberately. Establish a warning threshold around 70% and a stop-write threshold before 85%; at the latter, disable `SQUARE_OFF_RUNS_ENABLED`, investigate, and retain all valid data. Never silently delete valid runs to recover space.

## Render rollout and rollback

### Cost

- Incremental Phase 1 Render service cost: **$0 expected**.
- Reuse the current Starter portfolio service and Basic-256MB Postgres datastore.
- Configure the Square Off validation job to `sync`; a separate Render background worker would add approximately one Starter service (currently about $7/month) and requires a future approval checkpoint.
- Do not use container-local SQLite for durable data because Render filesystem changes are ephemeral.

### Rollout

1. Deploy additive code with both Phase 1 feature flags off.
2. Configure Render's pre-deploy command to run `php artisan migrate --force` from the built release. Preserve `/up` as the Render health check.
3. Verify migrations, `/up`, `/up/square-off`, structured logs, database capacity, and a dry-run maintenance command.
4. Enable session/submission for a bounded canary period, validate PVP/PVE/rejection/idempotency behavior, then enable the statistics page/link.
5. Run the existing manual, exact-commit deploy workflow after successful `main` CI and one production approval. Add only post-live smoke checks; do not repeat the full CI suite or re-enable Render auto-deploy.
6. Monitor accepted/rejected/quarantined rates, validation duration/failures, oldest pending age, quota denials, cache hit rate, and database growth for at least the first several days.

### Rollback

- First disable new writes via environment flag; local Square Off and the rest of the portfolio stay functional.
- Roll back to the previous successful Render image if application behavior regresses. Additive tables remain; do not run destructive down migrations during an application rollback.
- Keep statistics/replay reads enabled only if their code version understands the current schema; otherwise disable their flag too.
- Quarantine, rather than delete, any run shown to be corrupt or abusive.
- Restore/reconcile from the verified pre-enable database snapshot/export only for actual datastore corruption, never to selectively alter results.

## Documentation deliverables

Documentation is part of the implementation, not an afterthought:

- Update `README.md` with a concise system overview, local commands, flags, validation flow, statistics/replay links, and links to deeper architecture/runbook documents.
- Update `AGENTS.md` so its project overview, Render flow, route/API inventory, directory map, database usage, queue/job behavior, operator commands, common commands, tests, and gotchas accurately describe the new migrations, durable run data, APIs, jobs, statistics/replays, and recommended quarantine safeguard. Remove or qualify the old “no meaningful database usage” guidance once it is no longer true.
- Add `docs/architecture/README.md` as an ADR index.
- Add ADRs covering:
  1. why a deep verified-run slice was chosen for the backend showcase;
  2. why browser input is untrusted and abuse is bounded rather than “prevented”;
  3. canonical transcripts, dual-language parity fixtures, and versioned rules;
  4. browser-generated independent status/replay capabilities, capability lifetimes, unlisted replay, and the explicit rejection of player deletion;
  5. sync job execution now versus an independently deployed worker later; and
  6. durable Postgres and cost-aware Render rollout.
- Add `contracts/README.md` explaining OpenAPI 3.1, JSON fixtures, generated-client freshness, compatibility/version rules, and Phase 2 consumers.
- Add operator runbooks for rollout/rollback, capacity, pending retry, retention, the recommended quarantine/reinstate safeguard, and token/secret rotation.
- Put a concise public “How verification works” case-study section on `/games/statistics`, including why Laravel owns authoritative validation in Phase 1.
- Explain that Phase 2 adds Node/NestJS and Python/FastAPI to demonstrate responsible polyglot integration under a cost ceiling—not because Laravel is incapable of the work. Each service must later have a real, narrow responsibility and graceful fallback.
- Add code comments only around non-obvious invariants such as active-player-first capture order, idempotent state transitions, capability hashing, and metric definitions. Avoid narrative comment noise.
- Follow `AGENTS.md`: every PHP class, method, declared property, and class constant receives current Laravel 13/PHP 8.5-appropriate PHPDoc, while native types remain the source of truth and redundant tags are omitted.

## Domain requirements

| Domain | Requirement | Enforced via |
|---|---|---|
| Security | Treat all browser input as untrusted; bound session/submission/status/replay/statistics traffic and fail closed for writes | AC1, AC3, AC12 |
| Security | No plaintext stored capabilities, frontend secrets, PII, IP/user-agent persistence, or secret-bearing server URLs/logs | AC9, AC12, AC14 |
| Security | No player deletion; the recommended operator moderation safeguard is pending plan approval and, if approved, remains non-destructive and audited | AC10 |
| Accessibility | New statistics/status/replay UI has names, keyboard support, live state, text equivalents, contrast/reduced-motion support | AC15 |
| Observability | Structured correlated outcome/reason logs with release context and redaction | AC14; implementation rule |
| Observability | Portfolio liveness remains independent from optional Square Off readiness | AC14 |
| Data safety | Additive portable migrations, immutable valid records, explicit retention, bounded pruning, safe rollback | AC6, AC10, AC11, AC16 |
| API compatibility | Versioned `/api/v1` OpenAPI contract, stable problem details, generated client freshness, ETag semantics | AC13 |
| Performance | Exact bounded transcript, indexed aggregate dimensions, versioned cache, conditional GET, bounded polling/backoff | AC3, AC7, AC13; implementation rule |
| Architecture | Controllers stay thin; concrete services own business rules; Blade stays an SPA hook; root app is not relocated | Scope and implementation rule |
| Architecture | React presentation uses a replaceable data adapter and canonical contracts preserve Phase 2 freedom | AC8, AC9; implementation rule |
| Cost | Reuse the existing web service/Postgres and sync job execution; require approval before adding a worker/service | AC16; pause point |
| Documentation | Explain context, alternatives, decision, consequences, cost, and honest trust boundary at the repo, ADR, contract, runbook, and public case-study levels | Documentation implementation rule |

### Rejected sweep recommendations

| Domain | Recommendation | Rejected because |
|---|---|---|
| Security | Hide endpoints or ship a secret in React | Browser code/network calls are observable; obscurity does not prevent scripts |
| Security | Treat CORS, CSRF, signed start tokens, or ten-second duration as proof of a human | They are useful controls/signals but cannot establish human identity or intent |
| Security | Add accounts solely to own/delete runs | No identity-backed feature currently needs accounts; it adds privacy and security surface without fixing anonymous automation |
| Data integrity | Give players a deletion capability | Selective loss deletion directly corrupts aggregate statistics; explicitly rejected by the user |
| Security | Add CAPTCHA/device fingerprinting in the baseline | Third-party/privacy/UX cost is disproportionate while quotas and server validation meet the showcase goal; revisit only if measured abuse exceeds controls |
| Architecture | Validate every move synchronously through Laravel | Adds latency and makes play dependent on the backend; completed-run replay demonstrates the server boundary without changing gameplay |
| Architecture | Reproduce the random computer strategy in PHP | The server must validate rules and result, not claim a random client decision was the only possible move |
| Data safety | Persist with SQLite inside the Render container | The filesystem is ephemeral and durable Postgres is already paid for |
| Operations | Add a Render queue worker or cron service now | Adds cost before workload evidence; sync job plus bounded opportunistic/manual maintenance is enough for Phase 1 |
| Performance | Add Redis/Key Value in Phase 1 | Current Postgres/cache and small bounded dataset are sufficient; Phase 2 may add a recomputable derived-insight cache |
| Product | Publish recent runs, fastest rankings, invalid counts, or personal win rates | They increase manipulation/privacy risk and are not required to demonstrate the backend architecture |
| Scope | Harden the existing analytics endpoint in this plan | The user reserved it as a separate task; only the design principles apply to new endpoints |
| Accessibility | Fold the full existing Square Off board remediation into Phase 1 | Phase 3 owns the comprehensive board/replay/statistics WCAG 2.2 AA pass; Phase 1 still ships accessible new controls/content |
| Testing | Scaffold a new e2e framework | The repository has no harness; focused integration tests plus required real-browser proof are proportionate |
| Architecture | Add BFF, Python, Kafka, Kubernetes, service mesh, or an LLM in Phase 1 | They obscure the Laravel vertical slice and/or add cost without a Phase 1 responsibility |

## Risks and mitigations

- **Rules drift between TypeScript and PHP:** shared versioned fixtures run in both suites; historical runs retain ruleset version.
- **A bot can submit a valid game after waiting ten seconds of server-observed verification-session time:** state the limitation, enforce global/per-network budgets, monitor patterns, and—if the recommended safeguard is approved—quarantine only with operator evidence. Do not market the data as cheat-proof or call the timing exact active play time.
- **Random PVE moves cannot be authenticated as AI-generated:** bind mode/difficulty/AI version but describe them as client-reported context within a signed session; validate only legality.
- **Sync validation increases request latency:** the v1 transcript is exactly 100 moves and deterministic; measure validation p95. Crossing the documented latency/error threshold triggers a user-approved worker decision, not an automatic architectural expansion.
- **DB/cache outage:** writes fail closed, reads degrade clearly, `/up` and local play remain healthy.
- **Permanent valid data grows:** strict write budgets, compact canonical transcript, storage monitoring, warning/stop-write thresholds, and no silent deletion.
- **The recommended operator quarantine safeguard could itself skew data:** approval remains explicit; if approved, require actor, allowlisted integrity reason, supporting incident reference, append-only events, reversible commands, structured logs, and no HTTP access. Prohibit result-based removal and document/review every use.
- **Capability leakage by the holder:** replay is read-only, unlisted rather than confidential, token hashes are stored, URLs use fragments, and server logs redact authorization. Anyone intentionally given the replay capability can view it.
- **Token loss:** no identity means no recovery; this affects only access to the unlisted replay, not inclusion or deletion.
- **Portable database behavior differs:** run focused schema/query coverage against SQLite, MySQL, and Postgres before rollout.
- **Migration/rollback mismatch:** use expand-first additive schema and flags; never couple application rollback to dropping data.
- **Public statistics can become misleading due to definition ambiguity:** contract and public copy define each metric and represented ruleset.

## Out of scope

- User accounts, authentication, profiles, identity-backed “my stats,” or replay ownership.
- Any player-facing deletion, editing, moderation, or recovery workflow.
- Public replay discovery, recent-run feed, fastest-game leaderboard, or competitive rankings.
- Server-authoritative per-move gameplay, matchmaking, real-time multiplayer, or anti-cheat claims.
- Reimplementation of the random AI algorithm in PHP.
- Existing analytics endpoint hardening.
- Phase 2 Node/NestJS BFF, GraphQL, Python/FastAPI analysis, Redis-derived cache, or service extraction.
- Phase 3 comprehensive accessibility remediation of the existing interactive board.
- Moving Laravel or React from the repository root, splitting the SPA into a static deployment, or changing Blade's hook-only role.
- A paid Render worker, private service, cron service, additional database, workspace upgrade, Kafka, Kubernetes, service mesh, or LLM.
- Refactoring unrelated portfolio content, resume download behavior, navigation, or game rules.

## Flags and approval gates

- `ui_visible`: true
- `e2e_applicable`: false — no e2e harness exists; real-browser verification is mandatory.
- Pause points:
  1. explicit approval of this plan—including the recommended operator quarantine safeguard—before implementation;
  2. contract/schema/metric/rules-fixture review before migrations;
  3. review after implementation and browser proof before any commit;
  4. production database/pre-deploy/capacity review before migration;
  5. separate confirmation before enabling production writes/statistics;
  6. separate approval before adding any Render service, switching to a paid worker, or beginning Phase 2.

## Definition of done

Phase 1 is complete only when every acceptance criterion is green at its listed layer; PHP, Pint, TypeScript, Vitest, Stylelint, Webpack, security audit, contract freshness, database compatibility, and production Docker gates pass; browser evidence covers the success and degraded flows; `README.md`, `AGENTS.md`, architecture records, contracts, and runbooks accurately describe the new database/API/job/route/command reality; production flags and migration steps have been reviewed; and the user explicitly approves the implementation before commit/deploy.

## Primary references

- [Laravel 13 queues](https://laravel.com/docs/13.x/queues)
- [Laravel 13 rate limiting](https://laravel.com/docs/13.x/rate-limiting)
- [Laravel 13 HTTP tests](https://laravel.com/docs/13.x/http-tests)
- [Render deploys and pre-deploy commands](https://render.com/docs/deploys)
- [Render service types and pricing model](https://render.com/docs/service-types)
- [Render monorepo support](https://render.com/docs/monorepo-support)
