const { expect } = require('chai');
const { Builder } = require('selenium-webdriver');
const adminPage = require('../pages/adminPage.js');

describe('Administration page:', function () {
  let driver;
  let AdminPage;

  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();
    AdminPage = await new adminPage(driver);
  });

  /*it('should login to admin page', async function() {
    await AdminPage.login();
    let title = await driver.getCurrentUrl();
    expect(title).to.equal('http://localhost/litecart/admin/');
  });*/

  it('should correspond page title with content', async function() {
    await AdminPage.login();
    let menuElements = await AdminPage.getSidebarElements();
    for (let i = 2; i < menuElements.length; i++) {
      await menuElements[i].click();
      menuElements = await AdminPage.getSidebarElements();
      const pageTitle = await AdminPage.getHeading();
      const subElements = await AdminPage.getSidebarElements();
      if(subElements.length = 0) {
        expect(await menuElements[i].getText()).to.equal(await pageTitle.getText());
      }
    }
  })

  after(() => driver.quit());
})