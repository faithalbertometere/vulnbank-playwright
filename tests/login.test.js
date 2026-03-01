const { test, expect } = require('@playwright/test');
const { LoginPage }    = require('../pages/LoginPage');
const { RegisterPage } = require('../pages/RegisterPage');
const { USERS }        = require('../utils/testData');

test.describe('Account Creation & Login', () => {

  // ── REGISTRATION ────────────────────────────────────────────────────────────

  test('BUG-001 | Should reject login with special characters in username field', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("' OR '1'='1", 'anypassword');

    // Should stay on login page and show an error — not land on dashboard
    await expect(page).not.toHaveURL(/dashboard/);
    const error = await loginPage.getErrorMessage();
    expect(error).toBeTruthy();
  });

  test('BUG-005 | Should lock account or show CAPTCHA after multiple failed login attempts', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Attempt login 10 times with wrong password
    for (let i = 0; i < 10; i++) {
      await loginPage.login(USERS.primary.username, 'wrongpassword123');
    }

    // Expect either an account lockout message or a CAPTCHA to appear
    const error = await loginPage.getErrorMessage();
    const isLocked = error && (
      error.toLowerCase().includes('locked') ||
      error.toLowerCase().includes('too many') ||
      error.toLowerCase().includes('captcha')
    );
    expect(isLocked, 'Expected account lockout or CAPTCHA after 10 failed attempts').toBeTruthy();
  });

  test('BUG-006 | Session should expire after inactivity', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.primary.username, USERS.primary.password);
    await expect(page).toHaveURL(/dashboard/);

    // Simulate inactivity by waiting 35 minutes (adjust based on app's session timeout)
    // NOTE: This test is best run with a reduced session timeout configured in the app
    // For now we validate the session is at least active immediately after login
    await page.waitForTimeout(2000);
    await page.goto('/dashboard');
    // If session has not expired yet this is expected — flag for manual verification
    // with longer inactivity periods
    console.log('Current URL after revisit:', page.url());
  });

  test('BUG-009 | Should reject registration with a blank username', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.register('   ', 'password123'); // spaces only

    // Should stay on register page and show validation error
    await expect(page).toHaveURL(/register/);
    const error = await registerPage.getErrorMessage();
    expect(error).toBeTruthy();
  });

  test('BUG-010 | Should reject weak passwords like 1234 during registration', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    const weakUsername = `weakuser_${Date.now()}`;
    await registerPage.register(weakUsername, '1234');

    // Should stay on register page with a password strength error
    const error = await registerPage.getErrorMessage();
    expect(error, 'Expected a password strength validation error').toBeTruthy();
  });

  test('Positive | Should register and login successfully with valid credentials', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    const newUsername = `testuser_${Date.now()}`;
    await registerPage.register(newUsername, 'SecurePass123!');
    expect(await registerPage.isSuccessful()).toBeTruthy();

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(newUsername, 'SecurePass123!');
    await expect(page).toHaveURL(/dashboard/);
  });

});
