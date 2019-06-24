const { expect } = require('chai');
const { Builder, until } = require('selenium-webdriver');
const shopPage = require('../pages/shopPage.js');
const cartPage = require('../pages/cartPage.js');
const { getGuid } = require('../helpers/guidHelper.js');

describe('Shop page:', function () {
  let driver;
  let ShopPage;
  let CartPage;

  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();
    ShopPage = await new shopPage(driver);
    CartPage = await new cartPage(driver);
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
    await ShopPage.regCustomer(data);
    expect(await ShopPage.getSuccessMessage().getText()).to.equal('Your customer account has been created.');

    await ShopPage.customerLogout();
    expect(await ShopPage.getSuccessMessage().getText()).to.equal('You are now logged out.');
    
    await ShopPage.customerLogin(data.email, data.password);
    expect(await ShopPage.getSuccessMessage().getText()).to.equal(`You are now logged in as ${data.firstname} ${data.lastname}.`);

    await ShopPage.customerLogout();
    expect(await ShopPage.getSuccessMessage().getText()).to.equal('You are now logged out.');
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

 /*
  Homework #19
  Переделайте созданный в задании 13 сценарий для добавления товаров в корзину и удаления товаров из корзины, чтобы он использовал многослойную архитектуру.
  А именно, выделите вспомогательные классы для работы с главной страницей (откуда выбирается товар), для работы со страницей товара
  (откуда происходит добавление товара в корзину), со страницей корзины (откуда происходит удаление), 
  и реализуйте сценарий, который не напрямую обращается к операциям Selenium, а оперирует вышеперечисленными объектами-страницами.
 */
  it('should add and remove items from cart', async function() {
    await ShopPage.get();

    for (let i = 0; i < 3; i += 1) {
      let itemToBuy = (await ShopPage.getAllItems())[0];
      await itemToBuy.click();
      await ShopPage.addToCart();
      await ShopPage.goHome()  
    }
    await ShopPage.openCart();
    await CartPage.removeEverythingFromCart();
    expect(await CartPage.emptyMessage().getText()).to.equal('There are no items in your cart.');
  })

  after(() => driver.quit());
})