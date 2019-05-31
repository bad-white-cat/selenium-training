const { expect } = require('chai');
const { Builder } = require('selenium-webdriver');
const adminPage = require('../pages/adminPage.js');

describe('Administration page:', function () {
  let driver;
  let AdminPage;

  before(async function() {
    driver = await new Builder().forBrowser('internet explorer').build();
    AdminPage = await new adminPage(driver);
  });

  it('should login to admin page', async function() {
    await AdminPage.login();
    let title = await driver.getCurrentUrl();
    expect(title).to.equal('http://localhost/litecart/admin/');
  });

  it('countries should be in alphabet order', async function() {
    await AdminPage.login();
    
  });

  after(() => driver.quit());
})