const { Builder, By } = require('selenium-webdriver');
const page = require('../pages/countriesPage.js');

const chai = require("chai"),
expect = chai.expect; // preference and tested with expect
chai.use(require("chai-sorted"));

describe('Countries page:', function () {
  let driver;
  let Page;

  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();
    Page = await new page(driver);
  });

  /*Homework #9
  Сделайте сценарии, которые проверяют сортировку стран и геозон (штатов) в учебном приложении litecart.
    1) на странице http://localhost/litecart/admin/?app=countries&doc=countries
    а) проверить, что страны расположены в алфавитном порядке */
  it('countries should be in alphabet order', async function() {
    await Page.loginToAdmin();
    await Page.navigateToPage('Countries');
    const countriesElements = await Page.getCountriesList();
    const countriesList = await Promise.all(countriesElements.map(country => country.getText()));
    expect(countriesList).to.be.sorted();
  });

  /*Homework #9
    1) на странице http://localhost/litecart/admin/?app=countries&doc=countries
    б) для тех стран, у которых количество зон отлично от нуля -- открыть страницу этой страны и там проверить, что зоны расположены в алфавитном порядке
  */
  it('geo zones should be in alphabet order', async function() {
    await Page.loginToAdmin();
    await Page.navigateToPage('Countries');

    let countriesRows = await Page.getCountriesRows();

    const zoneIndexesToCheck = (await Promise.all(countriesRows.map(
      row => Page.getZoneNumber(row) //have array of elements of geozones 
      .then(zoneNumber => zoneNumber.getText())))) //have an array of numbers of geo zones in table rows
      .reduce((acc, row, index) => row > 0 ? [...acc, index] : acc, []) //have array of indexes of rows, where geozones > 0
    
    for (let i of zoneIndexesToCheck) {
      const countryToCheck = await Page.getCountryLink(countriesRows[i]);
      await countryToCheck.click();
      
      const geoZonesList = await Page.getGeoZoneList();
      const zonesList = await Promise.all(geoZonesList.map(zone => zone.getText()));
      expect(zonesList).to.be.sorted();

      await Page.navigateToPage('Countries');
      countriesRows = await Page.getCountriesRows();
    }
  });

  after(() => driver.quit());
})