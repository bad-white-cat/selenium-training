const { expect } = require('chai');
const { Builder, By } = require('selenium-webdriver');
const page = require('../pages/shopPage.js');

describe('Shop page:', function () {
  let driver;
  let Page;
  const rgb2array = (rgb) => rgb.match(/\d{1,3}/g);

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

  /* Homework #10
  Более точно, нужно открыть главную страницу, выбрать первый товар в блоке Campaigns и проверить следующее:
    а) на главной странице и на странице товара совпадает текст названия товара
  */
  it('campaign item name should be the same at catalog and details', async () => {
    await Page.loginToAdmin();
    await Page.navigateToShop();
    let campaignsProducts = await Page.getItemsInCampaigns();

    const item = campaignsProducts[0];

    const itemAtCatalogName = await Page.getItemName(item).getText();
    await item.click(); //go to item details
    expect (itemAtCatalogName).to.equal(await Page.getNameAtProductPage().getText());
  })

  /* Homework #10
  Более точно, нужно открыть главную страницу, выбрать первый товар в блоке Campaigns и проверить следующее:
    б) на главной странице и на странице товара совпадают цены (обычная и акционная)
  */
   it('campaign item prices should be the same at catalog and details', async () => {
    await Page.loginToAdmin();
    await Page.navigateToShop();
    let campaignsProducts = await Page.getItemsInCampaigns();

    const item = campaignsProducts[0];

    const regularPrice = await Page.getItemRegularPrice(item).getText();
    const campaignPrice = await Page.getItemCampaignPrice(item).getText();

    await item.click();//go to item details

    const regularPriceDetails = await Page.getItemRegularPrice().getText();
    const campaignPriceDetails = await Page.getItemCampaignPrice().getText();

    expect(regularPrice, `Expected regular price on catalog ${regularPrice} to equal to one on details ${regularPriceDetails}`)
    .to.equal(regularPriceDetails);

    expect(campaignPrice, `Expected campaign price on catalog ${campaignPrice} to equal to one on details ${campaignPriceDetails}`)
    .to.equal(campaignPriceDetails);
  })

  /* Homework #10
  Более точно, нужно открыть главную страницу, выбрать первый товар в блоке Campaigns и проверить следующее:
    в) обычная цена зачёркнутая и серая (можно считать, что "серый" цвет это такой, у которого в RGBa представлении одинаковые значения для каналов R, G и B)
    г) акционная жирная и красная (можно считать, что "красный" цвет это такой, у которого в RGBa представлении каналы G и B имеют нулевые значения)
    (цвета надо проверить на каждой странице независимо, при этом цвета на разных страницах могут не совпадать)
    д) акционная цена крупнее, чем обычная (это тоже надо проверить на каждой странице независимо)
  */
   it('regular price is grey and crossed out', async () => {

    await Page.loginToAdmin();
    await Page.navigateToShop();
    let campaignsProducts = await Page.getItemsInCampaigns();

    const item = campaignsProducts[0];

    /*
    Chrome format: rgba(119, 119, 119, 1) - grey
    FF format: rgb(119, 119, 119)
    IE11 format: rgba(119, 119, 119, 1)
    */

    const itemRegularPriceCatalog = await Page.getItemRegularPrice(item);
    const catalogColor = rgb2array(await itemRegularPriceCatalog.getCssValue("color"));

    expect(catalogColor[0], `Expected ${catalogColor} to have the same R,G,B at catalog`)
    .to.equal(catalogColor[1]).to.equal(catalogColor[2]);

    expect(await itemRegularPriceCatalog.getTagName(), `Expected reg price to be crossed out at catalog`)
    .to.equal('s');
    
    await item.click();//go to item details

    const itemRegularPriceDetails = await Page.getItemRegularPrice();
    const detailsColor = rgb2array(await itemRegularPriceDetails.getCssValue("color"));
    
    expect(detailsColor[0], `Expected ${catalogColor} to have the same R,G,B on details`)
    .to.equal(detailsColor[1]).to.equal(detailsColor[2]);

    expect(await itemRegularPriceDetails.getTagName(), `Expected reg price to be crossed out on details`)
    .to.equal('s');
  })

  /* Homework #10
  Более точно, нужно открыть главную страницу, выбрать первый товар в блоке Campaigns и проверить следующее:
    г) акционная жирная и красная (можно считать, что "красный" цвет это такой, у которого в RGBa представлении каналы G и B имеют нулевые значения)
    (цвета надо проверить на каждой странице независимо, при этом цвета на разных страницах могут не совпадать)
  */
   it('campaign price is red and bold', async () => {

    await Page.loginToAdmin();
    await Page.navigateToShop();
    let campaignsProducts = await Page.getItemsInCampaigns();

    const item = campaignsProducts[0];

    const itemCampPriceCatalog = await Page.getItemCampaignPrice(item);
    const catalogColor = rgb2array(await itemCampPriceCatalog.getCssValue("color"));

    expect(catalogColor[1], `Expected ${catalogColor} to have G = B = 0 at catalog`)
    .to.equal(catalogColor[2]).to.equal('0');

    expect(Number(await itemCampPriceCatalog.getCssValue('font-weight')), `Expected reg price to be bold at catalog`)
    .to.be.at.least(700);
    
    await item.click(); //go to item details

    const itemCampPriceDetails = await Page.getItemCampaignPrice();
    const detailsColor = rgb2array(await itemCampPriceDetails.getCssValue("color"));
    
    expect(detailsColor[1], `Expected ${catalogColor} to have G = B = 0 on details`)
    .to.equal(detailsColor[2]).to.equal('0');

    expect(Number(await itemCampPriceDetails.getCssValue('font-weight')), `Expected reg price to be bold on details`)
    .to.be.at.least(700);
  })

    /* Homework #10
  Более точно, нужно открыть главную страницу, выбрать первый товар в блоке Campaigns и проверить следующее:
    д) акционная цена крупнее, чем обычная (это тоже надо проверить на каждой странице независимо)
  */
   it('campaign price is red and bold', async () => {

    await Page.loginToAdmin();
    await Page.navigateToShop();
    let campaignsProducts = await Page.getItemsInCampaigns();

    const item = campaignsProducts[0];

    const itemCampPriceCatalog = await Page.getItemCampaignPrice(item);
    const catalogCampFontSize = parseInt(await itemCampPriceCatalog.getCssValue("font-size"));
    const itemRegularPriceCatalog = await Page.getItemRegularPrice(item);
    const catalogRegFontSize = parseInt(await itemRegularPriceCatalog.getCssValue("font-size"));

    expect(catalogCampFontSize, `At catalog`).to.above(catalogRegFontSize);
    
    await item.click();

    const itemCampPriceDetails = await Page.getItemCampaignPrice();
    const detailsCampFontSize = parseInt(await itemCampPriceDetails.getCssValue("font-size"));
    const itemRegularPriceDetails = await Page.getItemRegularPrice();
    const detailsRegFontSize = parseInt(await itemRegularPriceDetails.getCssValue("font-size"));
    
    expect(detailsCampFontSize, `On details`).to.above(detailsRegFontSize);
  })

  after(() => driver.quit());
})