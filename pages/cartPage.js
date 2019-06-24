const { By, until } = require('selenium-webdriver');
const catalogPage = require('./catalogPage');

class cartPage extends catalogPage {
  constructor (driver) {
    super(driver);
  }

  removeFromCartButton() {
    return this.driver.findElements(By.css('#box-checkout-cart button[name="remove_cart_item"]'));
  }

  stopCartAnimation() {
    const shortcuts = this.driver.wait(until.elementsLocated(By.css('li.shortcut')));
    if (shortcuts.length > 0) {
      shortcuts[0].click();
    }
  }

  async removeEverythingFromCart() {
    let removeButton = await this.removeFromCartButton();
    if(removeButton.length > 0) {
      await removeButton[0].click();
      await this.driver.wait(until.stalenessOf(removeButton[0]));
      return await this.removeEverythingFromCart();
    } else return;
  }

  emptyMessage() {
    return this.driver.wait(until.elementLocated(By.css('#checkout-cart-wrapper em')));
  }
}

module.exports = cartPage;