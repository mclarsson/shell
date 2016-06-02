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
    function init() {
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
            doc_root: document.getElementsByName('doc_root')[0].content,
            
            /**
             * Character to denote paramater in path
             * @type {String}
             */
            uri_param_indicator: '?'
        };

        router.init();
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
    function listen(el, ev, fn) {
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
    var html = (function() {
        /**
         * Current template being displayed.
         * @type {String}
         */
        var current = '';

        return {
            
            /**
             * Render template if it's not the current.
             * @param  {String} file path to template to be rendered.
             * @param  {Boolean} force load new template despite it being current.
             * @return {http}        Enables more callbacks to be added.
             */
            render: function(file, force) {
                var xhr = new http();
                // Don't render same template again
                if (current === file && !force) {
                    // Still fire off callbacks
                    xhr.unload();
                } else {
                    var self = this;
                    xhr.get(application.doc_root + file).then(function(response) {
                        current = file;
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
                for (var i = 0, len = document.forms.length; i < len; i++) {
                    document.forms[i].action = application.doc_root + document.forms[i].getAttribute('action');
                }
                router.listen();
            }
        }
    })();
    
    /**
     * Handles navigation through Ajax.
     * @type {Object}
     */
    var router = (function() {
        
        /**
         * Holder for registered routes.
         * @type {Array}
         */
        var routes = [];
        
        /**
         * Links that are currently being listened to.
         * @type {Array}
         */
        var links = [];
        
        /**
         * Current uri
         * @type {String}
         */
        var current = '';

        return {
            /**
             * Initiates router
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
             * Updates router to current path
             */
            update: function() {
                var path = document.location.pathname.replace(application.doc_root, '');
                if (current !== path) {
                    current = path;
                    var route = this.match(path);
                    if (route) {
                        this.render(route);
                    }
                }
            },
            
            /**
             * Adds event listeners to links which match with registered routes.
             */
            listen: function() {
                var self = this,
                    href = '',
                    route = {},
                    listens = false;
                for (var i = 0, len = document.links.length; i < len; i++) {
                    href = document.links[i].getAttribute('href');
                    route = this.match(href);
                    listens = this.listensTo(document.links[i]);
                    if (route && !listens) {
                        listen(document.links[i], 'click', function(e) {
                            if (self.process(this)) {
                                // Prevent page from reloading
                                e.preventDefault();
                            }
                        });
                        // Register link
                        links.push(document.links[i]);
                    }
                }
            },
            
            /**
             * Determiness if a link is already being listened to.
             * @param  {Element} link Link to be checked.
             * @return {Boolean}      If the link is registered
             */
            listensTo: function(link) {
                for (var i = 0, len = links.length; i < len; i++) {
                    if (links[i] === link || links[i].isSameNode(link)) {
                        return true;
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
                var href = link.getAttribute('href'),
                    route = this.match(href);
                if (route) {
                    // Don't reload same route
                    if (href !== current) {
                        if (history.pushState) {
                            // html5 navigation
                            history.pushState(null, null, application.doc_root + href);
                        } else {
                            location.assign(application.doc_root + href);
                        }
                        current = href;
                        this.render(route);
                    }
                    return true;
                }
                return false;
            },
            
            /**
             * Checks if uri matches with any registered routes and returns match if found or false otherwise.
             * @param  {String} uri URI to compare with routes.
             * @return {Object|Boolean}      Registered route with parameters or didn't match any registered routes.
             */
            match: function(uri) {
                var path = uri.split('/'),
                    len = routes.length,
                    i;
                loop: for (i = 0; i < len; i++) {
                    var route = routes[i].path.split('/');
                    // Same number of parts
                    if (route.length === path.length) {
                        var params = {},
                            n = route.length,
                            part;
                        for (part = 0; part < n; part++) {
                            // Check if part is parameter
                            if (route[part].charAt(0) === application.uri_param_indicator) {
                                params[route[part].substring(1)] = path[part];
                            } else if (route[part] !== path[part]) {
                                // Doesn't match
                                continue loop;
                            }
                        }
                        var match = routes[i];
                        match.params = params;
                        return match;
                    }
                }
                return false;
            },
            
            /**
             * Handles rendering of route.
             * @param  {Object} route Route to be rendered.
             */
            render: function(route) {
                html.render(route.template, route.force).then(function() {
                    if (typeof route.callback === 'function') {
                        route.callback.call(shll, route.params);
                    }
                });
            },
            
            /**
             * Registers new route.
             * @param {String}   path     URI to watch for.
             * @param {String}   template URI to html to be rendered.
             * @param {Function} callback Callback to be fired when rendered.
             * @param {Boolean}  force    Load template even if it's the current one being displayed.
             */
            add: function(path, template, callback, force) {
                routes.push({
                    path: path,
                    template: template,
                    callback: callback,
                    force: force
                });
            }
        }
    })();
    
    /**
     * Makes AJAX calls.
     * @type {Object}
     */
    function http() {
        /**
         * Keep track of callbacks.
         * @type {Array}
         */
        var callbacks = [];
        
        /**
         * Private XMLHttpRequest
         * @type {XMLHttpRequest}
         */
        var xhr;
        
        return {
            /**
             * Concatenates parameters into url appropriate string.
             * @param  {Object} params Object with parameters to be encoded.
             * @return {String}        Paramaters in string form.
             */
            encodeParams: function(params) {
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
                xhr = new XMLHttpRequest();
                xhr.open('GET', encodeURI(url), true);
                xhr.send();
                xhr.onload = function() {
                    self.unload(this.response);
                };
                callbacks = [];
                return this;
            },
            
            /**
             * Adds function to list of callbacks fired off when request finished.
             * @param  {Function} callback Callback for request.
             */
            then: function(callback) {
                callbacks.push(callback);
                return this;
            },
            
            /**
             * Fires of all callbacks and resets callback Array.
             */
            unload: function(args) {
                var self = this;
                // Workaround, makes it so that callbacks always fires last in method link.
                window.setTimeout(function() {
                    for (var i in callbacks) {
                        callbacks[i].call(shll, args);
                    }
                    callbacks = [];
                    shll.digest();
                }, 0);
            }
        };
    };

    /////////
    // API //
    /////////
    
    var shll = {  
        /**
         * Register a path with html and callback to be rendered when visited.
         * @param  {String}   path     Path to watch for
         * @param  {String}   template Path to html template to be rendered
         * @param  {Function} callback Function to be fired off when page has been rendered
         * @param  {Boolean}  force    Load template even if its the current one being displayed.
         * @return {shll}              Return self for linking
         */
        when: function(path, template, callback, force) {
            router.add(path, template, callback, force);
            return this;
        },
        
        /**
         * Makes get request.
         * @param  {String} url        URL to be called.
         * @param  {Object} parameters Parameters to send along with url.
         * @return {http}              Enables callbacks and chaining.
         */
        get: function(url, parameters) {
            var xhr = new http();
            xhr.get(application.doc_root + url, parameters);
            return xhr;
        },
        
        /**
         * Updates application.
         * @return {shll} Enables callbacks and linking.
         */
        digest: function() {
            router.listen();
            return this;
        },

        
        /**
         * Creates DOM element and returns tools for altering.
         * @param  {String} type Type of element.
         * @return {Object}      Methods for altering element.
         */
        create: function(type) {
            var element = document.createElement(type),
                object = {
                    
                    /**
                     * Adds child node to element.
                     * @param  {String}   type     Type of child node.
                     * @param  {Function} callback Fires if set.
                     * @return {Object}            Returns self for linking.
                     */
                    insert: function(type, callback) {
                        var child = document.createElement(type);
                        element.appendChild(child);
                        if (typeof callback === 'function') {
                            callback.call(child);
                        }
                        return this;
                    },
                    
                    /**
                     * Appends this element to another.
                     * @param  {Element} node Parent node.
                     */
                    appendTo: function(node) {
                        node.appendChild(element);
                    }
                };

            return object;
        }
    };
    return shll;
});