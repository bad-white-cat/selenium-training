const { By, until } = require('selenium-webdriver');
const params = require('../params.js');
const adminPage = require('./adminPage');

class shopPage extends adminPage {
  constructor (driver) {
    super(driver);
  }

  async goHome() {
    const home = await this.driver.wait(until.elementLocated(By.css(`nav#site-menu i.fa`)), params.timeout);
    await home.click();
    await this.driver.wait(until.elementLocated(By.id('box-most-popular')), 7000);
  }

  //catalog
  getAllItems() {
    return this.driver.findElements(By.css('li.product'));
  }

  getItemsInCampaigns() {
    return this.driver.findElements(By.css('div#box-campaigns li.product'));
  }

  getItemName(item = this.driver) {
    return item.findElement(By.css('div.name'));
  }

  getItemRegularPrice(item = this.driver) {
    return item.findElement(By.css('.regular-price'));
  }

  getItemCampaignPrice(item = this.driver) {
    return item.findElement(By.css('.campaign-price'));
  }

  //single product page 
  getNameAtProductPage() {
    return this.driver.findElement(By.css('h1'));
  }
}

module.exports = shopPage;