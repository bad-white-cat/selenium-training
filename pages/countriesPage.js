const { By, until } = require('selenium-webdriver');
const adminPage = require('./adminPage');

class countriesPage extends liteCartPage {
  constructor (driver) {
    super(driver);
    this.countriesPath = `${this.host}admin/?app=countries&doc=countries`;
  }

  

}

module.exports = countriesPage;