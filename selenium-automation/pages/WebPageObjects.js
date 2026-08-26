// ============================================================
// TrustLink Selenium — Web Page Objects
// ============================================================

const { By } = require('selenium-webdriver');
const BaseWebPage = require('./BaseWebPage');

class WebNavbarPage extends BaseWebPage {
  get navHome() { return By.css('[data-testid="nav-home"]'); }
  get navVault() { return By.css('[data-testid="nav-vault"]'); }
  get navActivity() { return By.css('[data-testid="nav-activity"]'); }
  get navProfile() { return By.css('[data-testid="nav-profile"]'); }
  get themeToggleBtn() { return By.css('[data-testid="theme-toggle"]'); }

  async toggleTheme() {
    await this.click(this.themeToggleBtn);
  }
}

class WebLoginPage extends BaseWebPage {
  get emailInput() { return By.css('input[type="email"]'); }
  get passwordInput() { return By.css('input[type="password"]'); }
  get submitButton() { return By.css('button[type="submit"]'); }
  get googleButton() { return By.xpath("//button[contains(text(),'Google')]"); }
  get demoSignInBtn() { return By.css('[data-testid="demo-signin"]'); }
  get errorBanner() { return By.css('[data-testid="error-banner"]'); }

  async login(email, password) {
    await this.type(this.emailInput, email);
    await this.type(this.passwordInput, password);
    await this.click(this.submitButton);
  }

  async loginWithDemo() {
    await this.click(this.demoSignInBtn);
  }
}

class WebRegisterPage extends BaseWebPage {
  get emailInput() { return By.css('input[placeholder*="email"]'); }
  get passwordInput() { return By.css('input[placeholder*="password"]'); }
  get confirmPasswordInput() { return By.css('input[placeholder*="confirm"]'); }
  get submitButton() { return By.css('button[type="submit"]'); }
}

class WebVaultPage extends BaseWebPage {
  get searchInput() { return By.css('input[placeholder*="Search"]'); }
  get uploadButton() { return By.xpath("//button[contains(.,'Upload')]"); }
  get newFolderButton() { return By.xpath("//button[contains(.,'New Folder')]"); }
  get documentList() { return By.css('[data-testid="document-grid"]'); }
  get folderModalInput() { return By.css('[data-testid="folder-name-input"]'); }
  get folderModalSubmit() { return By.css('[data-testid="create-folder-btn"]'); }

  async search(query) {
    await this.type(this.searchInput, query);
  }

  async createFolder(name) {
    await this.click(this.newFolderButton);
    await this.type(this.folderModalInput, name);
    await this.click(this.folderModalSubmit);
  }
}

class WebDocumentDetailPage extends BaseWebPage {
  get sha256Fingerprint() { return By.css('[data-testid="sha256-hash"]'); }
  get anchorBlockchainButton() { return By.xpath("//button[contains(.,'Anchor to Sepolia')]"); }
  get verifyIntegrityButton() { return By.xpath("//button[contains(.,'Verify Cryptographic Integrity')]"); }
  get downloadButton() { return By.xpath("//button[contains(.,'Download')]"); }
  get copyHashButton() { return By.css('[data-testid="copy-hash-btn"]'); }
  get closeDetailButton() { return By.css('[data-testid="close-detail-btn"]'); }

  async verifyDocument() {
    await this.click(this.verifyIntegrityButton);
  }

  async anchorDocument() {
    await this.click(this.anchorBlockchainButton);
  }
}

class WebSharePage extends BaseWebPage {
  get recipientInput() { return By.css('input[placeholder*="email"]'); }
  get generateShareLinkBtn() { return By.xpath("//button[contains(.,'Share')]"); }
  get copyLinkBtn() { return By.xpath("//button[contains(.,'Copy Link')]"); }
  get permissionToggle() { return By.css('[data-testid="permission-toggle"]'); }
}

class WebActivityPage extends BaseWebPage {
  get eventTimeline() { return By.css('[data-testid="audit-feed"]'); }
  get blockchainFilter() { return By.xpath("//button[contains(.,'Blockchain')]"); }
  get integrityFilter() { return By.xpath("//button[contains(.,'Integrity')]"); }
  get sharingFilter() { return By.xpath("//button[contains(.,'Sharing')]"); }
}

module.exports = {
  WebNavbarPage,
  WebLoginPage,
  WebRegisterPage,
  WebVaultPage,
  WebDocumentDetailPage,
  WebSharePage,
  WebActivityPage,
};
