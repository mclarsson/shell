function log(s) {
    console.log(s);
}

(function() {
    Application
        .when('/', '/html/views/home.view.html', function() {
            Application
                .get('/api', {
                    test: 'working',
                    other: 'paramm'
                })
                .then(function(response) {
                    log(response);
                });
        })
        .when('/products', '/html/views/products.view.html')
        .when('/about', '/html/views/about.view.html')
        .when('/login', '/html/views/login.view.html');
})();