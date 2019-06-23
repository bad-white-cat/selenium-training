const { expect } = require('chai');
const { Builder, until } = require('selenium-webdriver');
const page = require('../pages/shopPage.js');
const { getGuid } = require('../helpers/guidHelper.js');

describe('Shop page:', function () {
  let driver;
  let Page;

  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();
    Page = await new page(driver);
  });

  /* Homework #11
    Сделайте сценарий для регистрации нового пользователя в учебном приложении litecart (не в админке, а в клиентской части магазина).

    Сценарий должен состоять из следующих частей:

    1) регистрация новой учётной записи с достаточно уникальным адресом электронной почты (чтобы не конфликтовало с ранее созданными пользователями, в том числе при предыдущих запусках того же самого сценария),
    2) выход (logout), потому что после успешной регистрации автоматически происходит вход,
    3) повторный вход в только что созданную учётную запись,
    4) и ещё раз выход.

    В качестве страны выбирайте United States, штат произвольный. При этом формат индекса -- пять цифр.
  */
  it('new customers registration', async function() {
    const data = {
        firstname: getGuid(),
        lastname: getGuid(),
        email: `${getGuid()}@example.com`,
        address1: '233 Wein Ave',
        postcode: '60007',
        country: 'United States',
        city: 'Chicago',
        state: 'Illinois',
        phone: '123456789',
        password: '123'
    }
    await Page.regCustomer(data);
    expect(await Page.getSuccessMessage().getText()).to.equal('Your customer account has been created.');

    await Page.customerLogout();
    expect(await Page.getSuccessMessage().getText()).to.equal('You are now logged out.');
    
    await Page.customerLogin(data.email, data.password);
    expect(await Page.getSuccessMessage().getText()).to.equal(`You are now logged in as ${data.firstname} ${data.lastname}.`);

    await Page.customerLogout();
    expect(await Page.getSuccessMessage().getText()).to.equal('You are now logged out.');
  })

  /*
  Homework #13
  Сделайте сценарий для добавления товаров в корзину и удаления товаров из корзины.
    1) открыть главную страницу
    2) открыть первый товар из списка
    2) добавить его в корзину (при этом может случайно добавиться товар, который там уже есть, ничего страшного)
    3) подождать, пока счётчик товаров в корзине обновится
    4) вернуться на главную страницу, повторить предыдущие шаги ещё два раза, чтобы в общей сложности в корзине было 3 единицы товара
    5) открыть корзину (в правом верхнем углу кликнуть по ссылке Checkout)
    6) удалить все товары из корзины один за другим, после каждого удаления подождать, пока внизу обновится таблица
 */
  it('should add and remove items from cart', async function() {
    await Page.get();

    for (let i = 0; i < 3; i += 1) {
      let itemToBuy = (await Page.getAllItems())[0];
      await itemToBuy.click();
      await Page.addToCart();
      await Page.goHome()  
    }
    await Page.openCart();
    
    const removeEverythingFromCart = async () => {
      let removeButton = await Page.removeFromCartButton();
      if(removeButton.length > 0) {
        await removeButton[0].click();
        await driver.wait(until.stalenessOf(removeButton[0]));
        return await removeEverythingFromCart();
      } else return;
    }

    await removeEverythingFromCart();
    expect(await Page.emptyMessage().getText()).to.equal('There are no items in your cart.');
  })

  after(() => driver.quit());
})