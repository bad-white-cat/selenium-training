const { Builder } = require('selenium-webdriver');
const page = require('../pages/catalogPage.js');
const { expect } = require("chai");
const { getGuid } = require('../helpers/guidHelper.js');
const path = require('path');

describe('Catalog page:', function () {
  let driver;
  let Page;

  before(async function() {
    driver = await new Builder().forBrowser('firefox').build();
    Page = await new page(driver);
  });

  /*Homework #12
    Сделайте сценарий для добавления нового товара (продукта) в учебном приложении litecart (в админке).
    Для добавления товара нужно открыть меню Catalog, в правом верхнем углу нажать кнопку "Add New Product", заполнить поля с информацией о товаре и сохранить.
    Достаточно заполнить только информацию на вкладках General, Information и Prices. Скидки (Campains) на вкладке Prices можно не добавлять.
    Переключение между вкладками происходит не мгновенно, поэтому после переключения можно сделать небольшую паузу (о том, как делать более правильные ожидания, будет рассказано в следующих занятиях).
    Картинку с изображением товара нужно уложить в репозиторий вместе с кодом. 
    При этом указывать в коде полный абсолютный путь к файлу плохо, на другой машине работать не будет. Надо средствами языка программирования преобразовать относительный путь в абсолютный.
    После сохранения товара нужно убедиться, что он появился в каталоге (в админке). Клиентскую часть магазина можно не проверять.
    Можно оформить сценарий либо как тест, либо как отдельный исполняемый файл.
 */
  it('should add a product to the catalog', async function() {
    await Page.loginToAdmin();
    await Page.navigateToPage('Catalog');
    await Page.addNewProduct();
    await Page.fillGeneralInformation({
        enabled: true,
        name: getGuid(),
        code: getGuid(),
        category: ["Root","Rubber Ducks", "Subcategory"],
        defaultCat: "Root",
        quantity: 25,
        gender: ['Female','Unisex'],
        validFrom: "01012020",
        validTo: "12122020",
        picture: path.resolve(__dirname, '../pictures/product.jpg')
    });
    await Page.openTab("Information");
    await Page.fillInformationTab({
        manufacturer: 'ACME Corp.',
        keywords: 'lights, colors',
        shortDescr: 'garden lights',
        descr: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.',
        heading: getGuid(),
        meta: getGuid()
    });
    await Page.openTab("Prices");
    await Page.fillPricesTab({
        purchasePrice: 100,
        currency: 'Euros',
        priceUSD: 120,
        taxUSD: 5,
        priceEuros: 100,
        taxEuros: 5
    });
    await Page.submitProduct();    
  });

  /* Homework #17
  Сделайте сценарий, который проверяет, не появляются ли в логе браузера
  сообщения при открытии страниц в учебном приложении, а именно -- страниц товаров в каталоге в административной панели.
  Сценарий должен состоять из следующих частей:
    1) зайти в админку
    2) открыть каталог, категорию, которая содержит товары (страница http://localhost/litecart/admin/?app=catalog&doc=catalog&category_id=1)
    3) последовательно открывать страницы товаров и проверять, не появляются ли в логе браузера сообщения (любого уровня)
  */
  it('should check browser logs are empty', async function() {
    await Page.loginToAdmin();
    await Page.navigateToPage('Catalog');
    await Page.openCategory('Rubber Ducks');
    let goodsInCategory = await Page.getAllGoodsInCategory();
    for (let i = 0; i < goodsInCategory.length; i += 1) {
      await goodsInCategory[i].click();
      const logs = await driver.manage().logs().get("browser");
      expect(logs.length).to.equal(0);
      await Page.closeProduct();
      goodsInCategory = await Page.getAllGoodsInCategory();
    }
  });

  after(() => driver.quit());
})