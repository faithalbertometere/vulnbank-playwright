class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"], input[placeholder*="username" i]');
    this.passwordInput = page.locator('input[name="password"], input[type="password"]');
    this.loginButton   = page.locator('button[type="submit"], button:has-text("Login"), input[type="submit"]');
    this.errorMessage  = page.locator('.error, .alert, [class*="error"], [class*="alert"]');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }
}

module.exports = { LoginPage };
