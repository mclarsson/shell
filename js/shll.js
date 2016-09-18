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
    var settings = {};
    /**
     * Initiates shll
     */
    function init() {
        settings = {
            /**
             * Div containing page content.
             * @type {Element}
             */
            container: document.getElementById('content'),
            /**
             * Name of server hosting app
             * @type {String}
             */
            server_name: document.getElementsByName('server_name')[0].content || '',
            /**
             * Root path of app (/sub/ instead of just /).
             * @type {String}
             */
            doc_root: document.getElementsByName('doc_root')[0].content || '',
            /**
             * Character to denote paramater in path.
             * @type {String}
             */
            uri_required_param_indicator: '&',
            /**
             * Character to denote paramater in path but parameter not required.
             * @type {String}
             */
            uri_optional_param_indicator: '?',
            /**
             * Character to replace blank space in URIs.
             * @type {String}
             */
            uri_space_replacement: '-',
            /**
             * Character to replace uri_space_replacement if present.
             * @type {String}
             */
            uri_space_standin: '_',
            /**
             * URI to template api call.
             * @type {String}
             */
            template_uri: '/api/template',
            /**
             * URI to authenticated template api call.
             * @type {String}
             */
            auth_template_uri: '/auth/template'
        };
        router.init();
    };
    // Initiate app when all js has loaded
    window.addEventListener ? addEventListener("load", init, false) : window.attachEvent ? attachEvent("onload", init) : (onload = init);
    ////////////////////////////////////
    // Private objects and functions  //
    ////////////////////////////////////
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
         * Route object for 404 error handling.
         * @type {Object}
         */
        var route_404;
        /**
         * Links that are currently being listened to.
         * @type {Array}
         */
        var links = [];
        /**
         * Current uri.
         * @type {String}
         */
        var current_uri = '';
        /**
         * Current route object.
         * @type {Object}
         */
        var current_route = {};
        /**
         * Previous route object.
         * @type {Object}
         */
        var prev_route = {};
        return {
            /**
             * Initiates router
             */
            init: function() {
                // Handle initial page load
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
                var path = document.location.pathname.replace(settings.doc_root, '');
                if (current_uri !== path) {
                    current_uri = path;
                    prev_route = current_route;
                    current_route = this.match(path);
                    if (current_route) {
                        this.render(current_route);
                    } else {
                        this.handleNoMatch();
                    }
                }
                return this;
            },
            /**
             * Checks to see if path is on server, renders 404.
             */
            handleNoMatch: function() {
                var path_origin = document.location.hostname;
                if (path_origin === settings.server_name) {
                    if (typeof route_404 !== 'undefined') {
                        this.render(route_404);
                    } else {
                        this.render(routes[0]);
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
                    if (links[i] === link) {
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
                    if (href !== current_uri) {
                        this.set(href).update();
                    }
                    return true;
                }
                return false;
            },
            /**
             * Sets the path to new href.
             * @param {String} href New URI.
             */
            set: function(href) {
                if (history.pushState) {
                    // html5 navigation
                    history.pushState(null, null, settings.doc_root + href);
                } else {
                    location.assign(settings.doc_root + href);
                }
                return this;
            },
            /**
             * Checks if uri matches with any registered routes and returns match if found or false otherwise.
             * @param  {String} uri URI to compare with routes.
             * @return {Object|Boolean}      Registered route with parameters or didn't match any registered routes.
             */
            match: function(uri) {
                var path = uri.split('/');
                loop: for (var i = 0, len = routes.length; i < len; i++) {
                    var registered = routes[i].path.split('/'),
                        n = registered.length,
                        params = {};
                    for (var part = 0; part < n; part++) {
                        if (registered[part].charAt(0) === settings.uri_required_param_indicator) {
                            // Is required parameter
                            if (path.length === n) {
                                params[registered[part].substring(1)] = fromURI(path[part]);
                            } else {
                                continue loop;
                            }
                        } else if (registered[part].charAt(0) === settings.uri_optional_param_indicator) {
                            // Is optional parameter
                            params[registered[part].substring(1)] = fromURI(path[part]) || '';
                        } else if (registered[part] !== path[part]) {
                            // Doesn't match
                            continue loop;
                        }
                    }
                    // Loop through GET variables (example.com?variable=value)
                    var search = document.location.search.substring(1);
                    if (typeof search !== 'undefined') {
                        var GET = search.substr(uri.indexOf('?') + 1);
                        var GET_array = GET.split('&');
                        for (var g = 0; g < GET_array.length; g++) {
                            if (GET_array[g].indexOf('=') !== -1) {
                                var variable = GET_array[g].split('=');
                                params[variable[0]] = variable[1];
                            }
                        }
                    }
                    var match = routes[i];
                    match['params'] = params;
                    return match;
                }
                return false;
            },
            /**
             * Handles rendering of route.
             * @param  {Object} route Route to be rendered.
             */
            render: function(route) {
                var route = route;

                var render_callback = function() {
                    if (typeof route.callback === 'function') {
                        route.callback.call(shll, route.params);
                    }
                    if (typeof prev_route.offload === 'function' && prev_route.path !== route.path) {
                        prev_route.offload.call(shll, route.params);
                    }
                    if (typeof route.title === 'string') {
                        shll.title(route.title);
                    }
                    if (typeof route.activate === 'string') {
                        var links = document.querySelectorAll('nav a');
                        for (var i = 0; i < links.length; i++) {
                            if (links[i].id === route.activate) {
                                links[i].className = 'active';
                            } else {
                                links[i].className = '';
                            }
                        }
                    }
                }

                if (typeof route.template === 'string') {
                    html.render(route.template, route.force)
                        .then(render_callback);
                } else if (typeof route.auth_template === 'string') {
                    var xhr = new http();
                    xhr.get(settings.doc_root + settings.auth_template_uri, {
                        path: route.auth_template
                    }).then(function(response) {
                        html.set(response);
                        render_callback();
                    });
                }
                return this;
            },
            /**
             * Registers new route.
             * @param {String}   route  Route Object
             */
            add: function(route) {
                routes.push(route);
            },
            /**
             * Set new error route.
             * @param {String}   route  Route Object
             */
            addErrorRoute: function(error, route) {
                if (error === '404') {
                    route_404 = route;
                }
            }
        }
    })();
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

                    xhr.get(settings.doc_root + settings.template_uri, {
                        path: file
                    }).then(function(response) {
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
                settings.container.innerHTML = html;
                // Add doc_root to form actions
                for (var i = 0, len = document.forms.length; i < len; i++) {
                    document.forms[i].action = settings.doc_root + document.forms[i].getAttribute('action');
                }
                // fill out csrf tokens
                var csrf_tokens = document.querySelectorAll('input[name$="csrf_token"]');
                var csrf_meta = document.querySelector('meta[name$="csrf_token"]');
                for (var i = 0, len = csrf_tokens.length; i < len; i++) {
                    csrf_tokens[i].value = csrf_meta.content;
                }

                // Listen to async post forms
                var forms = document.querySelectorAll('[async_form]');
                for (var i = 0, len = forms.length; i < len; i++) {
                    (function() {
                        var form = forms[i];
                        var uri = form.getAttribute('uri');
                        var method = form.getAttribute('method');
                        var submit = form.querySelector('input[type=submit]');

                        listen(submit, 'click', function() {
                            var inputs = form.querySelectorAll('input:not([type=submit]), textarea');
                            var parameters = {};
                            for (var j = 0, inp = inputs.length; j < inp; j++) {
                                parameters[inputs[j].name] = inputs[j].value;
                            }
                            if (method === 'get') {
                                shll.get(uri, parameters)
                                    .then(function(response) {
                                        displayMessage(response);
                                    });
                            } else if (method === 'post') {
                                shll.post(uri, parameters)
                                    .then(function(response) {
                                        displayMessage(response);
                                    });
                            }
                        });
                    })();
                }
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
                return this;
            },
            /**
             * Performs POST request on provided url.
             * @param  {String} url        URL to be called.
             * @param  {Object} parameters Parameters to send along with url.
             * @return {http}              Self.
             */
            post: function(url, parameters) {
                var self = this;
                if (parameters) {
                    // Remove ? from beginning of parameters
                    parameters = this.encodeParams(parameters).substring(1);
                }
                xhr = new XMLHttpRequest();

                xhr.open('POST', encodeURI(url), true);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr.send(parameters);
                xhr.onload = function() {
                    self.unload(this.response);
                };
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

    function displayMessage(message) {
        var board = document.getElementById('message-board');
        var div = document.createElement('div');
        div.className = 'message';
        div.innerHTML = message;
        board.appendChild(div);
        window.setTimeout(function(){
            div.remove();
        }, 4000);
    };
    /**
     * Encodes string into uri with special characters from settings.
     * @param  {String} string String to be encoded.
     * @return {String}        Encoded string.
     */
    function toURI(string) {
        if (string === '' || typeof string !== 'string') return false;
        string = string.trim();
        //string = string.replace('?', '%3f');
        string = string.split(settings.uri_space_replacement).join(settings.uri_space_standin);
        string = string.split(' ').join(settings.uri_space_replacement);
        string = encodeURI(string).replace('?', '%3f').replace('&', '%26');
        return string;
    }
    /**
     * Decodes special uri encoded by toURI.
     * @param  {String} uri URI to be decoded
     * @return {String}     Decoded uri.
     */
    function fromURI(uri) {
        if (uri === '' || typeof uri !== 'string') return false;
        uri = uri.split(settings.uri_space_replacement).join(' ');
        uri = uri.split(settings.uri_space_standin).join(settings.uri_space_replacement);
        uri = decodeURI(uri).replace('%3f', '?').replace('%26', '&');
        return uri;
    }
    /////////
    // API //
    /////////
    var shll = {
        /**
         * Register a path with html and callback to be rendered when visited.
         * @param  {String}   route    Route object
         * @return {shll}              Return self for linking
         */
        route: function(route) {
            /*
            Route Object
            {
                path:           URI to look for,
                title:          Title which will be set on render, 
                template:       Path to html template to be rendered,
                auth_template:  Path to html template to be rendered (login required),
                callback:       Function to be fired off when page has been rendered,
                offload:        Function to be called when exiting route,
                force:          Force reload of template
            }
             */
            router.add(route);
            return this;
        },
        /**
         * Register a path with html and callback to be rendered when 404 error is thrown.
         * @param  {String}   route    Route object
         * @return {shll}              Return self for linking
         */
        missing: function(route) {
            router.addErrorRoute('404', route);
            return this;
        },
        /**
         * Set url to new href.
         * @param  {String} href New url.
         * @return {shll}        Return self for linking
         */
        navigate: function(href) {
            router.set(href).update();
            return this;
        },
        /**
         * Makes GET request.
         * @param  {String} url        URL to be called.
         * @param  {Object} parameters Parameters to send along with url.
         * @return {http}              Enables callbacks and chaining.
         */
        get: function(url, parameters) {
            var xhr = new http();
            xhr.get(settings.doc_root + url, parameters);
            return xhr;
        },
        /**
         * Makes POST request.
         * @param  {String} url        URL to be called.
         * @param  {Object} parameters Parameters to send along with url.
         * @return {http}              Enables callbacks and chaining.
         */
        post: function(url, parameters) {
            var xhr = new http();
            xhr.post(settings.doc_root + url, parameters);
            return xhr;
        },
        /**
         * Updates router links.
         * @return {shll} Enables callbacks and linking.
         */
        digest: function() {
            router.listen();
            return this;
        },
        /**
         * Updates router.
         * @return {shll} Enables callbacks and linking.
         */
        update: function() {
            router.update();
            return this;
        },
        /**
         * Adds event listener to element.
         * @param  {Element}  element  Node to add event listener to.
         * @param  {String}   event    Event to listen for.
         * @param  {Function} callback Callback to be fired.
         * @return {Object}            Return self for linking.
         */
        listen: function(element, event, callback) {
            listen(element, event, callback);
            return this;
        },
        /**
         * Returns encoded uri.
         * @param  {String} string String to be encoded.
         * @return {String}        Encoded uri. 
         */
        uri: function(string) {
            return toURI(string);
        },
        /**
         * Returns decoded uri.
         * @param  {String} uri URI to be decoded.
         * @return {String}     Decoded uri.
         */
        decodeURI: function(uri) {
            return fromURI(uri);
        },
        /**
         * Sets the title of the page.
         * @param  {String} title New title
         * @return {Object}       Return self for linking.
         */
        title: function(title) {
            document.title = title;
        },
        /**
         * Sets the content on the page.
         * @param {String} html Content to be set.
         * @return {Object}     Return self for linking.
         */
        setContent: function(content) {
            html.set(content);
            return this;
        }
    };
    return shll;
});
////////////
// Create //
////////////
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory(root));
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.create = factory(root);
    }
})(typeof global !== 'undefined' ? global : this.window || this.global, function(root) {
    /**
     * Creates DOM element and returns tools for altering.
     * @param  {String} type Type of element.
     * @return {Object}      Methods for altering element.
     */
    var create = function(type, callback) {
        var element = document.createElement(type),
            functions = {
                /**
                 * Adds child node to element.
                 * @param  {String}   type     Type of child node.
                 * @param  {Function} callback Fires if set.
                 * @return {Object}            Returns self for linking.
                 */
                append: function(type, callback) {
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
                 * @return {Object}       Return self for linking.
                 */
                appendTo: function(node) {
                    node.appendChild(element);
                    return this;
                },
                /**
                 * Adds event listener to element.
                 * @param  {String}   event    Event to listen for.
                 * @param  {Function} callback Callback to be fired.
                 * @return {Object}            Return self for linking.
                 */
                listen: function(event, callback) {
                    shll.listen(element, event, callback);
                    return this;
                },
                /**
                 * Adds class to created element
                 * @param {String} class Name of class.
                 * @return {Object}      Return self for linking.
                 */
                addClass: function(name) {
                    element.classList.add(name);
                    return this;
                }
            };
        if (typeof callback === 'function') {
            callback.call(element);
        }
        return functions;
    }
    return create;
});