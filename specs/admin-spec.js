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

  //Homework #3 - login to admin page - approved
  it('should login to admin page', async function() {
    await AdminPage.loginToAdmin();
    let title = await driver.getCurrentUrl();
    expect(title).to.equal('http://localhost/litecart/admin/');
  });

  
  /* Homework #7 
  Сделайте сценарий, который выполняет следующие действия в учебном приложении litecart.
  1) входит в панель администратора http://localhost/litecart/admin
  2) прокликивает последовательно все пункты меню слева, включая вложенные пункты
  3) для каждой страницы проверяет наличие заголовка (то есть элемента с тегом h1)
  */
  it('each page should have title', async function() {
    await AdminPage.loginToAdmin();
    let menuElements = await AdminPage.getSidebarElements();

    for (let i = 0; i < menuElements.length; i+=1) {
      await menuElements[i].click();

      let subElements = await AdminPage.getSidebarSubElements();

      if(subElements.length > 0) {
        for (let j = 0; j < subElements.length; j+=1) {
          await subElements[j].click();
          subElements = await AdminPage.getSidebarSubElements();
          expect(await AdminPage.getHeading()).to.exist;
        }
      } else {
        expect(await AdminPage.getHeading()).to.exist;
      }
      menuElements = await AdminPage.getSidebarElements();
    }
  })

  after(() => driver.quit());
})