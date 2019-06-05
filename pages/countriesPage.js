const { By, until } = require('selenium-webdriver');
const adminPage = require('./adminPage');

class countriesPage extends adminPage {
  constructor (driver) {
    super(driver);
  }

  getCountriesRows() {
    return this.driver.findElements(By.css('form[name="countries_form"] tr.row'));
  }

  getCountriesList() {
    return this.driver.findElements(By.xpath('//form[@name="countries_form"]//tr[contains(@class,"row")]//a[not(@title)]'));
  }

  getZoneNumber(el = this.driver) {
    return el.findElement(By.xpath('.//td[6]'));
  }

  getCountryLink(el = this.driver) {
    return el.findElement(By.xpath('.//a[contains(@href,"doc=edit_country") and @title="Edit"]'))
  }

  async getGeoZoneList() {
    const zones = await this.driver.findElements(By.xpath('//table[@id="table-zones"]//tr[not(@class="header")]/td[3]'));
    zones.pop();
    return zones;
  }
}

module.exports = countriesPage;