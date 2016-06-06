function log(s) {
    console.log(s);
}

(function() {

    //////////////////
    // Controllers  //
    //////////////////

    /**
     * Controller for /posts and /posts/?title.
     */
    var pctr = (function() {
        // TODO:
        // Dessa variabler har samma värde när man går bak och fram (popstate)
        var from = 0,
            to = 30;

        return {
            reset: function() {
                from = 0;
                return this;
            },

            /**
             * Fetches posts.
             */
            get: function() {
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
                                .append('a', function() {
                                    this.href = '/posts/' + shll.uri(content[i]['title']);
                                    this.appendChild(document.createTextNode(content[i]['id'] + ' - ' + content[i]['title']));
                                })
                                .appendTo(ul);
                        }

                        from += to;
                    });
            },

            /**
             * Finds specific post.
             * @param  {String} title Title of post.
             * @param  {String} id    Id of post.
             */
            find: function(title, id) {
                shll.get('/api/find', {
                        title: title,
                        id: id
                    })
                    .then(function(response) {
                        var post = JSON.parse(response)[0];
                        if (post) {
                            document.getElementById('post').innerHTML = '';
                            document.getElementById('post').innerHTML += '<h1>' + post.title + '</h1>';
                            document.getElementById('post').innerHTML += '<div style="max-width:30em;">' + post.text.substring(0, 418) + '</div>';
                        } else {
                            document.getElementById('post').innerHTML = '<i>The post you are looking for doesn\'t exist...</i>';
                        }
                    });
            }
        }
    })();

    /////////////////
    // Application //
    /////////////////

    shll.when('/', '/html/views/home.view.html')
        .when('/posts', '/html/views/posts.view.html', function() {
            pctr.reset()
                .get();
                
            shll.listen(document.getElementById('load_posts'), 'click', function() {
                pctr.get();
            });
        }, true)
        .when('/posts/?title', '/html/views/posts.view.html', function(params) {
            pctr.find(params.title);
        })
        .when('/about', '/html/views/about.view.html')
        .when('/login', '/html/views/login.view.html');
})();