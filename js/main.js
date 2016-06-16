function log(s) {
    console.log(s);
}

(function() {

    //////////////////
    // Controllers  //
    //////////////////

    /**
     * Controller for posts
     */
    var pctr = (function(){
        var current = 1;
        var from = 0;
        var to = 5;

        return {
            update: function(page){
                current = page === '' ? current : +page;
                from = to * (current - 1);
                document.getElementById('posts').innerHTML = '';
                this.get(0, from + to);
                return this;
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

                        for (var i = 0; i < len; i++) {
                            shll.create('li')
                                .append('a', function() {
                                    this.href = '/article/' + shll.uri(content[i]['title']);
                                    this.appendChild(document.createTextNode(content[i]['id'] + ' - ' + content[i]['title']));
                                })
                                .appendTo(ul);
                        }
                    });
            },

            next: function(){
                current += 1;
                shll.navigate('/blogg/' + current);
                this.get(from, to);
                return this;
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
    shll.when('/', '/html/views/home.view.html', function() {

        })
        .when('/blogg/?page', '/html/views/posts.view.html', function(params) {
            pctr.update(params.page);

            shll.listen(document.getElementById('load_posts'), 'click', function() {
                log('click');
                pctr.next();
            });
        })
        .when('/article/&title', '/html/views/article.view.html', function(params) {
            log(params);
            pctr.find(params.title);
        })
        .when('/login', '/html/views/login.view.html');
})();