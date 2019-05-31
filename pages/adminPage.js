const { By, until } = require('selenium-webdriver');


class adminPage {
  constructor (driver) {
    this.driver = driver;
    this.host = 'http://localhost/litecart/'
    this.timeout = 10000
  }

  getUserNameField() {
    return this.driver.findElement(By.name('username'));
  }

  getUserPasswordField() {
    return this.driver.findElement(By.name('password'));
  }

  getSubmitButton() {
    return this.driver.findElement(By.name('login'));
  }

  async navigateToPage(page) {
    const goal = await driver.wait(until.elementLocated(By.xpath(`//span[contains (text(),'${page}')]`)), this.timeout);
    await goal.click();
  }

  async login (username = 'Admin', password = '123') {
    await this.driver.get(this.loginPath);
    await this.getUserNameField().sendKeys(username);
    await this.getUserPasswordField().sendKeys(password);
    await this.getSubmitButton().click();
    await this.driver.wait(until.elementLocated(By.id('sidebar')), 7000);
  }
}

module.exports = adminPage;
