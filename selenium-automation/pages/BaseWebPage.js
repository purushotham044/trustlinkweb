// ============================================================
// TrustLink Selenium — Base Web Page Object
// ============================================================

const { By } = require('selenium-webdriver');
const logger = require('../utils/logger');

class BaseWebPage {
  constructor(driver) {
    this.driver = driver;
  }

  async navigateTo(url) {
    logger.info(`Navigating to URL: ${url}`);
    await this.driver.get(url);
  }

  async find(locator, timeout = 10000) {
    try {
      return await this.driver.findElement(locator);
    } catch (err) {
      logger.warn(`Web element not found: ${locator}`);
      return await this.driver.findElement(locator);
    }
  }

  async click(locator) {
    const el = await this.find(locator);
    await el.click();
  }

  async type(locator, text) {
    const el = await this.find(locator);
    await el.sendKeys(text);
  }

  async getText(locator) {
    const el = await this.find(locator);
    return await el.getText();
  }

  async isVisible(locator) {
    try {
      const el = await this.find(locator);
      return await el.isDisplayed();
    } catch (e) {
      return false;
    }
  }
}

module.exports = BaseWebPage;
