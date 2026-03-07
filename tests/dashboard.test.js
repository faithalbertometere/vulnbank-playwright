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

  test('Positive | Virtual card number should be displayed on the dashboard', async ({ page }) => {
    const cardNumber = await page.locator('h2:has-text("Virtual Cards")').locator('..').textContent()

    expect(cardNumber).toBeTruthy();
  });
 
  test('BUG-012 | Virtual card details should be masked on the dashboard', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    // Scroll to Virtual Cards section
    const cardSection = page.locator('h2:has-text("Virtual Cards")');
    await cardSection.scrollIntoViewIfNeeded();

    // Take screenshot of just the card section before asserting
    await cardSection.locator('..').screenshot({ 
      path: 'test-results/bug-012-card-not-masked.png' 
      });

    const isMasked = await dashboard.isCardNumberMasked();
    expect(isMasked, 'Expected card number to be masked but full number is visible').toBeTruthy();
  });

  test('BUG-013 | Transfer should require a PIN or confirmation step before completing', async ({ page }) => {
    const transferPage = new TransferPage(page);
    await transferPage.goto();
    await transferPage.transfer(USERS.secondary.username, 100);

    // Wait briefly for any PIN prompt to appear
    await page.waitForTimeout(2000);

    // Take screenshot as evidence — shows transfer completed with no PIN prompt
    await page.screenshot({ 
    path: 'test-results/bug-013-no-pin-required.png',
    fullPage: true  // captures the entire page not just the viewport
    });

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
