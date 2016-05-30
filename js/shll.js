(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory(root));
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.shll = factory(root);
    }
})(typeof global !== 'undefined' ? global : this.window || this.global, function(root) {

    'use strict';

    //////////////
    // Settings //
    //////////////

    /**
     * Default information and settings
     * @type {Object}
     */
    var application = {};

    /**
     * Initiates application
     */
    var init = function() {
        application = {
            /**
             * Div containing page content.
             * @type {Element}
             */
            container: document.getElementById('content'),

            /**
             * Root path of application (perhaps /blog/ instead of just /).
             * @type {String}
             */
            doc_root: document.getElementsByName('doc_root')[0].content
        };

        Router.init();
    };

    // Initiate application when all js has loaded
    window.addEventListener ? addEventListener("load", init, false) : window.attachEvent ? attachEvent("onload", init) : (onload = init);

    ///////////////////////////////
    // Private methods & objects //
    ///////////////////////////////

    /**
     * Adds event listener to element.
     * @param  {Element}  el Element to add to.
     * @param  {String}   ev Type of event.
     * @param  {Function} fn Callback.
     */
    var listen = function(el, ev, fn) {
        if (el.attachEvent) {
            el['e' + ev + fn] = fn;
            el[ev + fn] = function() {
                el['e' + ev + fn](window.event);
            }
            el.attachEvent('on' + ev, el[ev + fn]);
        } else {
            el.addEventListener(ev, fn, false);
        }
    };

    /**
     * Display content on screen.
     * @type {Object}
     */
    var html = {
        /**
         * Current template being displayed.
         * @type {String}
         */
        current: '',

        /**
         * Render template if it's not the current.
         * @param  {String} file path to template to be rendered.
         * @param  {Boolean} force load new template despite it being current.
         * @return {http}        Enables more callbacks to be added.
         */
        render: function(file, force) {
            var xhr = new http();
            // Don't render same template again
            if (this.current === file && !force) {
                // Still fire off callbacks
                xhr.unload();
            } else {
                var self = this;
                xhr.get(application.doc_root + file)
                    .then(function(response) {
                        self.current = file;
                        self.set(response);
                    });
            }
            return xhr;
        },

        /**
         * Sets content on page.
         * @param {String} html html content to be displayed.
         */
        set: function(html) {
            application.container.innerHTML = html;

            // Add doc_root to form actions
            var i = document.forms.length;
            while (i--) {
                document.forms[i].action = application.doc_root + document.forms[i].getAttribute('action');
            }

            Router.listen();
        }
    }

    /**
     * Handles navigation through Ajax.
     * @type {Object}
     */
    var Router = {
        /**
         * Holder for registered routes.
         * @type {Array}
         */
        routes: [],

        /**
         * Current path name
         * @type {String}
         */
        current: '',

        /**
         * Links that are currently being listened to.
         * @type {Array}
         */
        links: [],

        /**
         * Initiates Router
         */
        init: function() {
            this.update();

            // Handle back and forward button presses
            var self = this;
            listen(window, 'popstate', function(e) {
                self.update();
            });
        },

        /**
         * Updates Router to current path
         */
        update: function() {
            var path = document.location.pathname.replace(application.doc_root, '');
            if (this.current != path) {
                this.current = path;
                var route = this.match(path);
                if (route) {
                    this.render(route);
                }
            }
        },

        /**
         * Adds event listeners to link, enables navigation.
         */
        listen: function() {
            var self = this;
            var i = document.links.length;
            while (i--) {
                var route = this.match(document.links[i].getAttribute('href'));
                var listens = this.listensTo(document.links[i]);
                // Only add listeners to registered route and unregistered link
                if (route && !listens) {
                    listen(document.links[i], 'click', function(e) {
                        if (self.process(this)) {
                            // Prevent page from reloading
                            e.preventDefault();
                        }
                    });
                    // Register link
                    this.links.push(document.links[i]);
                }
            }
        },

        /**
         * Determine if a link is already being listened to.
         * @param  {Element} link Link to be checked.
         * @return {Boolean}      If the link is registered
         */
        listensTo: function(link) {
            if (this.links.length) {
                var i = this.links.length;
                while (i--) {
                    if (this.links[i] === link || this.links[i].isSameNode(link)) {
                        return true;
                    }
                }
            }
            return false;
        },

        /**
         * Navigates to and renders link if it's registered.
         * @param  {Element} link Clicked link
         * @return {Boolean}      Link registered
         */
        process: function(link) {
            var href = link.getAttribute('href');
            var route = this.match(href);

            if (route) {
                // Don't reload same page
                if (href != this.current) {
                    // Check if html5 navigation is supported
                    if (history.pushState) {
                        history.pushState(null, null, application.doc_root + href);
                    } else {
                        // html5 navigation is not supported
                        location.assign(application.doc_root + href);
                    }

                    this.current = href;
                    this.render(route);
                }
                return true;
            }
            return false;
        },

        /**
         * Finds route if it is registered
         * @param  {String} path Destination
         * @return {Object}      Registered route with parameters
         */
        match: function(path) {
            var match = path.split('/');
            var i = this.routes.length;
            routes:
                while (i--) {
                    var route = this.routes[i].path.split('/');
                    if (route.length === match.length) {

                        var params = {},
                            object = {},
                            j = route.length;

                        while (j--) {
                            if (route[j].charAt(0) === '?') {
                                var name = route[j].substring(1);
                                params[name] = match[j];
                            } else if (route[j] != match[j]) {
                                continue routes;
                            }
                        }

                        object = this.routes[i];
                        object.params = params;
                        return object;
                    }
                }
            return false;
        },

        /**
         * Retrieves route templates and fires callback.
         * @param  {Object} route Route to be rendered
         */
        render: function(route) {
            html.render(route.template, route.force)
                .then(function() {
                    if (typeof route.callback === 'function') {
                        route.callback(route.params);
                    }
                });
        },

        /**
         * Register new route.
         * @param {String}   path     Path to watch for
         * @param {String}   template Path to html to be rendered
         * @param {Function} callback Callback to be fired when rendered
         * @param {Boolean}  force    Load template even if its the current one being displayed.
         */
        add: function(path, template, callback, force) {
            this.routes.push({
                path: path,
                template: template,
                callback: callback,
                force: force
            });
        }
    };

    /**
     * Makes AJAX calls.
     * @type {Object}
     */
    function http() {
        return {
            /**
             * Keep track of callbacks.
             * @type {Array}
             */
            callbacks: [],

            /**
             * Concatenates parameters into url appropriate string.
             * @param  {Object} params Object with parameters to be encoded.
             * @return {String}        Paramaters in string form.
             */
            encodeParams: function(params) {
                var n = Object.keys(params).length;
                var i = 1;
                var string = '?';

                for (var param in params) {
                    if (params.hasOwnProperty(param)) {
                        string += param + '=' + params[param];
                        if (i < n) {
                            string += '&';
                        }
                        i++;
                    }
                }

                return string;
            },

            /**
             * Performs GET request on provided url.
             * @param  {String} url        URL to be called.
             * @param  {Object} parameters Parameters to send along with url.
             * @return {http}              Self.
             */
            get: function(url, parameters) {
                var self = this;
                if (parameters) {
                    url += this.encodeParams(parameters);
                }
                this.xhr = new XMLHttpRequest();
                this.xhr.open('GET', encodeURI(url), true);
                this.xhr.send();

                this.xhr.onload = function() {
                    self.unload(this.response);
                };
                this.callbacks = [];
                return this;
            },

            /**
             * Adds function to list of callbacks fired off when request finished.
             * @param  {Function} callback Callback for request.
             */
            then: function(callback) {
                this.callbacks.push(callback);
            },

            /**
             * Fires of all callbacks and resets callback Array.
             */
            unload: function(args) {
                var self = this;
                // Workaround, makes it so that callbacks always fires last in method link.
                window.setTimeout(function() {
                    for (var i in self.callbacks) {
                        self.callbacks[i](args);
                    }
                    this.callbacks = [];
                }, 0);
            }
        };
    };

    /////////
    // API //
    /////////

    /**
     * Object holding the API.
     * @type {Object}
     */
    var shll = {
        router: Router,
        http: http,
        html: html
    };

    /**
     * Register a path with html and callback to be rendered when path is visited.
     * @param  {String}   path     Path to watch for
     * @param  {String}   template Path to html template to be rendered
     * @param  {Function} callback Function to be fired off when page has been rendered
     * @param  {Boolean}  force    Load template even if its the current one being displayed.
     * @return {shll}              Return self for linking
     */
    shll.when = function(path, template, callback, force) {
        Router.add(path, template, callback, force);
        return this;
    };

    /**
     * Makes get request.
     * @param  {String} url        URL to be called.
     * @param  {Object} parameters Parameters to send along with url.
     * @return {http}              Enables callbacks and chaining.
     */
    shll.get = function(url, parameters) {
        var xhr = new http();
        xhr.get(application.doc_root + url, parameters);
        return xhr;
    };

    return shll;
});