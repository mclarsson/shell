(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory(root));
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.Application = factory(root);
    }
})(typeof global !== 'undefined' ? global : this.window || this.global, function(root) {

    'use strict';

    //////////////
    // Settings //
    //////////////

    /**
     * Default information and settings for  application
     * @type {Object}
     */
    var _this = {};

    /**
     * Initiates application
     */
    var init = function() {

        _this = {
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

        // Initiate methods & objects
        
        Router.init();
    };

    // Initiate application when all js has loaded
    window.addEventListener ? addEventListener("load", init, false) : window.attachEvent ? attachEvent("onload", init) : (onload = init);

    ///////////////////////////////
    // Private methods & objects //
    ///////////////////////////////

    /**
     * Sets content on page.
     * @param {String} html html content to be displayed.
     */
    var setContent = function(html) {
        _this.container.innerHTML = html;

        // Add doc_root to form actions
        for (var i = 0; i < document.forms.length; i++) {
            document.forms[i].action = _this.doc_root + document.forms[i].getAttribute('action');
        }
    };

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
         * Initiates Router
         */
        init: function() {
            this.update();

            // Add event handlers to all links on page
            var self = this;
            for (var i = 0; i < document.links.length; i++) {
                document.links[i].addEventListener('click', function(e) {
                    // Check if links href is registered
                    if (self.process(this)) {
                        // Prevent page from reloading
                        e.preventDefault();
                    }
                });
            }

            // Handle back and forward button presses
            window.addEventListener('popstate', function(e) {
                self.update();
            });
        },

        /**
         * Updates Router to current path
         */
        update: function() {
            var path = location.pathname.replace(_this.doc_root, '');
            if (this.current != path) {
                this.current = path;
                for (var i = 0; i < this.routes.length; i++) {
                    if (this.routes[i].path === this.current) {
                        this.render(this.routes[i]);
                        break;
                    }
                }
            }
        },

        /**
         * Navigates to and renders link if it's registered.
         * @param  {Element} link Clicked link
         * @return {Boolean}      Link registered
         */
        process: function(link) {
            var href = link.getAttribute('href');
            // Check if href is a registered path
            for (var i = 0; i < this.routes.length; i++) {
                if (this.routes[i].path === href) {
                    // Don't reload same page
                    if (href != this.current) {
                        // Check if html5 navigation is supported
                        if (history.pushState) {
                            history.pushState(null, null, _this.doc_root + href);
                        } else {
                            // html5 navigation is not supported
                            location.assign(_this.doc_root + href);
                        }

                        this.current = href;
                        this.render(this.routes[i]);
                    }
                    return true;
                }
            }
            return false;
        },

        /**
         * Retrieves route templates and fires callback.
         * @param  {Object} route Route to be rendered
         */
        render: function(route) {
            http.get(_this.doc_root + route.template)
                .then(function(response) {
                    setContent(response);
                });

            if (typeof route.callback === 'function') {
                route.callback();
            }
        },

        /**
         * Register new route.
         * @param {String}   path     Path to watch for
         * @param {String}   template Path to html to be rendered
         * @param {Function} callback Callback to be fired when rendered
         */
        add: function(path, template, callback) {
            this.routes.push({
                path: path,
                template: template,
                callback: callback
            });
        }
    };

    /**
     * Makes AJAX calls.
     * @type {Object}
     */
    var http = {
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
            if (parameters) {
                url += this.encodeParams(parameters);
            }
            this.xhr = new XMLHttpRequest();
            this.xhr.open('GET', encodeURI(url), true);
            this.xhr.send();
            return this;
        },

        /**
         * Provides callback for requests.
         * @param  {Function} callback Callback for request.
         */
        then: function(callback) {
            this.xhr.onload = function() {
                callback(this.response);
            };
        }
    };

    /////////
    // API //
    /////////

    /**
     * Object holding the API.
     * @type {Object}
     */
    var Application = {};

    /**
     * Register a path with html and callback to be rendered when path is visited.
     * @param  {String}   path     Path to watch for
     * @param  {String}   template Path to html template to be rendered
     * @param  {Function} callback Function to be fired off when page has been rendered
     * @return {Application}       Return self for linking
     */
    Application.when = function(path, template, callback) {
        var fn = typeof callback === 'function' ? function() {
            callback();
        } : null;
        Router.add(path, template, fn);
        return this;
    };

    /**
     * Makes get request.
     * @param  {String} url        URL to be called.
     * @param  {Object} parameters Parameters to send along with url.
     * @return {http}              Enables callbacks and chaining.
     */
    Application.get = function(url, parameters) {
        return http.get(_this.doc_root + url, parameters);
    };

    return Application;
});