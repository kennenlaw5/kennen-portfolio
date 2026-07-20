# kennen.dev

Source code for [Kennen Lawrence's portfolio](https://kennen.dev). The site presents professional experience, featured projects, technical skills, contact information, and a pair of interactive engineering experiments.

The project uses Laravel as a thin server-side shell for a React single-page application. Nearly all routing, content, presentation, and interaction live in the TypeScript frontend.

## Tech stack

- Laravel 13 and PHP 8.5
- React 18 and TypeScript in strict mode
- React Router 6
- Vitest, jsdom, and React Testing Library
- Webpack 5 with `ts-loader`
- Tailwind CSS 3 and SCSS Modules
- Docker Compose with nginx, PHP-FPM, and MySQL 8
- Render deployment through the production Docker target

## Architecture

Laravel routes return Blade views that contain the React mount point. The shared Blade layout loads the compiled assets and exposes contact configuration through `window.APP_CONFIG`. React then renders the requested page through `BrowserRouter`.

```text
Request
  -> routes/web.php
  -> Blade SPA shell
  -> resources/js/App.tsx
  -> React Router page
```

Routes are declared in both of these files and must remain synchronized:

- `routes/web.php` handles direct requests and browser refreshes.
- `resources/js/constants/routes.ts` controls client-side rendering and navigation.

Blade views are mount shells only. Visible page content belongs in `resources/js`, not in the route-specific Blade files.

The only JSON endpoint is `POST /api/analytics/events`. It accepts a small allowlist
of anonymous interaction events and writes structured `portfolio_event` entries to
the application log; it does not use cookies, visitor identifiers, or the database.

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

## Environment-backed contact information

Visible contact details must not be hardcoded in React. Configure them in `.env` using these variables:

```dotenv
CONTACT_PHONE=
CONTACT_EMAIL=
CONTACT_LINKEDIN_URL=
CONTACT_GITHUB_URL=
CONTACT_RESUME_URL=
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

The downloadable resume URL follows the same flow and is consumed by the shared resume-download helper.

## First-party analytics

The React application records page views, successful resume downloads, project-link
clicks, and contact-link clicks through the first-party analytics endpoint. Payloads
contain only the event name, current path, and an optional non-personal label. Browsers
with Do Not Track enabled do not send events.

On Render, filter the application logs for `portfolio_event` to inspect these events.
This intentionally provides lightweight operational visibility rather than a visitor
profile or full analytics dashboard.

## Frontend commands

```bash
yarn dev          # one-time development build and TypeScript check
yarn watch        # rebuild when source files change
yarn prod         # minified production build
yarn typecheck    # strict TypeScript check without emitting assets
yarn test         # run the frontend test suite once
yarn test:watch   # run frontend tests in watch mode
yarn lint:styles  # lint SCSS and SCSS Modules
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

TypeScript is checked by `ts-loader` during every frontend build. Vitest runs the
TypeScript unit and component tests in jsdom. There is no ESLint configuration.

Audit the locked dependencies:

```bash
composer audit --locked
yarn audit --groups dependencies
```

## Continuous integration

`.github/workflows/ci.yml` follows the production toolchain and runs on pull requests
and pushes to `main`:

- PHP 8.5, Pint, and PHPUnit
- Node.js 24, Stylelint, strict TypeScript, Vitest, and a production Webpack build
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

The GitHub `production` environment is restricted to `main` and protects the
`RENDER_DEPLOY_HOOK_URL` and `RENDER_API_KEY` secrets behind required approval. Keep
Render **Auto-Deploy** set to **Off** and its health check path set to `/up`. The deploy
hook URL comes from the Render service's **Settings** page. Create the API key in
Render's **Account Settings**; the workflow uses it only to retrieve the status of the
deploy ID returned by the hook. Store both values as environment secrets, never in this
repository.

This flow allows multiple changes to accumulate on `main` before intentionally
releasing the latest validated commit. Wait for the automatic CI run to succeed before
starting a deployment. If a release needs to be reverted, use Render's rollback action
and then deploy the corrective commit through the same workflow.

Render supplies application secrets and contact configuration at runtime. `.dockerignore`
prevents local `.env` files, dependencies, generated assets, and repository metadata
from entering the Docker build context.

## Repository structure

```text
app/                         Thin Laravel layer, including anonymous analytics logging
config/app.php               Application and contact configuration
docker/                      nginx, PHP, and MySQL configuration
.github/workflows/           CI checks and the approved Render deployment workflow
resources/js/                React application, content, and browser logic
resources/js/components/     Reusable and feature components
resources/js/constants/      Routes and static domain data
resources/js/pages/          Top-level route components
resources/sass/              Global styles and SCSS Modules
resources/views/             Blade shells for the React application
routes/api.php               First-party analytics event endpoint
routes/web.php               Server-side SPA routes
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
- Run `yarn lint:styles`, `yarn typecheck`, `yarn test`, and `yarn prod` before submitting frontend changes.

The `/projects` and `/skills` Laravel routes currently have no corresponding client routes. Project and skill content is presented through the existing home and experience pages.
