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
     * Default settings for application
     * @type {Object}
     */
    var settings = {};

    /**
     * Initiates application
     */
    var init = function() {

        // Set default settings
        settings = {
            // Div holding page content
            content: document.getElementById('content'),
            // Document root for application
            base: document.getElementsByName('doc_root')[0].content
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
            this.current = location.pathname;
            for (var i = 0; i < this.routes.length; i++) {
                if (settings.base + this.routes[i].path === this.current) {
                    this.render(this.routes[i]);
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
                            history.pushState(null, null, settings.base + href);
                        } else {
                            // html5 navigation is not supported
                            location.assign(settings.base + href);
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
            http.get(settings.base + route.template)
                .then(function(response) {
                    settings.content.innerHTML = response;
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

    var http = {
        concatParameters: function(params) {
            var n = Object.keys(params).length,
                i = 1,
                string = '?';

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
        get: function(url, parameters) {
            if (parameters) {
                url += this.concatParameters(parameters);
            }

            this.xhr = new XMLHttpRequest();
            this.xhr.open('GET', url, true);
            this.xhr.send();
            return this;
        },
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

    Application.get = function(url, parameters) {
        return http.get(settings.base + url, parameters);
    };

    return Application;
});