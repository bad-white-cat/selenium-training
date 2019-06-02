const { expect } = require('chai');
const { Builder, By } = require('selenium-webdriver');
const page = require('../pages/shopPage.js');

describe('Shop page:', function () {
  let driver;
  let Page;

  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();
    Page = await new page(driver);
  });

  /* Homework #8
  Сделайте сценарий, проверяющий наличие стикеров у всех товаров в учебном приложении litecart на главной странице. 
  Стикеры -- это полоски в левом верхнем углу изображения товара, на которых написано New или Sale или что-нибудь другое. 
  Сценарий должен проверять, что у каждого товара имеется ровно один стикер.
  */
  it('each position should have one sticker', async function() {
    await Page.loginToAdmin();
    await Page.navigateToShop();
    const allItems = await Page.getAllItems();
    for (let item of allItems) {
      const stickers = await item.findElements(By.css('div.sticker'));
      expect(stickers.length).to.equal(1);
    }
  })

  after(() => driver.quit());
})