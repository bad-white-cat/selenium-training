const params = {
    login: "Admin",
    password: "123",
    host: 'http://localhost/litecart/',

    urls: {
        admin: 'admin',
        countries: 'admin/?app=countries&doc=countries',
        login: 'admin/login.php',
    },

    timeout: 10000,
}

module.exports = params;