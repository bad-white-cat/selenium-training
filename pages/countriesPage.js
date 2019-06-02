const { By, until } = require('selenium-webdriver');
const adminPage = require('./adminPage');

class countriesPage extends adminPage {
  constructor (driver) {
    super(driver);
  }

  getCountriesRows() {
    return this.driver.findElements(By.xpath('//form[@name="countries_form"]//tr[contains(@class,"row")]'));
  }

  getCountriesList() {
    return this.driver.findElements(By.xpath('//form[@name="countries_form"]//tr[contains(@class,"row")]//a[not(@title)]'));
  }

}

module.exports = countriesPage;