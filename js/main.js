function log(s) {
    console.log(s);
}

window.onkeydown = function(e) {
    if (e.key === 'g') {
        var grid = document.getElementsByClassName('grid')[0];
        grid.style.display = grid.style.display == "none" ? "block" : "none";
    } else if (e.key === 'z') {
        var grid = document.getElementsByClassName('grid')[0];
        grid.style.zIndex = grid.style.zIndex == 1 ? -1 : 1;
    }
};

(function() {

    //////////////////
    // Controllers  //
    //////////////////

    /**
     * Controller for posts
     */
    var pctr = (function() {

        var pages = [];

        var page_length = 30;

        var initial_load = true;

        return {
            update: function(page) {
                page = page === '' ? 1 : +page;

                var from, to;

                if (!initial_load && page !== 1 && page === pages.length + 1) {
                    // next page
                    from = page * page_length;
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
                        pctr.next();
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
                                shll.create('li')
                                    .append('span', function() {
                                        this.appendChild(document.createTextNode(pages.length + 1));
                                    })
                                    .appendTo(ul);
                            }

                            shll.create('li')
                                .append('a', function() {
                                    this.href = '/article/' + shll.uri(content[i]['title']);
                                    this.appendChild(document.createTextNode(content[i]['id'] + ' - ' + content[i]['title']));
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

    function test() {
        log('test');
    };

    /////////////////
    // Application //
    /////////////////
    shll.when('/', '/html/views/home.view.html', function() {
        })
        .when('/blogg/?page', '/html/views/posts.view.html', function(params) {
            pctr.update(params.page);
        }, function() {
            pctr.reset();
        })
        .when('/article/&title', '/html/views/article.view.html', function(params) {
            pctr.find(params.title);
        })
        .when('/login', '/html/views/login.view.html');
})();