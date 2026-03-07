class TransferPage {
  constructor(page) {
    this.page = page;
    this.successMessage  = page.locator('.success, [class*="success"], [class*="alert-success"]');
    this.errorMessage    = page.locator('.error, .alert, [class*="error"], [class*="alert-danger"]');
    this.pinInput        = page.locator('input[name*="pin" i], input[placeholder*="pin" i]');
    this.recipientInput = page.locator('#recipient_account, [placeholder*="recipient" i]');
    this.amountInput    = page.locator('#amount');
    this.submitButton   = page.locator('button:has-text("Send Money")');
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
