# Playwright E2E & API Test Suite

[![Playwright Tests](https://github.com/micrzy/practicesoftwaretesting/actions/workflows/playwright.yml/badge.svg?branch=main)](https://github.com/micrzy/practicesoftwaretesting/actions/workflows/playwright.yml)

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
