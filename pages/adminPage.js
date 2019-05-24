const { By, until } = require('selenium-webdriver');
const liteCartPage = require('./liteCartPage');

class adminPage extends liteCartPage {
  constructor (driver) {
    super(driver);
    this.loginPath = `${this.host}admin/login.php`;
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

  async login (username = 'Admin', password = '123') {
    await this.driver.get(this.loginPath);
    await this.getUserNameField().sendKeys(username);
    await this.getUserPasswordField().sendKeys(password);
    await this.getSubmitButton().click();
    await this.driver.wait(until.elementLocated(By.id('sidebar')), 7000);
  }
}

module.exports = adminPage;
