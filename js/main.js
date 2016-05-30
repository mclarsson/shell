function log(s) {
    console.log(s);
}

(function() {
    // Example
    if (false) {
        shll.when('/', '/html/views/home.view.html', function() {
                shll.get('/api', {
                        test: 'working',
                        other: 'param'
                    })
                    .then(function(response) {
                        //log(response);
                    });
            })
            .when('/products', '/html/views/products.view.html', null, true)
            .when('/products/?name', '/html/views/products.view.html', function(params) {
                document.getElementById('product').innerHTML = params.name;
            })
            .when('/about', '/html/views/about.view.html')
            .when('/login', '/html/views/login.view.html');
    }

    // Testing
    if (true) {
        var start = new Date().getTime();

        var end = new Date().getTime();
        var time = end - start;
        log('Execution time: ' + time);
    }
})();