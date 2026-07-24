# AGENTS.md

Guidance for AI coding agents working in this repository. Human contributors may find it useful too, but it is written to give agents the context needed to make correct, idiomatic changes quickly.

## Project overview

Kennen Lawrence's personal portfolio site. It is a **Laravel 13 backend that serves a single-page React 18 + TypeScript application**. Laravel returns HTML shells, exposes a small block of public contact and analytics configuration, temporarily retains an unused legacy analytics endpoint, and proxies the configured resume through a same-origin download endpoint; virtually all UI, routing, analytics, and game logic lives in the React app under `resources/js`. There is no meaningful database usage — the site is effectively static content plus two interactive browser games.

- **Backend:** Laravel 13, PHP 8.5
- **Frontend:** React 18, TypeScript (strict), React Router 6
- **Build:** Webpack 5 (via `package.json` scripts) with `ts-loader`
- **Frontend tests:** Vitest + jsdom + React Testing Library
- **Styling:** Tailwind CSS 3 (utility classes in JSX) + SCSS Modules (`*.module.scss`) for game/component-specific styles
- **Local infra:** Docker Compose (nginx + php-fpm + MySQL)

## Setup & common commands

Install dependencies:

```bash
composer install      # PHP dependencies
yarn install --frozen-lockfile  # JS dependencies; yarn.lock is authoritative
```

Build the frontend (compiles `resources/js` + `resources/sass` into `public/js` and `public/css`):

```bash
yarn dev        # one-off development build
yarn watch      # development build, rebuild on change (use this while working)
yarn prod       # minified production build
```

Run the app locally:

```bash
# Option A — Docker (matches production-ish setup; serves on http://localhost:8080, host kennen.local)
./docker-reboot            # creates the docker network, then docker-compose up -d

# Option B — Laravel's dev server (requires a reachable DB per .env; run `yarn watch` alongside)
php artisan serve
```

Tests:

```bash
php artisan test          # or: ./vendor/bin/phpunit
yarn test                 # Vitest unit and component tests
yarn test:watch           # Vitest watch mode
```

Lint / format:

```bash
./vendor/bin/pint                        # PHP formatting (Laravel Pint)
yarn lint:styles                         # SCSS linting (config in .stylelintrc.json)
yarn typecheck                           # strict TypeScript check without output
# TypeScript is type-checked at build time by ts-loader; `strict` is on in tsconfig.json.
# There is no ESLint or Prettier config — match the style of surrounding code.
```

## Architecture: how a page renders

This is the single most important thing to understand before changing routing or navigation.

1. Laravel SPA page routes in `routes/web.php` map each page URL to a Blade view (`Route::view('/games', 'games.index')`).
2. Every Blade view (`resources/views/**/index.blade.php`) extends `layouts/app.blade.php` and renders the exact same thing: a `<div id="root"></div>`.
3. `layouts/app.blade.php` loads `public/css/appStyles.css` + `public/js/app.js` and injects public contact and analytics config as `window.APP_CONFIG`.
4. `resources/js/App.tsx` mounts React into `#root` and hands control to React Router (`BrowserRouter`), which renders the real page based on `window.location`.

Separately, `routes/api.php` temporarily retains the legacy
`POST /api/analytics/events` endpoint. React no longer calls it; browser telemetry flows
through the typed, permission-gated GA4 adapter in `resources/js/analytics`. Direct
requests to the legacy endpoint still write structured `portfolio_event` entries to the
application log until a follow-up change removes it.

The GA4 web stream must keep Enhanced Measurement's browser-history page views disabled
before analytics is enabled. `send_page_view: false` covers tag-load behavior only;
`PageViewTracker` is the sole application page-view source. Provider page context is
restricted to canonical same-origin URLs with referrer attribution suppressed.

`routes/web.php` also exposes the server-only `GET /resume/download` endpoint. It reads
the upstream URL from `config/resume.php`, validates the fetched PDF, and returns an
attachment. The upstream URL must never be added to `window.APP_CONFIG`.

**SPA page routes are declared in two places and must be kept in sync:**
- Server side: `routes/web.php` (so a hard page load / refresh on an SPA deep link returns the shell instead of a 404).
- Client side: `resources/js/constants/routes.ts` (the `HOME_ROUTE` + `ROUTES` map that `App.tsx` and the nav bars consume).

Tracked client routes must also be added to the canonical analytics allowlist in
`resources/js/analytics/contracts.ts`; its contract test enforces synchronization with
the client route table. If you add a page, update all applicable locations. Note the
current mismatch (see Gotchas): `web.php` serves `/projects` and `/skills`, but
`routes.ts` has no client route for them.

## Directory map

```
app/                         Laravel PHP (thin — SPA support, resume proxy + legacy analytics endpoint)
config/app.php               Public 'contact' config block, populated from CONTACT_* env vars
config/analytics.php         Public fail-closed analytics configuration
config/resume.php            Server-only upstream resume URL
routes/api.php               Temporarily retained legacy analytics endpoint
routes/web.php               Blade SPA shells plus the resume download endpoint
resources/views/             Blade shells (one per route), all extend layouts/app.blade.php
resources/sass/              Global SCSS (app.scss) + SCSS Modules under modules/ + abstracts/
resources/js/                THE REACT APP — most work happens here
  App.tsx                    Entry point: mounts React, sets up Router + Suspense
  analytics.ts              Typed browser analytics facade
  bootstrap.js               Axios global setup
  constants/routes.ts        Client-side route table (lazy-loaded page components)
  constants/                 Static data: skills.ts, certificates.ts, gameConsts.ts
  helpers.ts                 Shared helpers (e.g. capitalize)
  pages/                     Top-level route components (Home, Games, Experience, Contact)
  components/                Reusable + feature components
    layout/                  Header, Footer, Layout (renders <Outlet/>), Loading
    navigation/              Desktop + mobile nav bars, hamburger
    card/                    Collapsible Card and its sub-parts
    go/                      "Square Off Pro" game (Go-like) — see Games section
    TicTacToe/               Tic Tac Toe game
    tooltip/, contact/       Smaller feature components
  types/                     Global/ambient types (globals.d.ts, custom.d.ts for *.module.scss)
public/                      Webpack output (js/, css/) + static assets (svg/, images/). GITIGNORED build output.
tests/                       PHPUnit Feature/Unit tests
vitest.config.ts             Frontend test configuration
docker/                      nginx, php, mysql Docker configs
```

## Conventions

Follow the existing patterns — they are consistent across the codebase.

**Imports use path aliases, not long relative paths.** These are defined in **two** places that must stay in sync: `webpack.config.js` (`resolve.alias`) and `tsconfig.json` (`compilerOptions.paths`).
- `JS/*` → `resources/js/*`
- `Components/*` → `resources/js/components/*`
- `Constants/*` → `resources/js/constants/*`
- `Sass/*` → `resources/sass/*`

Example: `import Section from 'Components/Section'`, `import styles from 'Sass/modules/Games.module.scss'`.

**PHP documentation:** Every PHP class, method, declared property, and class constant must have a PHPDoc block that follows the conventions of the Laravel and PHP versions currently used by the repository (currently Laravel 13 and PHP 8.5). Keep native parameter, property, and return types as the source of truth. Use PHPDoc to describe intent and to express details native PHP types cannot, such as array shapes and generics; do not add redundant `@param` or `@return` tags when the native declaration already fully expresses the type.

**Laravel controllers and services:** Use explicit named controller actions when the action name makes the route clearer; invokable controllers remain appropriate for truly self-contained single actions. Keep controllers focused on translating between HTTP requests/responses and the application. Extract business rules and external-system integration logic into concrete classes under `app/Services` and inject them through the Laravel service container. Rely on zero-configuration resolution for concrete services; introduce interfaces and service-provider bindings only when multiple implementations or a genuine substitution boundary exists.

**Feature flags and environment configuration:** Treat an unset or disabled environment value as the activation boundary for incomplete or staged functionality. Preserve supported environment-variable wiring and vendor-generated configuration comments unless a concrete compatibility, security, or product requirement makes changing them necessary. Prefer safe, environment-overridable defaults plus tests and deployment gates. Do not hardcode a configurable feature off, remove its supported integration path, or add a temporary code kill switch merely to prevent an operator from deliberately enabling it before the dependent work is ready.

**TypeScript types are prefixed with `T`** (`TGameState`, `TRoute`, `TCardProps`, `TSkillType`). Component prop types are typically declared inline in the same file as `type TXxxProps = {...}`. Shared/domain types live in a co-located `types/` folder (e.g. `components/go/types/GoGameTypes.ts`).

**Components:** PascalCase file names, `React.FC` function components, `export default` one component per file. Feature areas are self-contained folders bundling the component with its own `constants/`, `context/`, `types/`, and `helpers.ts`.

**Styling is a hybrid:**
- Prefer **Tailwind utility classes** directly in JSX for layout/spacing/color (see `Home.tsx`, `Layout.tsx`).
- Use **SCSS Modules** (`resources/sass/modules/*.module.scss`) for anything component-specific/stateful, imported as `styles` and applied via `classNames(styles.foo, ...)`. Local class names are camelCase (configured in webpack). Combine conditional classes with the `classnames` package.
- Global element styles (`h1`–`h5`, links) live in `resources/sass/app.scss` using Tailwind's `@apply`.

**Indentation:** 4 spaces (2 for YAML), LF line endings, final newline — enforced by `.editorconfig`.

**Contact / personal data flow:** never hardcode visible contact details in React. They come from their `CONTACT_*` env vars → `config/app.php` (`contact` block) → `window.APP_CONFIG` (injected in the Blade layout) → typed as `AppConfig` in `resources/js/types/globals.d.ts`.

`CONTACT_RESUME_URL` is the exception: it is server-only configuration in `config/resume.php`. React links only to `/resume/download`; do not expose the upstream URL through `window.APP_CONFIG`.

## Games

Both games follow the same **`useReducer` + Context** state pattern. When touching game logic, keep the reducer pure and put branching logic in the co-located helpers.

- **Square Off Pro** (`components/go/`) — a Go-like territory game. State/reducer live in `context/GoGameContext.tsx`; move mechanics in `helpers.ts`; the **computer opponent AI** is in `aiHelpers.ts` with `easy` / `normal` / `hard` difficulties and heavily documented function types in `types/GoGameTypes.ts`. Board size and colors are in `constants/GoGameConsts.ts`.
- **Tic Tac Toe** (`components/TicTacToe/`) — same structural pattern (context/reducer, constants, types, helpers).
- Shared game vocabulary (`GAMES`, `GAME_MODES`, `DIFFICULTIES`) is in `constants/gameConsts.ts`. `pages/Games.tsx` is the game selector/switcher and lazy-loads each game.

## Gotchas & things to know

- **Build output is gitignored.** `public/js`, `public/css` (and `public/build`, `public/hot`) are not committed — you must run a build (`yarn dev`/`watch`) for changes to appear. Editing `resources/js` alone does nothing until rebuilt.
- **Two webpack configs exist.** `webpack.config.js` is the active one (invoked by the `package.json` scripts and using `ts-loader`). `webpack.mix.js` is a leftover Laravel Mix config and is **not** used by the current build scripts — prefer `webpack.config.js`.
- **Orphaned routes.** `web.php` defines `/projects` and `/skills`, but `routes.ts` has no matching client route and the nav bars don't link to them, so they render an empty page. Project/experience content actually lives in `pages/experience/Experience.tsx`. Don't assume every server route has a working page.
- **Route duplication.** Adding or renaming an SPA page requires editing both `routes/web.php` and `resources/js/constants/routes.ts` (see Architecture). Server-only endpoints such as `/resume/download` belong only in Laravel routes.
- **Render deploys the production Docker target.** `docker/php/Dockerfile` ends with the `production` stage used by Render. Keep PHP, Node, Composer, and Yarn changes compatible with that stage, and verify it with the Docker job in `.github/workflows/ci.yml`.
- **CI mirrors production.** Pull requests and pushes to `main` run Pint/PHPUnit, Stylelint/TypeScript/Vitest/Webpack, dependency audits, and a no-push build of the Render production image.
- **Production deployment is deliberately manual.** Render auto-deploy must remain off. `.github/workflows/deploy.yml` requires a successful automatic `main` CI run for the exact commit, waits for approval from the protected GitHub `production` environment, and triggers a commit-specific Render deploy through the environment-scoped `RENDER_DEPLOY_HOOK_URL` secret. Do not add automatic push-based deployment behavior or repeat the full CI suite in the deployment workflow.
- **Render readiness uses Laravel's `/up` route.** Keep the Render service health check path set to `/up` so a new instance does not receive traffic until Laravel is responding.
- **Render proxy trust is intentional.** `bootstrap/app.php` trusts forwarded headers because the production container receives public traffic through Render's load balancer. The resume throttle depends on that configuration to limit originating clients independently.
- **Vitest covers focused frontend behavior.** Keep component interactions, shared helpers, analytics, routing behavior, and pure game reducers covered as those areas change. There is no ESLint configuration, so match surrounding TypeScript style.
- **`.env` is gitignored.** Keep real application keys, contact data, and Render secrets out of commits and Docker build contexts; `.env.example` is the sanitized template.
