const { expect } = require('chai');
const {Builder, Key, By, until} = require('selenium-webdriver');

describe('Checkout Google.com', function () {
  let driver;

  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();
  });

    it('Search on Google', async function() {
        await driver.get('https://google.com');
        await driver.findElement(By.name('q')).click();
        await driver.findElement(By.name('q')).sendKeys('olya', Key.RETURN);
        await driver.wait(until.elementLocated(By.id('rcnt')), 10000);

        let title = await driver.getTitle();
        expect(title).to.equal('olya - Поиск в Google');
    });

    after(() => driver.quit());
})