const { By, until } = require('selenium-webdriver');
const params = require('../params.js');
const adminPage = require('./adminPage');
const { setCheckboxChecked, clearAndFill } = require('../helpers/controlHelper.js');

class catalogPage extends adminPage {
  constructor (driver) {
    super(driver);
  }

  addNewProduct() {
    return this.driver.wait(until.elementLocated(By.xpath('//a[@class="button" and contains(text()," Add New Product")]')), params.timeout).click();
  }

  async openTab(title) {
    await this.driver.wait(until.elementLocated(By.xpath(`//div[@class="tabs"]//a[contains(text(),"${title}")]`)), params.timeout).click(); 
    await this.driver.wait(until.elementLocated(By.xpath(`//div[@class="tabs"]//a[contains(text(),"${title}")]//parent::li[@class="active"]`)));
  }

  async fillGeneralInformation(data) {
    if(data.enabled) {
      await setCheckboxChecked(await this.driver.wait(until.elementLocated(By.xpath('//div[@id="tab-general"]//label[contains(text()," Enabled")]/input')), params.timeout));
    }

    await this.driver.wait(until.elementLocated(By.css('#tab-general input[name="name\[en\]"]')), params.timeout).sendKeys(data.name);
    await this.driver.wait(until.elementLocated(By.css('#tab-general input[name="code"]')), params.timeout).sendKeys(data.code);
    
    if(data.category && data.category.length > 0) {
        await Promise.all(data.category.map(cat => this.driver.findElement(By.css(`#tab-general input[data-name="${cat}"]`))
        .then(el => setCheckboxChecked(el))
        ));
    };

    if(data.gender && data.gender.length > 0) {
        await Promise.all(data.gender.map(gender => this.driver.findElement(By.xpath(`//*[@id='tab-general']//td[contains(text(),'${gender}')]//preceding::input[1]`))
        .then(el => setCheckboxChecked(el))
        ));
    };

    if(data.defaultCat) {
        await this.driver.findElement(By.css(`#tab-general select[name="default_category_id"]`)).click();
        await this.driver.wait(until.elementLocated(By.xpath(`//option[contains(text(),"${data.defaultCat}")]`))).click();
    }

    if(data.quantity) {
        await clearAndFill(await this.driver.findElement(By.css(`#tab-general input[name="quantity"]`)), data.quantity);
    }

    if(data.picture) {
        await this.driver.findElement(By.css(`#tab-general input[type="file"]`)).sendKeys(data.picture);
    }

    if(data.validFrom) {
        await this.driver.findElement(By.css(`#tab-general input[name="date_valid_from"]`)).sendKeys(data.validFrom);
    }

    if(data.validTo) {
        await this.driver.findElement(By.css(`#tab-general input[name="date_valid_to"]`)).sendKeys(data.validTo);
    }
  }

  async fillInformationTab(data) {
    if(data.manufacturer) {
      await this.driver.wait(until.elementLocated(By.css(`#tab-information select[name="manufacturer_id"]`))).click();
      await this.driver.wait(until.elementLocated(By.xpath(`//option[contains(text(),"${data.manufacturer}")]`))).click();
    }

    if(data.keywords) {
        await this.driver.findElement(By.css(`#tab-information input[name="keywords"]`)).sendKeys(data.keywords);
    }

    if(data.shortDescr) {
        await this.driver.findElement(By.css(`#tab-information input[name="short_description\[en\]"]`)).sendKeys(data.shortDescr);
    }

    if(data.descr) {
        await this.driver.findElement(By.css(`#tab-information textarea[name="description\[en\]"]`)).sendKeys(data.descr);
    }

    if(data.heading) {
        await this.driver.findElement(By.css(`#tab-information input[name="head_title\[en\]"]`)).sendKeys(data.heading);
    }

    if(data.meta) {
        await this.driver.findElement(By.css(`#tab-information input[name="meta_description\[en\]"]`)).sendKeys(data.meta);
    }
  }

  async fillPricesTab(data) {
    if(data.purchasePrice) {
        await clearAndFill(await this.driver.findElement(By.css(`#tab-prices input[name="purchase_price"]`)), data.purchasePrice);
    }

    if(data.currency) {
        await this.driver.findElement(By.css(`#tab-prices select[name="purchase_price_currency_code"]`)).click();
        await this.driver.wait(until.elementLocated(By.xpath(`//option[contains(text(),"${data.currency}")]`))).click();
    }

    if(data.priceUSD) {
        await clearAndFill(await this.driver.findElement(By.css(`#tab-prices input[name="prices\[USD\]"]`)), data.priceUSD);
    }

    if(data.taxUSD) {
        await clearAndFill(await this.driver.findElement(By.css(`#tab-prices input[name="gross_prices\[USD\]"]`)), data.taxUSD);
    }

    if(data.priceEuros) {
        await clearAndFill(await this.driver.findElement(By.css(`#tab-prices input[name="prices\[EUR\]"]`)), data.priceEuros);
    }

    if(data.taxEuros) {
        await clearAndFill(await this.driver.findElement(By.css(`#tab-prices input[name="gross_prices\[EUR\]"]`)), data.taxEuros);
    }
  }

  async submitProduct() {
      await this.driver.findElement(By.css(`button[name="save"]`)).click();
      await this.driver.wait(until.elementLocated(By.css('div.success')), params.timeout);
  }
}

module.exports = catalogPage;