const path = require('path');

class ProfilePage {
  constructor(page) {
    this.page = page;
    this.fileInput      = page.locator('input[type="file"]');
    this.uploadButton   = page.locator('button:has-text("Upload"), input[type="submit"]');
    this.urlInput       = page.locator('input[name*="url" i], input[placeholder*="url" i]');
    this.urlSubmit      = page.locator('button:has-text("Import"), button:has-text("Fetch"), button:has-text("Submit")');
    this.successMessage = page.locator('.success, [class*="success"]');
    this.errorMessage   = page.locator('.error, .alert, [class*="error"]');
  }

  async goto() {
    await this.page.goto('/profile');
  }

  async uploadFile(filePath) {
    await this.fileInput.setInputFiles(filePath);
    await this.uploadButton.click();
  }

  async importFromUrl(url) {
    await this.urlInput.fill(url);
    await this.urlSubmit.click();
  }

  async getSuccessMessage() {
    return await this.successMessage.textContent().catch(() => null);
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent().catch(() => null);
  }
}

module.exports = { ProfilePage };
