const { By } = require('selenium-webdriver');
const adminPage = require('./adminPage');

class geozonesPage extends adminPage {
  constructor (driver) {
    super(driver);
  }

  getCountriesLinks() {
    return this.driver.findElements(By.css('form[name="geo_zones_form"] tr.row a[title="Edit"]'));
  }

  getGeoZonesSelected() {
    return this.driver.findElements(By.css('table#table-zones select:not([class="select2-hidden-accessible"]) option:checked'));
  }
}

module.exports = geozonesPage;