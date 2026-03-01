const { test, expect } = require('@playwright/test');
const { LoginPage }   = require('../pages/LoginPage');
const { ProfilePage } = require('../pages/ProfilePage');
const { USERS, VALID_IMAGE_URL, NON_IMAGE_URL, INVALID_URL } = require('../utils/testData');
const path = require('path');
const fs   = require('fs');

test.describe('Profile Picture Upload', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.primary.username, USERS.primary.password);
    await expect(page).toHaveURL(/dashboard/);
  });

  test('Positive | Should upload a valid image file successfully', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await profilePage.goto();

    // Create a small valid PNG test file on the fly
    const testImagePath = path.join(__dirname, 'test-image.png');
    if (!fs.existsSync(testImagePath)) {
      // Minimal 1x1 PNG in binary (valid PNG header)
      const minimalPng = Buffer.from(
        '89504e470d0a1a0a0000000d49484452000000010000000108020000009001' +
        '2e0000000c4944415408d7636000000000020001e221bc330000000049454e44ae426082',
        'hex'
      );
      fs.writeFileSync(testImagePath, minimalPng);
    }

    await profilePage.uploadFile(testImagePath);
    const success = await profilePage.getSuccessMessage();
    expect(success, 'Expected a success message after valid image upload').toBeTruthy();
  });

  test('BUG-007 | Should accept a very large image file without crashing', async ({ page }) => {
    // This test verifies there is a file size limit enforced
    // Uses the picsum URL import instead of file upload for convenience
    const profilePage = new ProfilePage(page);
    await profilePage.goto();

    // Import a large image from URL as a proxy for large file upload
    await profilePage.importFromUrl('https://picsum.photos/5000/5000');
    await page.waitForTimeout(5000);

    const error = await profilePage.getErrorMessage();
    expect(error, 'Expected a file size limit error for very large image').toBeTruthy();
    expect(error).toMatch(/too large|size|limit/i);
  });

  test('Positive | Should import a valid image from a URL successfully', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await profilePage.goto();
    await profilePage.importFromUrl(VALID_IMAGE_URL);
    await page.waitForTimeout(3000);

    const success = await profilePage.getSuccessMessage();
    expect(success, 'Expected success after importing a valid image URL').toBeTruthy();
  });

  test('BUG-015 | Should reject a non-image URL when importing profile picture', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await profilePage.goto();
    await profilePage.importFromUrl(NON_IMAGE_URL);
    await page.waitForTimeout(3000);

    const error = await profilePage.getErrorMessage();
    expect(error, 'Expected an error when importing a non-image URL').toBeTruthy();
    // Error should be user-friendly, not a raw system message
    expect(error).not.toMatch(/urllib|traceback|exception|object at 0x/i);
  });

  test('BUG-016 | Should show a friendly error for invalid URL input, not a raw system message', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await profilePage.goto();
    await profilePage.importFromUrl(INVALID_URL);
    await page.waitForTimeout(2000);

    const error = await profilePage.getErrorMessage();
    expect(error, 'Expected an error message for invalid URL').toBeTruthy();
    // Should NOT contain raw Python/server error details
    expect(error).not.toMatch(/urllib|No scheme supplied|HTTPConnection|object at 0x/i);
  });

});
