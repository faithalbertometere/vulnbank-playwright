class DashboardPage {
  constructor(page) {
    this.page = page;
    // this.balance        = page.locator('[class*="balance"], [id*="balance"], text=/balance/i').first();
    this.balance        = page.locator('text=$').first()
    this.transferButton = page.locator('a:has-text("Send"), button:has-text("Send"), a:has-text("Transfer")');
    this.cardNumber     = page.locator('[class*="card-number"], [class*="cardNumber"]');
    this.cardCVV        = page.locator('[class*="cvv"], [class*="CVV"]');
    this.aiChatWidget   = page.locator('[class*="chat"], [id*="chat"], button:has-text("AI")');
    this.aiChatMessage  = page.locator('[class*="chat-message"], [class*="chatMessage"]').first();
  }

  async goto() {
    await this.page.goto('/dashboard');
  }

  async getBalance() {
    return await this.balance.textContent();
  }

  // async isCardNumberMasked() {
  //   const text = await this.cardNumber.textContent();
  //   // Masked card numbers contain asterisks e.g. **** **** **** 1234
  //   return text.includes('*');
  // }

  async isCardNumberMasked() {
  const cardSection = await page.locator('h2:has-text("Virtual Cards")')
    .locator('..')
    .textContent();
  // Check if the card number contains asterisks
  return cardSection.includes('*');
}

  async openAiChat() {
    await this.aiChatWidget.click();
  }

  async getAiWelcomeMessage() {
    await this.openAiChat();
    await this.page.waitForTimeout(1500);
    return await this.aiChatMessage.textContent();
  }
}

module.exports = { DashboardPage };
