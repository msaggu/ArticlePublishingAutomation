# Article Publishing Automation Framework - Typescript + Playwright

Test automation framework for a RealWorld Article Publishing Platform (Conduit/Medium-like app), built with Playwright and TypeScript.

## Overview

This project tests complete user workflows on an article publishing platform, including user registration, authentication, article CRUD operations, profile following, and comment management. Tests follow the **Page Object Model (POM)** pattern and run sequentially with dependency chaining.

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Playwright](https://playwright.dev/) | ^1.58.2 | Browser automation & test framework |
| TypeScript | ESNext | Type-safe test authoring |
| [Allure](https://allurereport.org/) | ^3.6.0 | Test reporting |
| js-yaml | ^4.1.1 | YAML config parsing |

**Browser:** Desktop Chrome (headless by default)

## Project Structure

```
Automation_Article_PW/
├── playwright.config.ts        # Playwright config with project dependencies
├── config.yaml                 # Base URL and test user credentials
├── tsconfig.json
├── package.json
├── pages/                      # Page Object Model classes
│   ├── BasePage.ts             # Shared nav locators & methods
│   ├── LoginPage.ts
│   ├── RegisterPage.ts
│   ├── ArticleEditorPage.ts
│   ├── ArticlePage.ts
│   └── ProfilePage.ts
├── tests/                      # Test specifications
│   ├── register.spec.ts
│   ├── login.spec.ts
│   ├── article-crud.spec.ts
│   ├── follow-profile.spec.ts
│   └── comments.spec.ts
└── utils/
    ├── config.ts               # Loads and exports config.yaml
    └── testData.ts             # Test data generators & fixtures
```

## Prerequisites

1. **Node.js** (v18+)
2. **Application running** at `http://localhost:4200`
3. **Test user accounts** must exist in the application:
   - `testuser001@nal.com` / `Password123!`
   - `testuser002@nal.com` / `Password123!`

> The secondary user (`testuser002`) is required for follow/unfollow and My Feed tests.

## Installation

```bash
npm install
npx playwright install chromium
```

## Running Tests

```bash
# Run all tests (headless)
npm run test

# Run all tests (headed — visible browser)
npm run test:headed

# Run a specific project
npx playwright test --project=register
npx playwright test --project=login
npx playwright test --project=article-crud
npx playwright test --project=follow-profile
npx playwright test --project=comments
```

## Reporting

```bash
# Generate Allure report
npm run allure:generate

# Open Allure report in browser
npm run allure:open

# Open Playwright HTML report
npx playwright show-report
```

## Test Projects

| Project | File | Description |
|---------|------|-------------|
| `register` | `register.spec.ts` | Registers a new random user |
| `login` | `login.spec.ts` | Valid and invalid login scenarios |
| `article-crud` | `article-crud.spec.ts` | Create, edit, and delete an article |
| `follow-profile` | `follow-profile.spec.ts` | Follow/unfollow user; verify My Feed visibility |
| `comments` | `comments.spec.ts` | Add and delete a comment on an article |

## Test Scenarios

### Registration
- Register new user with generated random credentials

### Login
- Valid login verifies nav shows "New Article"
- Invalid login verifies error message

### Article CRUD
- Create article → verify on profile → edit title → verify edit → delete → verify count returns to 0

### Follow/Unfollow & My Feed
- Secondary user creates article
- Primary user follows secondary → verifies article in My Feed
- Primary user unfollows → verifies article removed from My Feed
- Secondary user cleans up article

### Comments
- Primary user creates article → posts comment → verifies comment → deletes comment → verifies removal → deletes article


Reports are saved to:
- `playwright-report/` — Playwright HTML report
- `allure-results/` — Raw Allure data
- `allure-report/` — Generated Allure HTML report

## Configuration

### `config.yaml`
```yaml
baseUrl: http://localhost:4200

users:
  primary:
    email: testuser001@nal.com
    password: Password123!
    username: testuser001

  secondary:
    email: testuser002@nal.com
    password: Password123!
    username: testuser002
```

Update `baseUrl` to point to your local or staging environment.

### `playwright.config.ts` highlights
- `fullyParallel: false` — sequential execution
- `trace: 'on-first-retry'` — captures traces on failure for debugging
- Reporters: HTML + Allure

## Test Data

Random data is generated per run using `utils/testData.ts` to prevent conflicts across test runs:

| Generator | Output |
|-----------|--------|
| `generateUser()` | Unique email, username, password |
| `generateArticle()` | Unique title, description, body, tag |
| `generateComment()` | Unique comment text |

