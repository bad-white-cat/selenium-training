const { By, until } = require('selenium-webdriver');
const params = require('../params.js');

class adminPage {
  constructor (driver) {
    this.driver = driver;
  }

  getUserNameField() {
    return this.driver.wait(until.elementLocated(By.name('username')), params.timeout);
  }

  getUserPasswordField() {
    return this.driver.wait(until.elementLocated(By.name('password')), params.timeout);
  }

  getSubmitButton() {
    return this.driver.wait(until.elementLocated(By.name('login')), params.timeout);
  }

  getHeading() {
    return this.driver.wait(until.elementLocated(By.css(`h1`)), params.timeout);
  }

  async navigateToShop() {
    const toShop = await this.driver.wait(until.elementLocated(By.css(`div.header a[title*="Catalog"]`)), params.timeout);
    await toShop.click();
    await this.driver.wait(until.elementLocated(By.id('site-menu')), 7000);
  }

  async navigateToPage(page) {
    const goal = await this.driver.wait(until.elementLocated(By.xpath(`//span[contains (text(),'${page}')]`)), params.timeout);
    await goal.click();
  }

  getSidebarElements() {
    return this.driver.findElements(By.css('#app- > a span.name'));
  }

  getSidebarSubElements() {
    return this.driver.findElements(By.css('ul.docs span.name'));
  }

  async loginToAdmin (username = params.login, password = params.password) {
    await this.driver.get(`${params.host}${params.urls.login}`);
    await this.getUserNameField().sendKeys(username);
    await this.getUserPasswordField().sendKeys(password);
    await this.getSubmitButton().click();
    await this.driver.wait(until.elementLocated(By.id('sidebar')), 7000);
  }
}

module.exports = adminPage;
