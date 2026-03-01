class PasswordResetPage {
  constructor(page) {
    this.page = page;
    this.forgotPasswordLink = page.locator('a:has-text("Forgot"), a:has-text("Reset")');
    this.emailInput         = page.locator('input[type="email"], input[name*="email" i]');
    this.usernameInput      = page.locator('input[name*="username" i]');
    this.submitButton       = page.locator('button[type="submit"], button:has-text("Reset"), button:has-text("Submit")');
    this.successMessage     = page.locator('.success, [class*="success"]');
    this.errorMessage       = page.locator('.error, .alert, [class*="error"]');
  }

  async goto() {
    await this.page.goto('/login');
    await this.forgotPasswordLink.click();
  }

  async requestReset(identifier) {
    // Try email first, fall back to username field
    const emailVisible = await this.emailInput.isVisible().catch(() => false);
    if (emailVisible) {
      await this.emailInput.fill(identifier);
    } else {
      await this.usernameInput.fill(identifier);
    }
    await this.submitButton.click();
  }

  async isEmailFieldPresent() {
    return await this.emailInput.isVisible().catch(() => false);
  }

  async getSuccessMessage() {
    return await this.successMessage.textContent().catch(() => null);
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent().catch(() => null);
  }
}

module.exports = { PasswordResetPage };
