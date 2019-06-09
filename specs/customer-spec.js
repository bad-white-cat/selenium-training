const { expect } = require('chai');
const { Builder } = require('selenium-webdriver');
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

  after(() => driver.quit());
})