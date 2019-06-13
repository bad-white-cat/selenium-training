const { Builder } = require('selenium-webdriver');
const page = require('../pages/countriesPage.js');
const { waitForNewWindowOpen } = require('../helpers/controlHelper.js');

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
  it('geozones should be in alphabet order if there are ones', async function() {
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

  /* Homework #14
    1) зайти в админку
    2) открыть пункт меню Countries (или страницу http://localhost/litecart/admin/?app=countries&doc=countries)
    3) открыть на редактирование какую-нибудь страну или начать создание новой
    4) возле некоторых полей есть ссылки с иконкой в виде квадратика со стрелкой -- они ведут на внешние страницы и открываются в новом окне, именно это и нужно проверить.

    Конечно, можно просто убедиться в том, что у ссылки есть атрибут target="_blank". Но в этом упражнении требуется именно кликнуть по ссылке, чтобы она открылась в новом окне, потом переключиться в новое окно, закрыть его, вернуться обратно, и повторить эти действия для всех таких ссылок.

    Не забудьте, что новое окно открывается не мгновенно, поэтому требуется ожидание открытия окна. */
  it('should open link in new tab', async function() {
    await Page.loginToAdmin();
    await Page.navigateToPage('Countries');
    await Page.getAddNewCountryButton().click();
    const countryPage = await driver.getWindowHandle();
    let windows = await driver.getAllWindowHandles();
    const links = await Page.getExternalLinks();
    for (let link of links) {
      await link.click();
      const newTab = await waitForNewWindowOpen(driver, windows);
      await driver.switchTo().window(...newTab);

      expect(await driver.getTitle()).to.not.contain('My Store');
      
      await driver.close();
      await driver.switchTo().window(countryPage);
    }
  });

  after(() => driver.quit());
})