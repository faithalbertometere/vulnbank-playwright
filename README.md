# VulnBank Playwright Automation Framework

Automated test suite for VulnBank (https://vulnbank.org) covering all five modules from the QA assessment.

## Folder Structure

```
vulnbank-playwright/
├── pages/                  # Page Object Models
│   ├── LoginPage.js
│   ├── RegisterPage.js
│   ├── DashboardPage.js
│   ├── TransferPage.js
│   ├── ProfilePage.js
│   └── PasswordResetPage.js
├── tests/                  # Test files (one per module)
│   ├── login.test.js
│   ├── dashboard.test.js
│   ├── transfer.test.js
│   ├── profileUpload.test.js
│   └── passwordReset.test.js
├── utils/
│   └── testData.js         # Test credentials and constants
├── playwright.config.js
├── package.json
└── README.md
```

## Setup

1. Make sure you have Node.js installed (v16 or higher)
2. Install dependencies:
   ```bash
   npm install
   npx playwright install
   ```
3. Update `utils/testData.js` with your actual account passwords

## Running Tests

```bash
# Run all tests
npm test

# Run a specific module
npm run test:login
npm run test:dashboard
npm run test:transfer
npm run test:upload
npm run test:reset

# Run tests in headed mode (see the browser)
npm run test:headed

# View HTML report after running
npm run report
```

## Test Coverage

| Module                        | Tests | Bug IDs Covered                          |
|-------------------------------|-------|------------------------------------------|
| Account Creation & Login      | 5     | BUG-001, BUG-005, BUG-006, BUG-009, BUG-010 |
| Dashboard & Balance Verification | 5  | BUG-012, BUG-013, BUG-017               |
| Money Transfer                | 4     | BUG-003, BUG-008, BUG-011               |
| Profile Picture Upload        | 5     | BUG-007, BUG-015, BUG-016               |
| Password Reset                | 3     | BUG-002                                  |

## Notes

- Tests run on both **Chrome** and **Safari** as configured in `playwright.config.js`
- Failed tests automatically capture screenshots and videos
- Each test file maps directly to a test case
- BUG-006 (session expiry) requires manual verification with a longer wait period
