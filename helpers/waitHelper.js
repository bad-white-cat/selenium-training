const { By, until } = require('selenium-webdriver');
const adminPage = require('./adminPage');

class waitHelper {
  constructor (driver) {
    this.driver = driver;
  }

  getElement(locator, timeout = 10000) {
    return driver.wait(until.elementLocated(locator), timeout);  
  }
}

module.exports = countriesPage;