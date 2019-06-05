const { Builder } = require('selenium-webdriver');
const page = require('../pages/geozonesPage.js');

const chai = require("chai"),
expect = chai.expect; // preference and tested with expect
chai.use(require("chai-sorted"));

describe('Geozones page:', function () {
  let driver;
  let Page;

  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();
    Page = await new page(driver);
  });

  /*Homework #9
    2) на странице http://localhost/litecart/admin/?app=geo_zones&doc=geo_zones
    зайти в каждую из стран и проверить, что зоны расположены в алфавитном порядке
 */
  it('geozones should be in alphabet order', async function() {
    await Page.loginToAdmin();
    await Page.navigateToPage('Geo Zones');
    let countriesLinks = await Page.getCountriesLinks();
    for (let i = 0; i < countriesLinks.length; i += 1) {
        await countriesLinks[i].click();
        const zoneElements = await Page.getGeoZonesSelected();
        const zones = await Promise.all(zoneElements.map(zone => zone.getText()));
        expect(zones).to.be.sorted();
        await Page.navigateToPage('Geo Zones');
        countriesLinks = await Page.getCountriesLinks();
    }
  });

  after(() => driver.quit());
})