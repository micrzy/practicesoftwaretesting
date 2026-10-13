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

1. Read the task's steps and acceptance criteria from Jira (`utils/jira.ts`)
2. Check whether existing tests already cover it
3. Confirm real selectors on the live site with Playwright MCP
4. Write or extend a test using the existing page objects and fixtures
5. Run it 3 times; on success, link the test in Jira and move the task to Done

**Guardrails** (`CLAUDE.md`): never remove or weaken assertions, no hard waits,
stop after 3 failed fix attempts and report in Jira instead of moving to Done.

Tests are tagged with their Jira key (e.g. `@SCRUM-2`) for traceability.

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
