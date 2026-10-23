# Playwright E2E & API Test Suite

![Playwright Tests](https://github.com/micrzy/practicesoftwaretesting/actions/workflows/playwright.yml/badge.svg)

E2E and API test automation for the [Practice Software Testing](https://practicesoftwaretesting.com) Toolshop app, built with **Playwright**, **TypeScript**, and **Docker**.

## 🛠️ Tech Stack
* **Framework**: Playwright (UI + API testing)
* **Language**: TypeScript
* **Containerization**: Docker & Docker Compose
* **CI/CD**: GitHub Actions

## 🚀 Key Features
* **Page Object Model** with reusable components and custom fixtures
* **UI + API + mocking**: UI flows, REST API tests, and network interception/mocking
* **Fast authentication**: log in once via API and reuse the session with `storageState`
* **Multi-environment config**: switch target environment with one variable (`ENV`)
* **Tagged test suites**: `@sanity`, `@smoke`, `@regression` for different pipeline stages
* **Performance testing with k6**: load and stress scenarios with p95 and error-rate thresholds, runnable on demand in GitHub Actions
* **API contract testing**: Zod schema validation and negative tests (404, 422)
* **API-driven test setup**: create test data via API (e.g. cart) instead of clicking through the UI
* **AI-assisted test automation**: a Claude Code agent picks up Jira tasks, checks existing coverage, inspects the live site with Playwright MCP, writes tests using the existing page objects and fixtures, and updates Jira, with guardrails against weakening assertions

## 🤖 Jira QA Agent

Say `pick up SCRUM-X` in Claude Code to automate a Jira task:

1. Read the task's steps, acceptance criteria and labels from Jira (`utils/jira.ts`)
2. Check coverage by page or feature: extend an existing spec when one already
   tests that area, instead of creating duplicates
3. Confirm real selectors on the live site with Playwright MCP
4. Write or extend a test using the existing page objects and fixtures
5. Tag it from the Jira labels (e.g. `smoke` → `@smoke @regression`) plus the Jira key
6. Run it 3 times; if shared code changed, also re-run only the specs that call the changed functions
7. On success, link the test in Jira and move the task to Done

**Guardrails** (`CLAUDE.md`): never remove or weaken assertions, no hard waits,
assert only the acceptance criteria, stop after 3 failed fix attempts and
report in Jira instead of moving to Done.

Tests are tagged with their Jira key (e.g. `@SCRUM-2`) for traceability:
`npx playwright test --grep @SCRUM-2`.

## 🌍 Environments
| ENV | Target | Use |
|---|---|---|
| `local` | Self-hosted app in Docker (`ci/`) | CI default, stable and isolated |
| `staging` | practicesoftwaretesting.com | Real public site |
| `dev` | with-bugs.practicesoftwaretesting.com | Version with intentional bugs |

## 🔄 CI Pipeline
| Trigger | Environment | Suite |
|---|---|---|
| Pull request to `main` | local | `@sanity` |
| Push to `main` | local | `@smoke` |
| Manual (workflow_dispatch) | choose | choose |

## 📁 Project Structure

```
.
├── tests/
│   ├── api/                 # API tests: contract (Zod), negative 404/422, auth
│   │   └── schemas/         # Zod schemas for products, brands, categories, errors
│   ├── ui/                  # UI end-to-end tests
│   │   ├── auth.setup.ts    # Logs in via API once, saves the session for *.logged-in.spec.ts
│   │   └── fixtures/        # Files used by tests (upload file, expected invoice PDF)
│   └── mock/                # Network mocking with page.route (500 errors, out of stock)
├── page-objects/            # Page Object Model + POManager + custom fixtures (fixtures.ts)
├── components/              # Shared UI components (nav bar, filter sidebar)
├── utils/
│   ├── api-helpers.ts       # API-driven test data setup (e.g. create a cart)
│   ├── env.ts               # Environment variables (API_URL)
│   └── jira.ts              # Jira CLI used by the QA agent
├── test-data/               # JSON for data-driven tests (search, i18n labels)
├── perf/                    # k6 load and stress scripts + RESULTS.md
├── ci/                      # Self-hosted app under test (Docker) + start script
├── .github/workflows/       # Playwright CI and k6 performance workflows
├── .claude/                 # Claude Code hooks (block access to .env)
├── CLAUDE.md                # Jira QA agent workflow and guardrails
├── playwright.config.ts     # Projects: setup, guest, logged-in
├── Dockerfile               # Image CI runs the tests in
└── .env.<env>               # BASE_URL / API_URL per environment (local, dev, staging)
```

**Naming conventions**: `*.logged-in.spec.ts` runs authenticated, everything else runs as a guest.
Suites are selected by tags in the `describe` title: `@sanity`, `@smoke`, `@regression`.

## 🧰 Getting Started

### Prerequisites
* Node.js (v18+)
* Docker & Docker Compose

### Run tests
```bash
npm install

# against the public site
ENV=staging npx playwright test

# against a local self-hosted app
bash ci/start-sut.sh
ENV=local npx playwright test

# run a single suite
ENV=staging npx playwright test --grep @smoke

# view the HTML report
npx playwright show-report
```

Credentials are read from a local `.env` file (not committed) or from GitHub Secrets in CI.
