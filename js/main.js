function log(s) {
    console.log(s);
}

(function() {
    shll.when('/', '/html/views/home.view.html')
        .when('/posts', '/html/views/posts.view.html', function() {
            var from = 0,
                to = 32;

            shll.get('/api/get', {
                    from: from,
                    to: to
                })
                .then(function(response) {
                    var content = JSON.parse(response),
                        ul = document.getElementById('posts'),
                        len = content.length;

                    for (var i = 0; i < len; i++) {
                        shll.create('li')
                            .insert('a', function() {
                                this.href = '/posts/' + encodeURI(content[i]['title']);
                                this.appendChild(document.createTextNode(content[i]['title']));
                            })
                            .appendTo(ul);
                    }
                });
        }, true)
        .when('/posts/?title', '/html/views/posts.view.html', function(params) {
            document.getElementById('post').innerHTML = decodeURI(params.title);
        })
        .when('/about', '/html/views/about.view.html')
        .when('/login', '/html/views/login.view.html');
})();