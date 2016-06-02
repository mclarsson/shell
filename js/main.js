function log(s) {
    console.log(s);
}

(function() {
    shll.when('/', '/html/views/home.view.html')
        .when('/posts', '/html/views/posts.view.html', function() {
            var from = 0,
                to = 30;

            this.get('/api/get', {
                    from: from,
                    to: to
                })
                .then(function(response) {
                    var content = JSON.parse(response);
                    var ul = document.querySelector('#posts');
                    var frag = document.createDocumentFragment();
                    var len = content.length;

                    var types = 'li > a';

                    for (var i = 0; i < len; i++) {
                        var li = document.createElement('li');
                        var a = document.createElement('a');
                        var text = document.createTextNode(content[i]['title']);

                        a.href = '/posts/' + encodeURI(content[i]['title']);
                        a.appendChild(text);
                        li.appendChild(a);
                        frag.appendChild(li);
                    }

                    ul.appendChild(frag);
                    this.listen();
                });
        }, true)
        .when('/posts/?title', '/html/views/posts.view.html', function(params) {
            document.getElementById('post').innerHTML = decodeURI(params.title);
        })
        .when('/about', '/html/views/about.view.html')
        .when('/login', '/html/views/login.view.html');
})();