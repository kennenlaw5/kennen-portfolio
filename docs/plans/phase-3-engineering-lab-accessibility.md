# Plan: Phase 3 — Engineering Lab Accessibility

Status: Awaiting approval. This document is a plan only; it does not authorize implementation.

## Summary

Bring the Square Off Pro live game, its unlisted replay experience, and the public `/games/statistics` page to a documented WCAG 2.2 AA target. The work will make the 10×10 board efficient to operate and understand without a mouse or color perception, provide deliberate focus and announcement behavior, and ensure every replay or statistics visualization has a readable non-visual equivalent.

This is presentation and interaction work. It must preserve the reducer-driven game rules, saved-run contracts, validation behavior, statistics definitions, and service boundaries created in the earlier phases. It is scheduled after the separately planned analytics-endpoint hardening work; analytics hardening is not part of this plan.

## Preconditions and sequencing

1. Complete the separately scoped analytics-event endpoint hardening task first. That is a scheduling prerequisite, not a code dependency of this work.
2. Complete enough of Phase 1 for `/games/statistics` and unlisted replay pages to exist. Phase 2 is not a hard dependency: this work may target the Phase 1 Laravel adapter, and the same accessibility contract must remain intact if Phase 2 later swaps in the GraphQL BFF adapter.
3. Re-run the baseline accessibility audit immediately before implementation because the Phase 1/2 UI may differ from the paths anticipated below.
4. Obtain explicit approval for this plan before changing implementation files.

## Current baseline

The current Square Off board renders 100 native buttons inside visually arranged `div` rows. Every square is in the normal tab order, every button has an empty accessible name, and ownership is conveyed primarily through red or blue fill. Current-player status also includes a color-only swatch, and game changes have no consolidated live announcement. The rules disclosure already uses native `details`/`summary`, the mode controls use native labeled selects, and reduced-motion/forced-color handling exists for only a small subset of styles.

The repository has Vitest, jsdom, React Testing Library, and user-event component tests, but no Playwright, Cypress, or other end-to-end harness. Automated component coverage and real-browser/manual assistive-technology verification are therefore both required; neither substitutes for the other.

## Resolved decisions

| Decision | Answer | Source |
|----------|--------|--------|
| Conformance target | WCAG 2.2 AA for Square Off Pro, replay, and statistics surfaces | user |
| Interactive board model | A named composite grid with row/gridcell semantics and roving focus: exactly one cell button is tabbable, while arrow keys move through every coordinate | user + accessibility sweep |
| Edge behavior | Arrow navigation stops at the board edge rather than wrapping; occupied cells remain navigable so their state can be inspected | recommended-accepted |
| Cell activation | Enter and Space claim an available square; activation never bypasses existing reducer guards | user |
| Cell state | Every cell exposes one-based row/column, owner/empty state, and availability in its accessible name; ownership also receives a visible non-color cue such as an `R`/`B` marker | user + accessibility sweep |
| Dynamic feedback | One consolidated live-status component announces meaningful turn, move, capture, score, undo/reset, computer-turn, and completion changes without announcing all 100 cells | user + accessibility sweep |
| Focus behavior | Focus remains at a stable coordinate after moves/captures, remains on invoked controls after undo/reset, is intentionally placed on route headings after direct navigation, and is restored to the originating replay/statistics control when returning | user + accessibility sweep |
| Visual alternatives | Statistics charts include semantic tables; replays include a textual ordered move record and a readable current-position summary | user |
| Motion and system colors | All nonessential animation respects `prefers-reduced-motion`; ownership, selection, focus, and results remain distinguishable in Windows forced-colors mode | user |
| Responsive target | The flow remains usable at mobile widths and at 400% zoom/reflow without page-level horizontal scrolling or obscured focus; an intrinsically two-dimensional board/table may scroll within its own labeled region only if fitting it would make controls unusable | accessibility sweep |
| Scope boundary | Tic Tac Toe is excluded except for a shared Engineering Lab component that must be adjusted to avoid regressing Square Off accessibility | user |
| Game behavior | No rule, AI, scoring, capture order, undo semantics, persistence, or server-validation change | user + architecture sweep |
| Route architecture | `/games/statistics` and `/games/statistics/replays/:runId` remain separate lazy React pages served through the existing SPA Blade shell; no content is added to Blade | user + repository convention |
| Test strategy | Vitest/React Testing Library for behavior and semantics, existing reducer/helper regression tests for game integrity, plus mandatory browser and screen-reader verification; do not scaffold an e2e framework in this phase | explored + user |

## Target interaction contract

### Live Square Off board

- Label the board with its game name, dimensions, next player, and concise keyboard instructions associated through `aria-describedby`.
- Preserve row-major visual layout and expose 10 rows and 10 columns through grid semantics.
- Put only the active cell button in the document tab sequence (`tabIndex=0`); all other cell buttons use `tabIndex=-1`. Tab enters at the remembered active coordinate and leaves the entire board with the next Tab press.
- Arrow keys move one coordinate in their spatial direction and stop at an edge. `Home`/`End` move to the first/last cell in the current row; `Ctrl+Home`/`Ctrl+End` move to the first/last cell on the board.
- Keep occupied cells reachable for inspection. Use guarded interaction and `aria-disabled` where necessary instead of removing the currently focused element from the focus order.
- Enter or Space on an empty, playable cell dispatches the existing `SET_SQUARE` action exactly once. Unavailable attempts do not mutate state and receive concise feedback.
- Use one-based coordinates in all user-facing labels and announcements, regardless of zero-based reducer coordinates.
- Retain red and blue styling while adding an immediately visible text/shape cue that survives grayscale and forced-colors modes. The cue must be explained by a visible legend.

### Status, controls, and focus

- Render explicit text such as “Next player: Red,” “Winner: Blue,” or “Tie game”; never require interpretation of a swatch.
- Keep a single polite live region for normal play. Announce one summarized outcome per state transition—for example, player, coordinate, capture count, updated score, and next turn—instead of separately announcing cell mutations.
- Announce “computer turn” once, mark the relevant game region busy while the move is pending, and announce the resolved computer move. Do not move keyboard focus during the computer turn.
- Keep Undo, Reset, mode, difficulty, and rules controls as native elements with visible labels, disabled state, focus indication, and at least a 24×24 CSS-pixel target. Preserve Ctrl/Command+Z behavior.
- An Undo or Reset invocation leaves focus on that control, announces the result, and sets a predictable board re-entry coordinate. A completed game is announced once without forcing focus away from the user.
- When a route or disclosure changes content, move focus only when needed to establish new-page context or restore the user’s prior location. Do not reset focus merely because async data refreshed.

### Replay and statistics

- The replay board exposes the same coordinate and ownership vocabulary as the live board, but does not imply that its cells can place moves.
- Replay controls are natively operable, have stateful names where appropriate (for example, Play/Pause), retain focus during playback, and announce the current move number and its meaningful outcome.
- The replay includes a semantic ordered move log or table with move number, player, coordinate, captures, resulting score, and an `aria-current` indication for the displayed step. Selecting a move from the log updates the visual board.
- Statistics headings, filters, summaries, charts, and tables follow a coherent landmark/heading hierarchy. Every chart has an adjacent semantic table containing the same values and uses labels or patterns in addition to color.
- Loading, validation-pending, Phase 2 warming/degraded, empty, error, retry, and loaded states are programmatically exposed without replacing focused controls or repeatedly announcing polling updates.

## Scope

Files/areas expected to change are listed below. Anything outside this list is scope drift and must be reported before it is changed.

### Existing Square Off and Engineering Lab areas

- `resources/js/components/go/Board.tsx` — named grid container, description/status associations, busy state, and board-level keyboard coordination.
- `resources/js/components/go/BoardRow.tsx` — row and gridcell structure.
- `resources/js/components/go/Square.tsx` — accessible cell name/state, roving tab index, keyboard activation, visible non-color ownership cue, and stable focus ref.
- `resources/js/components/go/BoardStatus.tsx` — explicit textual current-player/result status.
- `resources/js/components/go/ScoreBox.tsx` — status relationships and readable scores.
- `resources/js/components/go/ControlBox.tsx` — accessible Undo/Reset behavior, focus retention, and announcements while preserving existing shortcuts.
- `resources/js/components/go/ModeSelectBox.tsx` — label/state review and focus-visible/touch-target compliance.
- `resources/js/components/go/SquareOffRules.tsx` — keyboard-instruction and legend wording, plus verification of disclosure semantics.
- `resources/js/components/go/Go.tsx` and `resources/js/components/go/BoardHelper.tsx` — compose instructions, legend, live status, controls, and board in a logical reading order.
- `resources/js/components/go/context/GoGameContext.tsx` and `resources/js/components/go/types/GoGameTypes.ts` — only accessibility-facing state/type plumbing that cannot be derived in a co-located hook; the reducer and domain actions remain behaviorally unchanged.
- `resources/js/components/go/hooks/useBoardNavigation.ts` (new, expected name) — encapsulate active-coordinate, roving-tab-index, key mapping, and focus-restoration behavior without putting input logic in the reducer.
- `resources/js/components/go/LiveGameStatus.tsx` (new, expected name) — derive concise announcements from state transitions without making individual cells live regions.
- `resources/js/pages/Games.tsx` — accessible links into statistics/replays and deliberate focus restoration when entering/leaving Square Off; no Tic Tac Toe redesign.
- `resources/sass/modules/GoGame.module.scss` and `resources/sass/modules/Games.module.scss` — focus indicators, non-color ownership cues, target size, reflow, reduced motion, and forced-colors styles.

### Phase 1/2-created statistics and replay areas

- `resources/js/pages/games/statistics/GameStatistics.tsx` — page landmark/heading focus, async states, and accessible composition.
- `resources/js/pages/games/statistics/SquareOffReplay.tsx` — page landmark/heading focus and replay composition.
- `resources/js/components/go/statistics/**` — accessible metric summaries, filters, chart/table equivalence, loading/error/degraded states, and adapter-independent presentation.
- `resources/js/components/go/runs/**` — replay controls, transcript/position text, current-step semantics, loading/error states, and navigation focus. If Phase 1 finalizes a different exact filename, its approved location governs; this feature boundary does not change.
- `resources/js/constants/routes.ts`, `resources/js/App.tsx`, and `routes/web.php` — verify accessible, non-global-nav route registration and hard-load behavior for `/games/statistics` and `/games/statistics/replays/:runId`; change only if the Phase 1 result does not satisfy that contract. Blade files remain unchanged SPA hooks.

### Tests and documentation

- `resources/js/components/go/Board.test.tsx` (new) — grid semantics, accessible states, roving focus, navigation keys, and activation.
- `resources/js/components/go/Go.test.tsx` — status, announcements, computer turn, undo/reset, completion, and reducer-facing integration.
- `resources/js/components/go/SquareOffRules.test.tsx` — instructions, legend, and disclosure regression coverage.
- `resources/js/pages/Games.test.tsx` — entry/return focus and accessible route-link labels.
- `resources/js/components/go/statistics/**/*.test.tsx` and `resources/js/components/go/runs/**/*.test.tsx` — statistics, replay, and async-state contracts.
- `resources/js/pages/games/statistics/*.test.tsx` — route-page headings, focus, and adapter-state integration.
- Phase 1-created `tests/Feature/**/SquareOffWebRoutesTest.php` — extend it to preserve hard-load SPA responses for statistics and unlisted replay URLs, retaining its final Phase 1 location.
- `resources/js/test/setup.ts` — only if deterministic DOM shims for focus, `matchMedia`, or scrolling are required by these tests.
- `docs/accessibility/engineering-lab.md` (new) — rationale, keyboard contract, semantic model, non-color design, known limits, manual verification matrix, and evidence links.
- `README.md` — concise link to the accessibility design/verification document; no duplicate long-form explanation.

## Implementation stages

### Stage 0 — Re-baseline and lock the contract

1. Run the existing PHP and frontend gates and record any pre-existing failures.
2. Start the repository through `./docker-reboot` and the normal frontend build/watch command; do not introduce an ad-hoc local port.
3. Capture before evidence for the live board, replay, and statistics pages at desktop and mobile widths.
4. Keyboard-audit the current focus order and record an accessibility-tree snapshot or equivalent evidence showing current board names/roles.
5. Confirm the Phase 1/2 adapter response shapes and component paths. If meeting this plan would require an API/schema, game-rule, persistence, or service-boundary change, pause for user approval.

Exit gate: baseline is documented, affected paths are confirmed, and no unexplained red test exists.

### Stage 1 — Board semantics and non-color state

1. Write failing React Testing Library tests for the board name, dimensions, row/gridcell relationships, one-based cell names, availability, and ownership.
2. Add the composite grid structure while retaining native button activation inside gridcells.
3. Add a visible ownership marker and legend that remain meaningful in grayscale and forced colors.
4. Replace color-only current-player/result output with explicit text while retaining the visual swatch as decorative.

Exit gate: AC1 and AC2 semantic portions pass, and reducer/helper tests remain unchanged and green.

### Stage 2 — Roving navigation, activation, and focus

1. Write failing tests for Tab entry/exit, arrows, Home/End, Ctrl+Home/End, edge stopping, remembered active coordinate, Enter, and Space.
2. Implement navigation in a co-located hook/helper. Keep the reducer pure and do not introduce accessibility-only domain actions.
3. Make occupied cells inspectable, prevent unavailable activation through existing guards, and keep focus stable through captures and computer turns.
4. Add deterministic focus behavior for Undo, Reset, entering Square Off, leaving it, and route-level replay/statistics navigation.

Exit gate: AC2, AC3, AC5, and AC11 component/integration tests pass with no keyboard trap.

### Stage 3 — Deliberate announcements and async states

1. Write failing tests for normal moves, capture summaries, turn changes, computer pending/resolved moves, undo/reset, game completion, and rejected activation.
2. Add one live-status component that compares meaningful state transitions; do not make cells, scores, and polling containers competing live regions.
3. Mark genuine pending regions busy and provide stable loading, warming/degraded, empty, error, and retry states for replay/statistics data.
4. Ensure polling or adapter refreshes update content without re-announcing unchanged values or stealing focus.

Exit gate: AC4, AC5, and AC9 pass; announcements contain no replay capability, internal identifier, request payload, or other sensitive value.

### Stage 4 — Replay and statistics equivalence

1. Write failing tests for replay control names/state, current-step focus/announcement, transcript semantics, and board/log synchronization.
2. Add the readable move log/current-position representation while reusing the canonical display types from the earlier phases.
3. Write failing tests that each statistics visualization references an equivalent semantic table and that filters/results have useful names and states.
4. Make the statistics presentation adapter-independent so a Phase 2 BFF switch cannot remove its accessible structure.

Exit gate: AC7 and AC8 pass against success, empty, and representative edge-case datasets.

### Stage 5 — Visual robustness

1. Apply a consistent, unclipped focus indicator to the board, controls, disclosure, links, filters, replay timeline, and retry actions.
2. Remove or suppress nonessential transitions under `prefers-reduced-motion: reduce`.
3. Use system-color-compatible borders/text/markers in `forced-colors: active`; do not rely on forced color adjustment being disabled.
4. Verify target sizes, contrast, text spacing, reflow, and localized overflow at mobile width and 200%/400% zoom.

Exit gate: AC10 passes its automated hooks/semantics checks and manual browser matrix.

### Stage 6 — Full verification and documentation

1. Run the focused tests, then `yarn test`, `yarn typecheck`, `yarn lint:styles`, `yarn prod`, `php artisan test`, and the repository’s existing production Docker/CI-equivalent gate as applicable.
2. Execute the real-browser keyboard, responsive, reduced-motion, and forced-colors matrix below.
3. Execute the screen-reader matrix below and record actual results, browser/assistive-technology versions, limitations, and evidence. Do not claim combinations that were not tested.
4. Document the semantic model and why the grid, single live region, non-color cues, text equivalents, and adapter-independent presentation were chosen.
5. Run the repository self-review loop. Pause for user review before commit, push, or deployment.

Exit gate: all acceptance criteria have evidence, the deterministic gate is green apart from explicitly documented pre-existing failures, and the user has reviewed the diff.

## Acceptance criteria

### AC1 — Board and ownership are understandable without color

- **Given** the Square Off board contains empty, Red-owned, and Blue-owned cells, **when** it is inspected visually or through the accessibility tree, **then** it is exposed as a named 10×10 grid and every cell communicates one-based row/column, ownership or emptiness, and availability, while visible ownership uses both color and a documented non-color cue.
- Tests: `exposes a named 10 by 10 grid with coordinates, ownership, and availability` (integration); `renders explicit current-player, score, and result text` (integration).
- Manual evidence: grayscale/high-contrast screenshots and accessibility-tree inspection.

### AC2 — The board is one keyboard stop with spatial navigation

- **Given** focus approaches the live board by keyboard, **when** the user presses Tab, arrows, Home/End, or Ctrl+Home/Ctrl+End, **then** Tab enters one remembered active cell, spatial keys move to the specified coordinate without wrapping at edges, occupied cells remain inspectable, and the next Tab leaves the board rather than traversing 100 buttons.
- Tests: `uses roving tab index and spatial keyboard navigation across every cell state` (integration); `stops at board edges and supports row and board boundary keys` (integration).

### AC3 — Keyboard activation matches pointer play

- **Given** an active board coordinate, **when** the player presses Enter or Space, **then** an available square dispatches the same single move as a pointer click, while an occupied square, completed game, or computer turn does not change game state and provides concise feedback without losing focus.
- Tests: `activates an available cell once with Enter or Space and rejects unavailable activation` (integration); `keeps the active coordinate stable through a capture and computer turn` (integration).

### AC4 — Dynamic play is announced without noise

- **Given** a screen-reader user is playing a game, **when** a move, capture, score change, turn transition, computer move, or game completion occurs, **then** one polite live region announces one concise summary in logical order, unchanged polling/state is silent, and focus is not moved.
- Tests: `announces one summarized status for player moves, captures, scores, and completion` (integration); `announces computer pending and resolved states once without moving focus` (integration).
- Manual evidence: NVDA announcement transcript for a representative Person game and Computer game.

### AC5 — Undo and Reset preserve context

- **Given** Undo or Reset is available, **when** it is invoked by button or supported keyboard shortcut, **then** the existing game semantics are preserved, focus remains on the invoked control, the outcome is announced once, and the next board entry uses a predictable valid coordinate.
- Tests: `retains control focus and announces undo and reset outcomes` (integration); existing `undoes the latest move with Ctrl+Z` (integration).

### AC6 — Rules and configuration remain natively operable

- **Given** the rules, mode, difficulty, Undo, and Reset controls, **when** a keyboard or screen-reader user operates them, **then** native names, expanded/disabled/current states, visible focus, logical reading order, and at least 24×24 CSS-pixel targets are available without changing the underlying configuration rules.
- Tests: `keeps rules instructions and the ownership legend in a named native disclosure` (integration); `exposes labeled mode and difficulty controls with accurate disabled state` (integration).
- Manual evidence: keyboard focus-order and target-size inspection at desktop and mobile widths.

### AC7 — A replay has equivalent non-visual information

- **Given** a valid unlisted Square Off replay, **when** a user loads it or changes the displayed step using any replay control or move-log entry, **then** the page exposes a read-only named board, a semantic ordered move record with player/coordinate/capture/score data, the current step programmatically and visually, a concise announcement, and stable control focus.
- Tests: `keeps replay controls, board position, and semantic move log synchronized` (integration); `labels replay controls and exposes the current step without interactive board affordances` (integration).

### AC8 — Statistics never depend on a chart alone

- **Given** verified-run statistics are loaded, **when** totals, mode/difficulty splits, results, durations, margins, captures, lead changes, and recent-run values are shown, **then** every metric and chart is named, each chart has an adjacent semantic table with the same values, and series/categories use labels or patterns in addition to color.
- Tests: `renders every statistics visualization with an equivalent named data table` (integration); `labels filters and updates summaries without losing focus` (integration).
- Manual evidence: standard-color, grayscale, and forced-colors screenshots.

### AC9 — Async and degraded states are perceivable and recoverable

- **Given** statistics or replay data is loading, pending validation, empty, warming, degraded, failed, or refreshed, **when** its state changes, **then** the affected region exposes the correct busy/status/alert semantics, preserves the last usable Phase 1 content when appropriate, offers a named retry action for recoverable errors, and neither steals focus nor repeatedly announces unchanged polling results.
- Tests: `exposes stable loading, pending, empty, warming, degraded, error, retry, and loaded states` (integration); `preserves focus and prior usable content across refresh and retry` (integration).

### AC10 — The experience survives zoom, motion preferences, and forced colors

- **Given** a supported browser at mobile width, 200%/400% zoom, reduced-motion preference, or Windows forced-colors mode, **when** the user plays, reviews a replay, or reads statistics, **then** content reflows without page-level two-dimensional scrolling, focus is visible and not clipped/obscured, controls meet the 24×24 CSS-pixel target minimum, ownership/results remain distinguishable, and nonessential animation is removed.
- Tests: `applies stable semantic and class hooks for focus, ownership, and async presentation states` (integration); `preserves accessible labels when responsive presentation changes` (integration).
- Manual evidence: the responsive/visual browser matrix below; this criterion cannot be claimed from jsdom alone.

### AC11 — Direct and in-app navigation establish useful focus

- **Given** a user opens `/games/statistics` or an unlisted replay directly, or follows/returns through an in-app link, **when** navigation completes, **then** the server returns the SPA shell, the page announces a unique heading, focus moves to that heading only for new-page context, and Back/return navigation restores focus to the originating control when it still exists.
- Tests: `establishes heading focus for direct statistics and replay navigation and restores origin focus on return` (integration); `serves the SPA shell for statistics and replay hard loads` (integration).

### AC12 — Accessibility changes do not alter the game or service contracts

- **Given** the existing Square Off reducer fixtures and representative Person/Computer games, **when** the accessibility layer is applied, **then** move legality, trap/capture order, AI invocation, scoring, undo/reset, completion, run submission, replay data, and statistics values remain behaviorally identical, and no API/schema or Blade-content change is introduced.
- Tests: existing `gameReducers.test.ts` and `helpers.test.ts` suites (unit); `preserves Square Off play and submission behavior with the accessible board` (integration); existing Phase 1 contract and feature suites (integration).

## Planned test list

| Test | Layer | Acceptance criteria |
|------|-------|---------------------|
| `exposes a named 10 by 10 grid with coordinates, ownership, and availability` | integration | AC1 |
| `renders explicit current-player, score, and result text` | integration | AC1 |
| `uses roving tab index and spatial keyboard navigation across every cell state` | integration | AC2 |
| `stops at board edges and supports row and board boundary keys` | integration | AC2 |
| `activates an available cell once with Enter or Space and rejects unavailable activation` | integration | AC3 |
| `keeps the active coordinate stable through a capture and computer turn` | integration | AC3 |
| `announces one summarized status for player moves, captures, scores, and completion` | integration | AC4 |
| `announces computer pending and resolved states once without moving focus` | integration | AC4 |
| `retains control focus and announces undo and reset outcomes` | integration | AC5 |
| Existing `undoes the latest move with Ctrl+Z` | integration | AC5 |
| `keeps rules instructions and the ownership legend in a named native disclosure` | integration | AC6 |
| `exposes labeled mode and difficulty controls with accurate disabled state` | integration | AC6 |
| `keeps replay controls, board position, and semantic move log synchronized` | integration | AC7 |
| `labels replay controls and exposes the current step without interactive board affordances` | integration | AC7 |
| `renders every statistics visualization with an equivalent named data table` | integration | AC8 |
| `labels filters and updates summaries without losing focus` | integration | AC8 |
| `exposes stable loading, pending, empty, warming, degraded, error, retry, and loaded states` | integration | AC9 |
| `preserves focus and prior usable content across refresh and retry` | integration | AC9 |
| `applies stable semantic and class hooks for focus, ownership, and async presentation states` | integration | AC10 |
| `preserves accessible labels when responsive presentation changes` | integration | AC10 |
| `establishes heading focus for direct statistics and replay navigation and restores origin focus on return` | integration | AC11 |
| `serves the SPA shell for statistics and replay hard loads` | integration | AC11 |
| Existing `gameReducers.test.ts` and `helpers.test.ts` suites | unit | AC12 |
| `preserves Square Off play and submission behavior with the accessible board` | integration | AC12 |
| Existing Phase 1 API contract and feature suites | integration | AC12 |

Test discipline:

- Add the behavior test first and prove it fails for the expected reason before implementation.
- Prefer role/name/state assertions and observable focus/state transitions; do not test private hook internals or CSS-module hashes.
- Use lower-level unit tests only for navigation-coordinate calculations that are difficult to exercise clearly through the board. Do not duplicate behavior already covered through the rendered component.
- No test may depend on the computer opponent’s random move coordinate; inject/control randomness using the established test seam and assert accessible state transitions.
- A green jsdom suite is not evidence for visible focus, reflow, contrast, forced colors, reduced motion, or real screen-reader speech. Those remain mandatory manual/browser checks.

## Browser and assistive-technology verification

### Real-browser matrix

Use the normal Docker-served application and capture before/after evidence for each relevant surface.

| Environment | Live game | Replay | Statistics | Required checks |
|-------------|-----------|--------|------------|-----------------|
| Chromium desktop, 1280px or wider | yes | yes | yes | Full keyboard flow, visible/unclipped focus, standard contrast, no console/network regression |
| Chromium responsive viewport around 390×844 | yes | yes | yes | Touch targets, readable board/status, no page-level horizontal overflow, tables/controls usable |
| 1280px viewport at 400% zoom (approximately 320 CSS px) | yes | yes | yes | WCAG reflow, focus not obscured, localized board/table overflow only if necessary |
| Windows forced-colors mode | yes | yes | yes | Cell ownership, current step, focus, charts, errors, and disabled controls remain distinguishable |
| `prefers-reduced-motion: reduce` | yes | yes | yes | Board/capture, disclosure, replay, chart, and loading transitions are removed or immediate |
| Firefox desktop | representative game | representative replay | representative stats | Keyboard/focus and native control behavior agree with Chromium |

### Manual screen-reader matrix

| Assistive technology | Browser/platform | Required scenario |
|----------------------|------------------|-------------------|
| NVDA | Chrome on Windows | Complete representative Person-mode turns; inspect occupied cells; trigger a capture, Undo, Reset, and game result; navigate a replay and statistics table |
| NVDA | Firefox on Windows | Grid entry/exit, arrow navigation, cell names/states, rules disclosure, and one replay/statistics path |
| Narrator | Edge on Windows | Smoke-test names, focus order, live status, error/retry, and table navigation |
| VoiceOver | Safari on iPhone, user-assisted if necessary | Touch exploration of ownership/state, replay controls, statistics alternatives, responsive reading order, and absence of focus loss |

Record versions and actual results in `docs/accessibility/engineering-lab.md`. If an environment is unavailable, record the gap explicitly and obtain user direction before claiming completion; do not silently substitute an accessibility-tree inspection for a real screen-reader pass.

## Domain requirements

| Domain | Requirement | Enforced via |
|--------|-------------|--------------|
| Security and sensitive data | Accessible names, announcements, error text, and debug output must never expose unlisted replay capabilities, management secrets, signed tokens, internal request payloads, IP addresses, or user-agent data | AC4, AC7, AC9; implementation rule |
| Security and sensitive data | Do not add client-side secrets, bot-detection claims, or new analytics events as an accessibility technique | implementation rule |
| Accessibility | Named composite grid, one tab stop, spatial navigation, Enter/Space activation, accessible state, non-color cues, explicit status, and stable focus | AC1–AC6 |
| Accessibility | Replay text log and statistics data tables provide equivalent information to visual boards/charts | AC7, AC8 |
| Accessibility | Async states, reflow, focus appearance/not-obscured, touch targets, reduced motion, forced colors, and assistive-technology evidence meet the WCAG 2.2 AA target | AC9, AC10, AC11 |
| Observability | User-visible async states distinguish loading, pending validation, warming/degraded service, empty data, and actionable failure without exposing internals | AC9 |
| Observability | Record browser/assistive-technology versions and results so a future regression is diagnosable; do not collect visitor accessibility preferences or screen-reader usage | documentation rule |
| Data safety | Accessibility work must not migrate, rewrite, delete, or reinterpret stored runs, replays, invalid-game records, or aggregate statistics | AC12 |
| API contracts and compatibility | Consume the established typed adapter contract and tolerate documented pending/degraded states; do not change REST, GraphQL, replay capability, or server-validation contracts | AC9, AC12 |
| Performance | Use one consolidated live region rather than 100 per-cell observers/live regions; avoid polling-induced announcement/render storms and do not add a runtime accessibility dependency for behavior available from React/native HTML | AC4, AC9; implementation rule |
| Architecture fit | Keep the game reducer pure, isolate keyboard/focus behavior in co-located React code, retain native controls, and keep Blade as an unchanged SPA hook | AC3, AC6, AC12 |
| Architecture fit | Keep statistics/replay semantics in presentation components so Phase 1 REST and Phase 2 GraphQL adapters cannot fork accessibility behavior | AC7–AC9 |

Rejected sweep requirements:

| Domain | Requirement | Rejected because |
|--------|-------------|------------------|
| Security and sensitive data | Redesign or authenticate analytics within this phase | The user explicitly separated analytics endpoint hardening into an earlier task; this plan emits no new events and does not weaken that boundary |
| Data safety | Add migrations, retention rules, or replay deletion behavior | This phase is presentation/input accessibility only; persistence and statistics integrity belong to Phase 1 contracts |
| API contracts and compatibility | Change API response shapes to match screen-reader prose | Presentation adapters should derive human-readable content from established typed data, keeping public contracts stable |
| Performance | Virtualize the 100-cell board or the initial bounded statistics set | The fixed 10×10 grid and bounded metrics do not justify focus/semantics complexity; reassess only with measured evidence |
| Architecture fit | Move keyboard navigation or announcements into the reducer/server validator | Those are UI concerns and would mix presentation with deterministic game-domain behavior |
| Accessibility | Replace native `details`, `button`, or `select` elements with custom ARIA widgets | Native elements already supply more reliable semantics and keyboard behavior |
| Accessibility | Redesign Tic Tac Toe at the same time | The user limited Phase 3 to Square Off, replay, and statistics; only unavoidable shared-component regression fixes are allowed |
| Test architecture | Scaffold Playwright, Cypress, or another e2e harness | The repository has no e2e infrastructure and the user chose focused RTL coverage plus real-browser verification for this phase |

## Documentation deliverables

Create `docs/accessibility/engineering-lab.md` as a durable engineering artifact, not a compliance claim. It must explain:

- why a composite grid with roving focus was chosen over 100 tab stops;
- exact keyboard commands, edge behavior, one-based coordinate vocabulary, and focus-restoration rules;
- how visible non-color cues, forced-colors styles, and text/table alternatives preserve the information carried by color and charts;
- why one consolidated live region is used and which transitions it announces;
- how replay/statistics presentation remains stable across Laravel REST and an optional future BFF adapter;
- WCAG 2.2 AA criteria addressed, known limitations, and decisions that remain intentionally out of scope;
- automated test coverage and the completed manual browser/screen-reader matrix, including versions, dates, evidence links, and honest gaps.

Update the root `README.md` with one concise link to this document. Add source comments only where a non-obvious invariant—such as roving focus or announcement deduplication—would otherwise be easy to break. Do not add narration comments for self-evident JSX, and follow the repository PHPDoc rule if an approved scope change ever introduces PHP declarations.

## Rollout and rollback

- Ship through the existing CI and manually approved Render deployment flow. Do not enable Render auto-deploy or add a second production approval.
- This phase should require no database migration, queue change, new service, secret, environment variable, or API version.
- Exercise post-deploy smoke checks on `/games`, `/games/statistics`, one unlisted replay, and `/up`; do not include a real replay capability in public logs or screenshots.
- Accessibility improvements are not feature-flagged by default because two code paths would invite regression. If a severe production interaction regression appears, roll back the single frontend release through the existing Render rollback path, then correct the issue with the same tests and browser matrix.

## Risks

- **ARIA grid semantics can become worse than native buttons if incomplete.** Mitigate with row/gridcell structure tests and real NVDA/Firefox/Chrome verification rather than role assertions alone.
- **Roving focus can drift from reducer state or disappear when a cell changes state.** Keep active coordinate in presentation state, retain mounted cell elements, and cover captures, undo, reset, computer turns, and completion.
- **Live regions can become noisy during captures or polling.** Centralize and deduplicate announcements around meaningful transitions; never mark the whole board or statistics result set live.
- **Visible non-color markers can crowd a 10×10 mobile board.** Prototype at the smallest supported viewport and 400% zoom before finalizing; prefer concise scalable markers and a legend.
- **Forced-colors and zoom behavior cannot be proven by jsdom.** Treat the manual matrix as a release gate and preserve evidence.
- **Replay/statistics paths may move while Phase 1/2 are implemented.** Reconcile filenames at Stage 0; path-only changes inside the same feature boundary are not scope expansion, but contract or responsibility changes require approval.
- **No automated e2e harness means route/focus regressions can escape component tests.** Mitigate with server hard-load feature tests and repeatable real-browser scripts/checklists; do not overstate automated coverage.
- **Some screen-reader/platform combinations may be unavailable to the implementation agent.** Record the gap and request user-assisted verification rather than asserting untested conformance.

## Out of scope

- Analytics endpoint security, rate limiting, event authenticity, or analytics schema changes.
- Tic Tac Toe accessibility work beyond a required shared-component regression fix.
- Changes to Square Off rules, trap/capture ordering, AI strategy/randomness, scoring, undo semantics, or game duration validation.
- Database migrations, run retention/deletion, verification jobs, statistics definitions, capability-token design, or replay visibility policy.
- REST, GraphQL, OpenAPI, or service-auth contract changes.
- New BFF, Python, Redis, queue-worker, or Render service architecture.
- A global design-system rewrite, global navigation redesign, or Blade-rendered content.
- A new automated end-to-end test framework or a third-party accessibility overlay/widget.
- A blanket claim that the entire portfolio conforms to WCAG 2.2 AA; the target is limited to the named Engineering Lab surfaces.

## Flags and approval gates

- `ui_visible`: true
- `e2e_applicable`: false — the repository has no e2e harness; real-browser proof remains mandatory.
- Pause points requested:
  1. Before implementation, for explicit approval of this plan.
  2. Before Phase 3 begins, until the separate analytics-hardening work and required Phase 1 UI are complete.
  3. During Stage 0 if implementation would require any API/schema, game-rule, persistence, service-boundary, Blade-content, or Tic Tac Toe change.
  4. After deterministic tests, browser/screen-reader verification, and self-review are complete, before commit, push, or deployment.

## Planning record

| Phase | Status | Result |
|-------|--------|--------|
| Research | EXECUTED | Current Square Off components, styles, tests, route model, and absence of an e2e harness inspected |
| Domain sweeps | EXECUTED | Security, accessibility, observability, data safety, API compatibility, performance, and architecture requirements resolved above |
| Grill | EXECUTED | Scope, sequencing, interaction model, verification expectations, and exclusions resolved with the user across the three-phase planning discussion |
| Plan | EXECUTED | This standalone, test-mapped implementation plan |
| Approval gate | BLOCKED | Awaiting explicit user approval; do not implement from this document yet |
