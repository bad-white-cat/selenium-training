const { Builder, By } = require('selenium-webdriver');
const page = require('../pages/countriesPage.js');

const chai = require("chai"),
expect = chai.expect; // preference and tested with expect
chai.use(require("chai-sorted"));

describe('Countries page:', function () {
  let driver;
  let Page;

  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();
    Page = await new page(driver);
  });

  /*Homework #9
  Сделайте сценарии, которые проверяют сортировку стран и геозон (штатов) в учебном приложении litecart.
    1) на странице http://localhost/litecart/admin/?app=countries&doc=countries
    а) проверить, что страны расположены в алфавитном порядке */
  it('countries should be in alphabet order', async function() {
    await Page.loginToAdmin();
    await Page.navigateToPage('Countries');
    const countriesElements = await Page.getCountriesList();
    const countriesList = await Promise.all(countriesElements.map(country => country.getText()));

    expect(countriesList).to.be.sorted();
  });

  /*Homework #9
    1) на странице http://localhost/litecart/admin/?app=countries&doc=countries
    б) для тех стран, у которых количество зон отлично от нуля -- открыть страницу этой страны и там проверить, что зоны расположены в алфавитном порядке
  */
  it.only('geo zones should be in alphabet order', async function() {
    await Page.loginToAdmin();
    await Page.navigateToPage('Countries');
    const countriesRows = await Page.getCountriesRows();
    
    /*for (let row of countriesRows) {
      const zone = await row.findElement(By.xpath('.//td[6]'));
      const number = await zone.getText();
      console.log(number);
    }*/

    const filterCountries = async country => {
      const zone = await country.findElement(By.xpath('.//td[6]'));
      const number = await zone.getText();
      return number > 0;
    }

    const countriesToCheck = await Promise.all(countriesRows.filter(filterCountries));
    console.log(countriesToCheck.length);

    /*const list = [] //...an array filled with values

const functionWithPromise = item => { //a function that returns a promise
  return Promise.resolve('ok')
}

const anAsyncFunction = async item => {
  return await functionWithPromise(item)
}

const getData = async () => {
  return await Promise.all(list.map(item => anAsyncFunction(item)))
}

const data = getData()
console.log(data)
*/
  });

  after(() => driver.quit());
})