# Playwright & Docker E2E Test Suite

A containerized E2E test automation framework built with **Playwright**, **TypeScript**, and **Docker** to ensure fast, reliable, and isolated end-to-end testing.

## 🛠️ Tech Stack
* **Framework**: [Playwright](https://playwright.dev/)
* **Language**: TypeScript / JavaScript
* **Containerization**: Docker & Docker Compose
* **CI/CD Ready**: Configured for seamless headless pipeline execution

## 🚀 Key Features
* **Isolated Environment**: Runs tests inside Docker containers to eliminate local setup dependencies.
* **Modern E2E Testing**: Covers functional workflows, UI validations, and API assertions.
* **Auto-Waiting & Resilience**: Utilizes Playwright's native auto-waiting mechanisms to eliminate flaky test executions.

## 🧰 Getting Started

### Prerequisites
* Node.js (v18+)
* Docker & Docker Compose

### Running Tests Locally
```bash
# 1. Install dependencies
npm install

# 2. Run Playwright tests
npx playwright test

# 3. View HTML Report
npx playwright show-report

## ⚠️ Known Issue & CI Environment Behavior
* **Anti-Bot / CAPTCHA Restrictions**: Auth & Login test suites may fail under public CI environments (e.g., GitHub Actions runners) due to the target test site's automated bot detection blocking cloud datacenters.
* **Local & Docker Execution**: These tests execute and pass successfully in local and containerized environments using residential networks.
