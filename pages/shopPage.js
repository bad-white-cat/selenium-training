const { By, until } = require('selenium-webdriver');
const params = require('../params.js');
const adminPage = require('./adminPage');
const { selectDropdownValue } = require('../helpers/controlHelper.js');

class shopPage extends adminPage {
  constructor (driver) {
    super(driver);
    this.logout = By.xpath("//*[@id='box-account']//a[contains(text(),'Logout')]");
    this.createNewAccount = By.css('form[name="login_form"] a'); 
  }

  get() {
    return this.driver.get(`${params.host}${params.urls.shop}`);
  }

  //administrator
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

  async addToCart() {
    const sizeSelect = await this.driver.findElements(By.css('select[name="options\[Size\]"]'));
    if(sizeSelect.length > 0) {
      await sizeSelect[0].click();
      await this.driver.sleep(2000);
      const sizeOptions = await sizeSelect[0].findElements(By.css('option'));
      await this.driver.sleep(2000);
      await sizeOptions[1].click();
    }
    await this.driver.findElement(By.css('button[name="add_cart_product"]')).click();
    await this.waitForCartUpdated(await this.getQuantityInCart().getText());
  }

  async waitForCartUpdated(initial, count = params.timeout / 1000) {
    let changed = await this.getQuantityInCart().getText();
    if (changed === initial) {
      if(count > 0) {
        await this.driver.sleep(1000);
        await this.waitForCartUpdated(initial, count - 1);
      } else {
        throw (`Cart wasn\'t updated during ${count} seconds.`)
      }
    }
  }

  //customer
  async regCustomer(data) {
    await this.get();
    await this.driver.wait(until.elementLocated(this.createNewAccount), params.timeout).click();
    await this.driver.wait(until.elementLocated(By.css('form[name="customer_form"] input[name="firstname"]')), params.timeout)
    .sendKeys(data.firstname);
    await this.driver.findElement(By.css('form[name="customer_form"] input[name="lastname"]')).sendKeys(data.lastname);
    await this.driver.findElement(By.css('form[name="customer_form"] input[name="address1"]')).sendKeys(data.address1);
    await this.driver.findElement(By.css('form[name="customer_form"] input[name="postcode"]')).sendKeys(data.postcode);
    await this.driver.findElement(By.css('form[name="customer_form"] input[name="city"]')).sendKeys(data.city);
    const country = await this.driver.findElement(By.css('form[name="customer_form"] select[name="country_code"]'));  
    await selectDropdownValue(this.driver, country, data.country);
    await this.driver.findElement(By.css('form[name="customer_form"] select[name="zone_code"]')).click();
    await this.driver.wait(until.elementLocated(By.xpath(`//option[contains(text(),'${data.state}')]`)), params.timeout).click();
    await this.driver.findElement(By.css('form[name="customer_form"] input[name="phone"]')).sendKeys(data.phone);
    await this.driver.findElement(By.css('form[name="customer_form"] input[name="email"]')).sendKeys(data.email);
    await this.driver.findElement(By.css('form[name="customer_form"] input[name="password"]')).sendKeys(data.password);
    await this.driver.findElement(By.css('form[name="customer_form"] input[name="confirmed_password"]')).sendKeys(data.password);
    await this.driver.findElement(By.css('form[name="customer_form"] button[name="create_account"]')).click();
    await this.driver.wait(until.elementLocated(this.logout), params.timeout);
  }

  customerLogout() {
    return this.driver.wait(until.elementLocated(this.logout), params.timeout).click();
  }

  async customerLogin(username, password) {
    await this.driver.wait(until.elementLocated(By.css('form[name="login_form"] input[name="email"]')), params.timeout)
      .sendKeys(username);
    await this.driver.findElement(By.css('form[name="login_form"] input[name="password"]')).sendKeys(password);
    await this.driver.findElement(By.css('form[name="login_form"] button[name="login"]')).click();
    await this.driver.wait(until.elementLocated(this.logout), params.timeout);
  }

  getSuccessMessage() {
    return this.driver.findElement(By.css('div.success'));
  }

  getQuantityInCart() {
    return this.driver.findElement(By.css('div#cart span.quantity'));
  }

  openCart() {
    return this.driver.findElement(By.css('div#cart a.content')).click();
  }
}

module.exports = shopPage;