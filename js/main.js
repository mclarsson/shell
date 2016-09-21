function log(s) {
    console.log(s);
}
(function() {
    /////////////////
    // Application //
    /////////////////
    shll.route({
            path: '/',
            title: 'shll',
            activate: 'home',
            template: '/html/templates/home.html'
        }).route({
            path: '/posts/?page',
            title: 'shll | posts',
            activate: 'posts',
            template: '/html/templates/posts.html',
            callback: function(params) {
                postController.update(params.page);
            },
            offload: function() {
                postController.reset();
            }
        }).route({
            path: '/article/&title',
            activate: 'posts',
            template: '/html/templates/article.html',
            callback: function(params) {
                shll.title('shll | ' + params.title);
                postController.find(params.title);
            }
        })
        /*
            AUTH
         */
        .route({
            path: '/login',
            title: 'shll | login',
            activate: 'login',
            template: '/html/templates/login.html'
        }).route({
            path: '/admin',
            title: 'shll | admin',
            activate: 'admin',
            auth_template: '/html/templates/auth/admin.html'
        }).route({
            path: '/register',
            title: 'shll | register',
            activate: 'admin',
            auth_template: '/html/templates/auth/register.html'
        })
        /*
            ERROR
         */
        .missing({
            title: 'shll | 404',
            template: '/html/errors/404.html'
        });
})();