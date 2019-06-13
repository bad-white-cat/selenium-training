const params = {
    login: "Admin",
    password: "123",
    host: 'http://localhost/litecart/',/*'http://litecart.stqa.ru/',*/

    urls: {
        admin: 'admin',
        countries: 'admin/?app=countries&doc=countries',
        login: 'admin/login.php',
        shop: 'en/'
    },

    timeout: 10000,
}

module.exports = params;