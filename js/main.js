function log(s) {
    console.log(s);
}

(function() {
    shll // Home page
        .when('/', '/html/views/home.view.html')
        // Posts page
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
        // Single post page
        .when('/posts/?title', '/html/views/posts.view.html', function(params) {

            shll.get('/api/find', {
                    title: params.title
                })
                .then(function(response) {
                    var post = JSON.parse(response)[0];
                    document.getElementById('post').innerHTML = '';
                    document.getElementById('post').innerHTML += '<h1>' + post.title + '</h1>';
                    document.getElementById('post').innerHTML += '<div style="max-width:30em;">' + post.text.substring(0, 418) + '</div>';
                });
        })
        // About page
        .when('/about', '/html/views/about.view.html')
        // Login page
        .when('/login', '/html/views/login.view.html');
})();