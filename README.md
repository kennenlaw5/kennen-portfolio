# kennen.dev

Source code for [Kennen Lawrence's portfolio](https://kennen.dev). The site presents professional experience, featured projects, technical skills, contact information, and a pair of interactive browser games.

The project uses Laravel as a thin server-side shell for a React single-page application. Nearly all routing, content, presentation, and interaction live in the TypeScript frontend.

## Tech stack

- Laravel 13 and PHP 8.5
- React 18 and TypeScript in strict mode
- React Router 6
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

## Frontend commands

```bash
yarn dev          # one-time development build and TypeScript check
yarn watch        # rebuild when source files change
yarn prod         # minified production build
yarn typecheck    # strict TypeScript check without emitting assets
yarn lint:styles  # lint SCSS and SCSS Modules
```

## Tests and formatting

Run the PHP test suite:

```bash
php artisan test
```

Format PHP code with Laravel Pint:

```bash
./vendor/bin/pint
```

TypeScript is checked by `ts-loader` during every frontend build. There is currently no separate JavaScript test runner or ESLint configuration.

Audit the locked dependencies:

```bash
composer audit --locked
yarn audit --groups dependencies
```

## Continuous integration

`.github/workflows/ci.yml` follows the production toolchain and runs on pull requests and pushes to `main`:

- PHP 8.5, Pint, and PHPUnit
- Node.js 24, Stylelint, strict TypeScript, and a production Webpack build
- Composer and production JavaScript dependency audits
- A BuildKit build of the Docker `production` target without pushing an image

The Docker job is the deployment safety check: it builds `docker/php/Dockerfile` with the same target Render uses. To run that check locally:

```bash
docker build --file docker/php/Dockerfile --target production .
```

Render supplies application secrets and contact configuration at runtime. `.dockerignore` prevents local `.env` files, dependencies, generated assets, and repository metadata from entering the Docker build context.

## Repository structure

```text
app/                         Thin Laravel application layer
config/app.php               Application and contact configuration
docker/                      nginx, PHP, and MySQL configuration
.github/workflows/           CI checks, including the Render image build
resources/js/                React application, content, and browser logic
resources/js/components/     Reusable and feature components
resources/js/constants/      Routes and static domain data
resources/js/pages/          Top-level route components
resources/sass/              Global styles and SCSS Modules
resources/views/             Blade shells for the React application
routes/web.php               Server-side SPA routes
tests/                       PHPUnit tests
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
- Run `yarn lint:styles`, `yarn typecheck`, and `yarn prod` before submitting frontend changes.

The `/projects` and `/skills` Laravel routes currently have no corresponding client routes. Project and skill content is presented through the existing home and experience pages.
