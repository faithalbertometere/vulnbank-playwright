class TransferPage {
  constructor(page) {
    this.page = page;
    this.recipientInput  = page.locator('input[name*="recipient" i], input[placeholder*="account" i]');
    this.amountInput     = page.locator('input[name*="amount" i], input[placeholder*="amount" i]');
    this.submitButton    = page.locator('button[type="submit"], button:has-text("Send"), button:has-text("Transfer")');
    this.successMessage  = page.locator('.success, [class*="success"], [class*="alert-success"]');
    this.errorMessage    = page.locator('.error, .alert, [class*="error"], [class*="alert-danger"]');
    this.pinInput        = page.locator('input[name*="pin" i], input[placeholder*="pin" i]');
  }

  async goto() {
    await this.page.goto('/dashboard');
    await this.page.locator('a:has-text("Send"), button:has-text("Send")').first().click();
  }

  async transfer(recipient, amount) {
    await this.recipientInput.fill(String(recipient));
    await this.amountInput.fill(String(amount));
    await this.submitButton.click();
  }

  async isPinRequested() {
    return await this.pinInput.isVisible().catch(() => false);
  }

  async getSuccessMessage() {
    return await this.successMessage.textContent().catch(() => null);
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent().catch(() => null);
  }
}

module.exports = { TransferPage };
