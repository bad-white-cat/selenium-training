const { By, until } = require('selenium-webdriver');
const adminPage = require('./adminPage');

class shopPage extends adminPage {
  constructor (driver) {
    super(driver);
  }

  getAllItems() {
    return this.driver.findElements(By.css('li.product'));
  }
}

module.exports = shopPage;