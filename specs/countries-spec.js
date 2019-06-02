const { Builder } = require('selenium-webdriver');
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

  it('countries should be in alphabet order', async function() {
    await Page.login();
    await Page.navigateToPage('Countries');
    const countriesElements = await Page.getCountriesList();
    const countriesList = await Promise.all(countriesElements.map(country => country.getText()));

    expect(countriesList).to.be.sorted();
  });

  after(() => driver.quit());
})