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
}

module.exports = shopPage;