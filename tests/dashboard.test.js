const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');
const { TransferPage } = require('../pages/TransferPage');
const { USERS } = require('../utils/testData');

test.describe('Dashboard & Balance Verification', () => {
  let dashboard;
  let transferPage;

  test.beforeEach(async ({ page }) => {
    // Login before each test
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.primary.username, USERS.primary.password);
    await expect(page).toHaveURL(/dashboard/);

    // Initialize Page Objects
    dashboard = new DashboardPage(page);
    transferPage = new TransferPage(page);
  });

  test.describe('Positive Tests', () => {
    test('Dashboard should display account balance', async () => {
      await dashboard.goto();
      const balance = await dashboard.getBalance();
      expect(balance, 'Balance should be visible on the dashboard').toBeTruthy();
    });

    test('Virtual card number should be displayed on the dashboard', async () => {
      const cardNumber = await dashboard.getVirtualCardText();
      expect(cardNumber, 'Virtual card number should be visible').toBeTruthy();
    });

    test('Balance should decrease after a successful transfer', async () => {
      await dashboard.goto();
      const balanceBefore = await dashboard.getBalance();

      await transferPage.goto();
      await transferPage.transfer(USERS.secondary.username, 100);

      await dashboard.goto();
      const balanceAfter = await dashboard.getBalance();

      expect(balanceBefore !== balanceAfter, 'Balance should decrease after transfer').toBeTruthy();
    });
  });

  test.describe('Bug Verification Tests', () => {
    test('BUG-012 | Virtual card details should be masked', async ({ page }) => {
      await dashboard.goto();

      // Scroll to Virtual Cards section and take screenshot
      const cardSection = dashboard.virtualCardSection();
      await cardSection.scrollIntoViewIfNeeded();

      await cardSection.screenshot({
        path: `test-results/bug-012-card-not-masked-${Date.now()}.png`,
      });

      const isMasked = await dashboard.isCardNumberMasked();
      expect(isMasked, 'Card number should be masked but it is visible').toBeTruthy();
    });

    test('BUG-013 | Transfer should require a PIN or confirmation', async ({ page }) => {
      await transferPage.goto();
      await transferPage.transfer(USERS.secondary.username, 100);

      // Wait for PIN prompt to appear
      const pinRequested = await transferPage.isPinRequested();
      await page.screenshot({
        path: `test-results/bug-013-no-pin-${Date.now()}.png`,
        fullPage: true,
      });

      expect(pinRequested, 'Expected a PIN or confirmation step before transfer was processed').toBeTruthy();
    });

    test('BUG-017 | AI assistant should not display vulnerability-related language', async () => {
      await dashboard.goto();
      const message = await dashboard.getAiWelcomeMessage();

      expect(message).not.toContain('vulnerable');
      expect(message).not.toContain('attacks');
      expect(message).not.toContain('Anonymous Mode');
      expect(message).not.toContain('Authenticated Mode');
    });
  });
});