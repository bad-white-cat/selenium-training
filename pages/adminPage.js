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

  async navigateToPage(page) {
    const goal = await this.driver.wait(until.elementLocated(By.xpath(`//span[contains (text(),'${page}')]`)), params.timeout);
    await goal.click();
  }

  async getSidebarElements() {
    return this.driver.findElements(By.css('#box-apps-menu-wrapper span.name'));
  }

  checkSidebarSubElements() {
    return this.driver.findElements(by.css())
  }

  async login (username = params.login, password = params.password) {
    await this.driver.get(`${params.host}${params.urls.login}`);
    await this.getUserNameField().sendKeys(username);
    await this.getUserPasswordField().sendKeys(password);
    await this.getSubmitButton().click();
    await this.driver.wait(until.elementLocated(By.id('sidebar')), 7000);
  }
}

module.exports = adminPage;
