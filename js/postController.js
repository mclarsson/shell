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
                }).then(function(response) {
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
                            }).addClass('page-number').appendTo(ul);
                        }
                        create('li').append('a', function() {
                            this.href = '/article/' + shll.uri(content[i]['title']);
                            this.appendChild(document.createTextNode(content[i]['title']));
                        }).appendTo(ul);
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
                }).then(function(response) {
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