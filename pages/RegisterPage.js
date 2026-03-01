class RegisterPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"], input[placeholder*="username" i]');
    this.passwordInput = page.locator('input[name="password"], input[type="password"]');
    this.registerButton = page.locator('button[type="submit"], button:has-text("Register"), input[type="submit"]');
    this.errorMessage   = page.locator('.error, .alert, [class*="error"], [class*="alert"]');
    this.successMessage = page.locator('.success, [class*="success"]');
  }

  async goto() {
    await this.page.goto('/register');
  }

  async register(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.registerButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  async isSuccessful() {
    // After successful registration, expect redirect away from /register
    return !this.page.url().includes('/register');
  }
}

module.exports = { RegisterPage };
