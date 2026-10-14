# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A Playwright + TypeScript test suite (UI, API, network mocking) plus k6 performance scripts for the third-party [Practice Software Testing](https://practicesoftwaretesting.com) "Toolshop" app. No application code lives here. The app under test is either a public site or the self-hosted Docker stack in `ci/`.

## Commands

There are no npm scripts. Run everything through `npx playwright` / `k6` directly.

```bash
npm install

# Target environment is chosen by ENV (local | dev | staging); default is "dev"
ENV=staging npx playwright test
ENV=staging npx playwright test --grep @smoke          # tagged suite: @sanity, @smoke, @regression
ENV=staging npx playwright test tests/api/brands.spec.ts   # single file
ENV=staging npx playwright test -g "should get brands list" # single test by title
ENV=staging npx playwright test --project=logged-in        # one project (setup runs automatically as a dependency)
npx playwright show-report

# Self-hosted app (UI on :4200, API on :8091): pulls images, seeds the DB, generates invoice PDFs, waits until ready
bash ci/start-sut.sh
ENV=local npx playwright test

# Tests in the same Docker image CI uses
docker compose up --build            # honours ENV, defaults to dev

# k6 (expects the local SUT on :8091)
k6 run perf/load.js                  # also perf/stress.js, perf/products.js
```

In PowerShell, set the variable first: `$env:ENV="staging"; npx playwright test`.

## Configuration and environments

- `playwright.config.ts` loads `.env.<ENV>` (committed; holds `BASE_URL` and `API_URL`) and then `.env` (gitignored; holds `TEST_EMAIL` and `TEST_PASSWORD`). In CI the credentials come from GitHub Secrets.
- `local` → the Docker SUT, `staging` → the real public site, `dev` → `with-bugs.practicesoftwaretesting.com` (deliberately buggy, so failures there may be expected).
- `utils/env.ts` exports `API_URL` and throws at import time if it is missing. API calls use `${API_URL}/...` explicitly. Page navigation uses relative paths against `baseURL`.

## Architecture

**Playwright projects** (`playwright.config.ts`) are split by authentication state through file naming:
- `setup` runs `*.setup.ts`. `tests/ui/auth.setup.ts` logs in via the API, puts the token in `localStorage["auth-token"]`, and saves `./.auth/user.json`.
- `logged-in` runs only `*.logged-in.spec.ts`, depends on `setup`, and reuses that `storageState`.
- `guest` runs everything else.
To make a test start authenticated, name it `*.logged-in.spec.ts`. Don't log in through the UI.

**Fixtures and page objects.** Specs import `test`/`expect` from `page-objects/fixtures.ts`, not from `@playwright/test`. That file adds:
- `poManager`, a `POManager` that aggregates every page object (`page-objects/*`) and component (`components/*`). Register new page objects there.
- `apiToken`, a bearer token obtained by logging in through the API.

**API-driven setup.** `utils/api-helpers.ts` creates state through the API instead of the UI. For example, `createCartWithProduct` creates a cart, then the UI test injects it via `page.addInitScript` into `sessionStorage` (`cart_id`, `cart_quantity`). Product lookup uses an HTTP `QUERY` method on `/products`.

**API contract tests** (`tests/api/`) validate response bodies with Zod schemas in `tests/api/schemas/`. The pattern is `expect(result.success, result.error && z.prettifyError(result.error)).toBe(true)`. They also include negative cases (404/422) checked against `error.schema.ts`.

**Mocking** (`tests/mock/`) uses `page.route`. It either fulfils a synthetic response or fetches the real one and patches its JSON.

**Data-driven tests** loop over JSON in `test-data/` to generate one test per entry.

**Selectors**: the app exposes `data-test` attributes, and these are the preferred locators (`[data-test="..."]`).

## Tags and CI

Tags go in the `test.describe` title (e.g. `"Get Brands info from API @smoke @regression"`). A describe without a tag is not run by any CI suite.

`.github/workflows/playwright.yml`:
- Always builds the Docker image from `Dockerfile` and runs the tests inside it with `--network host`.
- When `ENV=local`, starts the SUT on the runner first.
- Picks the suite by trigger: PR → `@sanity`, push to main → `@smoke`, manual dispatch → the chosen env and suite.
- CI sets `retries: 2`, `workers: 2`, and `forbidOnly`.

`.github/workflows/performance.yml` is manual-only. It runs `perf/<scenario>.js` (load or stress) against the SUT and uploads the k6 HTML dashboard. Results are written up in `perf/RESULTS.md`.

## Gotchas

- The Playwright version is pinned in two places, `package.json` and the `Dockerfile` base image (`mcr.microsoft.com/playwright:v1.62.0-noble`). Update both together.
- The invoice download test depends on seeded data (invoice `INV-20260000024`). It writes into the tracked `tests/ui/fixtures/` directory.
- k6 scripts hard-code `http://localhost:8091`.


## Jira QA agent workflow

When I say "pick up SCRUM-X", run this workflow for that task.

Jira CLI (`utils/jira.ts`, project key `SCRUM`):
```bash
npx tsx utils/jira.ts get SCRUM-X
npx tsx utils/jira.ts move SCRUM-X "In Progress"
npx tsx utils/jira.ts append SCRUM-X "<text>"
```

Steps:
1. Fetch the task and read its test steps and acceptance criteria.
2. Move the task to "In Progress".
3. Check existing coverage in `tests/` first. Coverage is by page or feature,not only by assertions:
   - A spec already tests the same page or feature: extend that spec (add assertions, or add a test to its describe).
   - No spec for that page or feature: write a new spec.
4. Inspect https://practicesoftwaretesting.com with Playwright MCP to confirm real selectors before writing code.
5. Write the test following the Architecture section above: import from `page-objects/fixtures.ts`, reuse or add page objects via `POManager`, use API-driven setup where possible, and use `${API_URL}`.
6. Wrap each Jira step in `test.step()`. Every acceptance criterion must be an `expect()` assertion.
7. Tag:  
   - New spec: tag the describe with `@SCRUM-X` and the suite tags below.
   - Test added to an existing spec: put `@SCRUM-X` in the test title, not on the describe. Add a suite tag to the test only if the describe doesn't already have it.
   - Suite tags from the Jira labels:
     - `sanity` → `@sanity @regression`
     - `smoke` → `@smoke @regression`
     - `regression` or `e2e` → `@regression`
     - No label → `@regression`, and mention in the Jira note that no label was set
8. Run it with `ENV=staging npx playwright test <file> --repeat-each=3`.
9. If it passes: append "✅ Automation test: <file path>" to the task description, then move the task to "Done".

Test rules:
- Prefer `data-test` locators; otherwise `getByRole`, `getByLabel`, `getByPlaceholder`, `getByText`. Never XPath.
- Never hardcode credentials; read them from `process.env`.
- Never use `page.waitForTimeout()`. Wait for a specific response, URL or element state.
- For dropdown menus, hover first, then click the option.

Guardrails:
- Never remove, weaken, or skip an assertion (`test.skip`, `test.fixme`) to make a test pass.
- If the test still fails after 3 fix attempts: keep the task "In Progress", append the error and your analysis to the description, and stop. Don't move it to "Done".
- Never overwrite the Jira description. Only append.
- Don't modify unrelated tests, config, or CI files.
- Keep tests focused: assert only what the Jira acceptance criteria require.Don't add extra checks beyond the task.
- Move reusable logic (e.g. page error tracking) into fixtures or helpers,not inline in the test.