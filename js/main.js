function log(s) {
    console.log(s);
}

(function() {

    /**
     * Controller for posts
     */
    var postController = (function() {

        var pages = [];

        var page_length = 30;

        var initial_load = true;

        return {
            update: function(page) {
                page = page === '' ? 1 : +page;

                var from, to;

                if (!initial_load && page !== 1 && page === pages.length + 1) {
                    // next page
                    from = (page - 1) * page_length;
                    to = page_length;
                } else {
                    // previous page or new load
                    document.getElementById('posts').innerHTML = '';
                    pages = [];
                    from = 0;
                    to = page * page_length;
                }

                this.get(from, to);

                if (initial_load) {
                    shll.listen(document.getElementById('load_posts'), 'click', function() {
                        postController.next();
                    });
                    initial_load = false;
                }
            },

            reset: function() {
                pages = [];
                initial_load = true;
            },

            next: function() {
                shll.navigate('/blogg/' + (pages.length + 1));
            },

            /**
             * Fetches posts.
             */
            get: function(start, count) {
                shll.get('/api/get', {
                        from: start,
                        to: count
                    })
                    .then(function(response) {
                        var content = JSON.parse(response),
                            ul = document.getElementById('posts'),
                            len = content.length;

                        // Holder for new page.
                        var page = [];

                        for (var i = 0; i < len; i++) {
                            page.push(content[i]);

                            if (page.length === page_length) {
                                // Page finished, create new
                                pages.push(page);
                                page = [];
                            } else if (page.length === 1) {
                                // New page, add page number
                                create('li', function() {
                                        var string = 'Page ' + (pages.length + 1);
                                        this.innerHTML = string;
                                    })
                                    .addClass('page-number')
                                    .appendTo(ul);
                            }

                            create('li')
                                .append('a', function() {
                                    this.href = '/article/' + shll.uri(content[i]['title']);
                                    this.appendChild(document.createTextNode(content[i]['title']));
                                })
                                .appendTo(ul);
                        }
                    });
            },

            /**
             * Finds specific post.
             * @param  {String} title Title of post.
             * @param  {String} id    Id of post.
             */
            find: function(title, id) {
                shll.get('/api/find', {
                        title: encodeURIComponent(title),
                        id: id
                    })
                    .then(function(response) {
                        var post = JSON.parse(response)[0];
                        if (post) {
                            document.getElementById('post').innerHTML = '';
                            document.getElementById('post').innerHTML += '<h1>' + post.title + '</h1>';
                            document.getElementById('post').innerHTML += '<div class="post-text">' + post.text.substring(0) + '</div>';
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

    shll.when({
            path: '/',
            title: 'shll',
            activate: 'home',
            template: '/html/templates/home.html',
            callback: function() {
                shll.get('/api/js_api')
                    .then(function(response) {
                        document.getElementById('api').innerHTML += response;
                    });
            }
        })
        .when({
            path: '/blogg/?page',
            title: 'shll | blogg',
            activate: 'blogg',
            template: '/html/templates/posts.html',
            callback: function(params) {
                postController.update(params.page);
            },
            offload: function() {
                postController.reset();
            }
        })
        .when({
            path: '/article/&title',
            activate: 'blogg',
            template: '/html/templates/article.html',
            callback: function(params) {
                shll.title('shll | ' + params.title);
                postController.find(params.title);

                document.body.className = "clean";
            },
            offload: function() {
                document.body.className = "";
            }
        })
        /*
        AUTH
         */
        .when({
            path: '/auth_req',
            activate: 'auth_req',
            template: '/html/templates/article.html',
            callback: function(params) {
                shll.get('/auth/template', {
                    path: '/auth/test.html'
                }).then(function(response){
                    shll.setContent(response);
                });
            }
        })
        .when({
            path: '/login',
            title: 'shll | login',
            activate: 'login',
            template: '/html/templates/login.html'
        })
        .when({
            path: '/style',
            title: 'shll | style',
            activate: 'style',
            template: '/html/templates/style.html',
            callback: function() {
                document.onkeypress = function(e) {
                    log(e.key);
                    if(e.key === "g") {
                        document.getElementById('vertical-lines').style.display = document.getElementById('horizontal-lines').style.display === 'none' ? '' : 'none';
                        document.getElementById('horizontal-lines').style.display = document.getElementById('horizontal-lines').style.display === 'none' ? '' : 'none';
                    } else if(e.key === "z") {
                        document.getElementById('vertical-lines').style.zIndex = document.getElementById('horizontal-lines').style.zIndex === '-1' ? '1' : '-1';
                        document.getElementById('horizontal-lines').style.zIndex = document.getElementById('horizontal-lines').style.zIndex === '-1' ? '1' : '-1';
                    }
                };
            }
        })
        .missing({
            title: 'shll | 404',
            template: '/html/errors/404.html'
        });
})();