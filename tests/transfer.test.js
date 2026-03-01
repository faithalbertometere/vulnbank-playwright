const { test, expect } = require('@playwright/test');
const { LoginPage }    = require('../pages/LoginPage');
const { TransferPage } = require('../pages/TransferPage');
const { DashboardPage } = require('../pages/DashboardPage');
const { USERS }        = require('../utils/testData');

test.describe('Money Transfer', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.primary.username, USERS.primary.password);
    await expect(page).toHaveURL(/dashboard/);
  });

  test('Positive | Should complete a valid transfer successfully', async ({ page }) => {
    const transferPage = new TransferPage(page);
    await transferPage.goto();
    await transferPage.transfer(USERS.secondary.username, 100);

    const success = await transferPage.getSuccessMessage();
    expect(success, 'Expected a success message after valid transfer').toBeTruthy();
  });

  test('BUG-003 | Should reject a transfer with a negative amount', async ({ page }) => {
    const dashboard    = new DashboardPage(page);
    const transferPage = new TransferPage(page);

    await dashboard.goto();
    const balanceBefore = await dashboard.getBalance();

    await transferPage.goto();
    await transferPage.transfer(USERS.secondary.username, -5000);

    // Should show a validation error and balance should be unchanged
    const error = await transferPage.getErrorMessage();
    expect(error, 'Expected an error message for negative transfer amount').toBeTruthy();

    await dashboard.goto();
    const balanceAfter = await dashboard.getBalance();
    expect(balanceBefore).toEqual(balanceAfter);
  });

  test('BUG-008 | Should reject a transfer with an amount of zero', async ({ page }) => {
    const transferPage = new TransferPage(page);
    await transferPage.goto();
    await transferPage.transfer(USERS.secondary.username, 0);

    const error = await transferPage.getErrorMessage();
    expect(error, 'Expected a validation error for zero transfer amount').toBeTruthy();
  });

  test('BUG-011 | Should reject a transfer to a non-existent account number', async ({ page }) => {
    const transferPage = new TransferPage(page);
    await transferPage.goto();
    await transferPage.transfer('0000000000', 500);

    const error = await transferPage.getErrorMessage();
    expect(error, 'Expected an error message for non-existent recipient account').toBeTruthy();
  });

});
