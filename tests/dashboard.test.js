const { test, expect } = require('@playwright/test');
const { LoginPage }     = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');
const { TransferPage }  = require('../pages/TransferPage');
const { USERS }         = require('../utils/testData');

test.describe('Dashboard & Balance Verification', () => {
// let dashboard;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.primary.username, USERS.primary.password);
    await expect(page).toHaveURL(/dashboard/);
   const dashboard = new DashboardPage(page);
  });

  test('Positive | Dashboard should display account balance', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    const balance = await dashboard.getBalance();
    expect(balance).toBeTruthy();
  });

  test.only('Positive | Virtual card number should be displayed on the dashboard', async ({ page }) => {
  const cardNumber = await page.locator('h2:has-text("Virtual Cards")').locator('..').textContent();
   // Scroll to the card section so it's visible in the screenshot/video
  // await cardSection.scrollIntoViewIfNeeded();
  // await cardSection.locator('..').screenshot({ path: 'test-results/bug-012-card-not-masked.png' });
  expect(cardNumber).toBeTruthy();
  console.log('Card details found:', cardNumber);
});

  test('BUG-012 | Virtual card details should be masked on the dashboard', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    const isMasked = await dashboard.isCardNumberMasked();
    expect(isMasked, 'Expected card number to be partially masked e.g. **** **** **** 1234').toBeTruthy();
  });

  test('BUG-013 | Transfer should require a PIN or confirmation step before completing', async ({ page }) => {
    const transferPage = new TransferPage(page);
    await transferPage.goto();
    await transferPage.transfer(USERS.secondary.username, 100);

    const pinRequested = await transferPage.isPinRequested();
    expect(pinRequested, 'Expected a PIN or confirmation step before transfer was processed').toBeTruthy();
  });

  test('BUG-017 | AI assistant should not display vulnerability-related language', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    const message = await dashboard.getAiWelcomeMessage();
    expect(message).not.toContain('vulnerable');
    expect(message).not.toContain('attacks');
    expect(message).not.toContain('Anonymous Mode');
    expect(message).not.toContain('Authenticated Mode');
  });

  test('Positive | Balance should decrease after a successful transfer', async ({ page }) => {
    const dashboard    = new DashboardPage(page);
    const transferPage = new TransferPage(page);

    await dashboard.goto();
    const balanceBefore = await dashboard.getBalance();

    await transferPage.goto();
    await transferPage.transfer(USERS.secondary.username, 100);

    await dashboard.goto();
    const balanceAfter = await dashboard.getBalance();

    expect(balanceBefore).not.toEqual(balanceAfter);
  });

});
