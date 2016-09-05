/**
 * Implementation of standard Array methods (introduced in ECMAScript 5th
 * edition) and shorthand generics (JavaScript 1.8.5)
 *
 * Copyright (c) 2013 Alex K @plusdude
 * http://opensource.org/licenses/MIT
 */
(function(global, infinity, undefined) {
    /*jshint bitwise:false, maxlen:95, plusplus:false, validthis:true*/
    "use strict";

    /**
     * Local references to constructors at global scope.
     * This may speed up access and slightly reduce file size of minified version.
     */
    var Array = global.Array;
    var Object = global.Object;
    var Math = global.Math;
    var Number = global.Number;

    /**
     * Converts argument to an integral numeric value.
     * @see http://www.ecma-international.org/ecma-262/5.1/#sec-9.4
     */
    function toInteger(value) {
        var number;

        // let number be the result of calling ToNumber on the input argument
        number = Number(value);
        return (
            // if number is NaN, return 0
            number !== number ? 0 :

            // if number is 0, Infinity, or -Infinity, return number
            0 === number || infinity === number || -infinity === number ? number :

            // return the result of computing sign(number) * floor(abs(number))
            (0 < number || -1) * Math.floor(Math.abs(number))
        );
    }

    /**
     * Returns a shallow copy of a portion of an array.
     * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.10
     */
    function slice(begin, end) {
        /*jshint newcap:false*/
        var result, elements, length, index, count;

        // convert elements to object
        elements = Object(this);

        // convert length to unsigned 32 bit integer
        length = elements.length >>> 0;

        // calculate begin index, if is set
        if (undefined !== begin) {

            // convert to integer
            begin = toInteger(begin);

            // handle -begin, begin > length
            index = 0 > begin ? Math.max(length + begin, 0) : Math.min(begin, length);
        } else {
            // default value
            index = 0;
        }
        // calculate end index, if is set
        if (undefined !== end) {

            // convert to integer
            end = toInteger(end);

            // handle -end, end > length
            length = 0 > end ? Math.max(length + end, 0) : Math.min(end, length);
        }
        // create result array
        result = new Array(length - index);

        // iterate over elements
        for (count = 0; index < length; ++index, ++count) {

            // current index exists
            if (index in elements) {

                // copy current element to result array
                result[count] = elements[index];
            }
        }
        return result;
    }

    /**
     * Returns the first index at which a given element
     * can be found in the array.
     * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.14
     */
    function indexOf(target, begin) {
        /*jshint newcap:false*/
        var elements, length, index;

        // convert elements to object
        elements = Object(this);

        // convert length to unsigned 32 bit integer
        length = elements.length >>> 0;

        // calculate begin index, if is set
        if (undefined !== begin) {

            // convert to integer
            begin = toInteger(begin);

            // handle -begin, begin > length
            index = 0 > begin ? Math.max(length + begin, 0) : Math.min(begin, length);
        } else {
            // default value
            index = 0;
        }
        // iterate over elements
        for (; index < length; ++index) {

            // current index exists, target element is equal to current element
            if (index in elements && target === elements[index]) {

                // break loop, target element found
                return index;
            }
        }
        // target element not found
        return -1;
    }

    /**
     * Returns the last index at which a given element
     * can be found in the array.
     * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.15
     */
    function lastIndexOf(target, begin) {
        /*jshint newcap:false*/
        var elements, length, index;

        // convert elements to object
        elements = Object(this);

        // convert length to unsigned 32 bit integer
        length = elements.length >>> 0;

        // calculate begin index, if is set
        if (undefined !== begin) {

            // convert to integer
            begin = toInteger(begin);

            // handle -begin, begin > length - 1
            index = 0 > begin ? length - Math.abs(begin) : Math.min(begin, length - 1);
        } else {
            // default value
            index = length - 1;
        }
        // iterate over elements backwards
        for (; - 1 < index; --index) {

            // current index exists, target element is equal to current element
            if (index in elements && target === elements[index]) {

                // break loop, target element found
                return index;
            }
        }
        // target element not found
        return -1;
    }

    /**
     * Executes a provided function once per array element.
     * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.18
     */
    function forEach(callback, scope) {
        /*jshint newcap:false*/
        var elements, length, index;

        // convert elements to object
        elements = Object(this);

        // make sure callback is a function
        requireFunction(callback);

        // convert length to unsigned 32 bit integer
        length = elements.length >>> 0;

        // iterate over elements
        for (index = 0; index < length; ++index) {

            // current index exists
            if (index in elements) {

                // execute callback
                callback.call(scope, elements[index], index, elements);
            }
        }
    }

    /**
     * Tests whether all elements in the array pass the test
     * implemented by the provided function.
     * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.16
     */
    function every(callback, scope) {
        /*jshint newcap:false*/
        var elements, length, index;

        // convert elements to object
        elements = Object(this);

        // make sure callback is a function
        requireFunction(callback);

        // convert length to unsigned 32 bit integer
        length = elements.length >>> 0;

        // iterate over elements
        for (index = 0; index < length; ++index) {

            // current index exists
            if (index in elements &&

                // callback returns false
                !callback.call(scope, elements[index], index, elements)) {

                // break loop, test failed
                return false;
            }
        }
        // test passed, controversy began..
        return true;
    }

    /**
     * Tests whether some element in the array passes the test
     * implemented by the provided function.
     * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.17
     */
    function some(callback, scope) {
        /*jshint newcap:false*/
        var elements, length, index;

        // convert elements to object
        elements = Object(this);

        // make sure callback is a function
        requireFunction(callback);

        // convert length to unsigned 32 bit integer
        length = elements.length >>> 0;

        // iterate over elements
        for (index = 0; index < length; ++index) {

            // current index exists
            if (index in elements &&

                // callback returns true
                callback.call(scope, elements[index], index, elements)) {

                // break loop, test passed
                return true;
            }
        }
        // test failed
        return false;
    }

    /**
     * Creates a new array with all elements that pass the test
     * implemented by the provided function.
     * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.20
     */
    function filter(callback, scope) {
        /*jshint newcap:false*/
        var result = [],
            elements, length, index, count;

        // convert elements to object
        elements = Object(this);

        // make sure callback is a function
        requireFunction(callback);

        // convert length to unsigned 32 bit integer
        length = elements.length >>> 0;

        // iterate over elements
        for (index = count = 0; index < length; ++index) {

            // current index exists
            if (index in elements &&

                // callback returns true
                callback.call(scope, elements[index], index, elements)) {

                // copy current element to result array
                result[count++] = elements[index];
            }
        }
        return result;
    }

    /**
     * Creates a new array with the results of calling a provided function
     * on every element in this array.
     * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.19
     */
    function map(callback, scope) {
        /*jshint newcap:false*/
        var result = [],
            elements, length, index;

        // convert elements to object
        elements = Object(this);

        // make sure callback is a function
        requireFunction(callback);

        // convert length to unsigned 32 bit integer
        length = elements.length >>> 0;

        // iterate over elements
        for (index = 0; index < length; ++index) {

            // current index exists
            if (index in elements) {

                // copy a return value of callback to result array
                result[index] = callback.call(scope, elements[index], index, elements);
            }
        }
        return result;
    }

    /**
     * Apply a function against values of the array (from left-to-right)
     * as to reduce it to a single value.
     * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.21
     */
    function reduce(callback, value) {
        /*jshint newcap:false*/
        var elements, isset, length, index;

        // convert elements to object
        elements = Object(this);

        // make sure callback is a function
        requireFunction(callback);

        // status of the initial value
        isset = undefined !== value;

        // convert length to unsigned 32 bit integer
        length = elements.length >>> 0;

        // iterate over elements
        for (index = 0; index < length; ++index) {

            // current index exists
            if (index in elements) {

                // initial value is set
                if (isset) {

                    // replace initial value with a return value of callback
                    value = callback(value, elements[index], index, elements);
                } else {
                    // current element becomes initial value
                    value = elements[index];

                    // status of the initial value
                    isset = true;
                }
            }
        }
        // make sure the initial value exists after iteration
        requireValue(isset);
        return value;
    }

    /**
     * Apply a function against values of the array (from right-to-left)
     * as to reduce it to a single value.
     * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.22
     */
    function reduceRight(callback, value) {
        /*jshint newcap:false*/
        var elements, isset, index;

        // convert elements to object
        elements = Object(this);

        // make sure callback is a function
        requireFunction(callback);

        // status of the initial value
        isset = undefined !== value;

        // index of the last element
        index = (elements.length >>> 0) - 1;

        // iterate over elements backwards
        for (; - 1 < index; --index) {

            // current index exists
            if (index in elements) {

                // initial value is set
                if (isset) {

                    // replace initial value with a return value of callback
                    value = callback(value, elements[index], index, elements);
                } else {
                    // current element becomes initial value
                    value = elements[index];

                    // status of the initial value
                    isset = true;
                }
            }
        }
        // make sure the initial value exists after iteration
        requireValue(isset);
        return value;
    }

    /**
     * Returns true if an argument is an array, false if it is not.
     * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.3.2
     */
    function isArray(value) {
        return "[object Array]" === Object.prototype.toString.call(value);
    }

    /**
     * Tests if an argument is callable and throws an error if it is not.
     * @private
     */
    function requireFunction(value) {
        if ("[object Function]" !== Object.prototype.toString.call(value)) {
            throw new Error(value + " is not a function");
        }
    }

    /**
     * Throws an error if an argument can be converted to true.
     * @private
     */
    function requireValue(isset) {
        if (!isset) {
            throw new Error("reduce of empty array with no initial value");
        }
    }

    /**
     * Tests implementation of standard Array method.
     * @private
     */
    function supportsStandard(key) {
        var support = true;

        // a method exists
        if (Array.prototype[key]) {
            try {
                // apply dummy arguments
                Array.prototype[key].call(undefined, /test/, null);

                // passed? implemented wrong
                support = false;
            } catch (e) {
                // do nothing
            }
        } else {
            support = false;
        }
        return support;
    }

    /**
     * Tests implementation of generic Array method.
     * @private
     */
    function supportsGeneric(key) {
        var support = true;

        // a method exists
        if (Array[key]) {
            try {
                // apply dummy arguments
                Array[key](undefined, /test/, null);

                // passed? implemented wrong
                support = false;
            } catch (e) {
                // do nothing
            }
        } else {
            support = false;
        }
        return support;
    }

    /**
     * Assigns method to Array constructor.
     * @private
     */
    function extendArray(key) {
        if (!supportsGeneric(key)) {
            Array[key] = createGeneric(key);
        }
    }

    /**
     * Creates generic method from an instance method.
     * @private
     */
    function createGeneric(key) {
        /** @public */
        return function(elements) {
            var list;

            if (undefined === elements || null === elements) {
                throw new Error("Array.prototype." + key + " called on " + elements);
            }
            list = Array.prototype.slice.call(arguments, 1);
            return Array.prototype[key].apply(elements, list);
        };
    }

    /**
     * Assign ECMAScript-5 methods to Array constructor,
     * and Array prototype.
     */
    var ES5 = {
        "indexOf": indexOf,
        "lastIndexOf": lastIndexOf,
        "forEach": forEach,
        "every": every,
        "some": some,
        "filter": filter,
        "map": map,
        "reduce": reduce,
        "reduceRight": reduceRight
    };
    for (var key in ES5) {
        if (ES5.hasOwnProperty(key)) {

            if (!supportsStandard(key)) {
                Array.prototype[key] = ES5[key];
            }
            extendArray(key);
        }
    }
    Array.isArray = Array.isArray || isArray;

    /**
     * Assign ECMAScript-3 methods to Array constructor.
     * The toString method is omitted.
     */
    [
        "concat",
        "join",
        "slice",
        "pop",
        "push",
        "reverse",
        "shift",
        "sort",
        "splice",
        "unshift"

    ].forEach(extendArray);

    /**
     * Test the slice method on DOM NodeList.
     * Support: IE < 9
     */
    /*jshint browser:true*/
    if (document) {
        try {
            Array.slice(document.childNodes);
        } catch (e) {
            Array.prototype.slice = slice;
        }
    }

}(this, 1 / 0));

/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.1.20150312
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ("document" in self) {

    // Full polyfill for browsers with no classList support
    // Including IE < Edge missing SVGElement.classList
    if (!("classList" in document.createElement("_")) ||
        document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg", "g"))) {

        (function(view) {

            "use strict";

            if (!('Element' in view)) return;

            var
                classListProp = "classList",
                protoProp = "prototype",
                elemCtrProto = view.Element[protoProp],
                objCtr = Object,
                strTrim = String[protoProp].trim || function() {
                    return this.replace(/^\s+|\s+$/g, "");
                },
                arrIndexOf = Array[protoProp].indexOf || function(item) {
                    var
                        i = 0,
                        len = this.length;
                    for (; i < len; i++) {
                        if (i in this && this[i] === item) {
                            return i;
                        }
                    }
                    return -1;
                }
                // Vendors: please allow content code to instantiate DOMExceptions
                ,
                DOMEx = function(type, message) {
                    this.name = type;
                    this.code = DOMException[type];
                    this.message = message;
                },
                checkTokenAndGetIndex = function(classList, token) {
                    if (token === "") {
                        throw new DOMEx(
                            "SYNTAX_ERR", "An invalid or illegal string was specified"
                        );
                    }
                    if (/\s/.test(token)) {
                        throw new DOMEx(
                            "INVALID_CHARACTER_ERR", "String contains an invalid character"
                        );
                    }
                    return arrIndexOf.call(classList, token);
                },
                ClassList = function(elem) {
                    var
                        trimmedClasses = strTrim.call(elem.getAttribute("class") || ""),
                        classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
                        i = 0,
                        len = classes.length;
                    for (; i < len; i++) {
                        this.push(classes[i]);
                    }
                    this._updateClassName = function() {
                        elem.setAttribute("class", this.toString());
                    };
                },
                classListProto = ClassList[protoProp] = [],
                classListGetter = function() {
                    return new ClassList(this);
                };
            // Most DOMException implementations don't allow calling DOMException's toString()
            // on non-DOMExceptions. Error's toString() is sufficient here.
            DOMEx[protoProp] = Error[protoProp];
            classListProto.item = function(i) {
                return this[i] || null;
            };
            classListProto.contains = function(token) {
                token += "";
                return checkTokenAndGetIndex(this, token) !== -1;
            };
            classListProto.add = function() {
                var
                    tokens = arguments,
                    i = 0,
                    l = tokens.length,
                    token, updated = false;
                do {
                    token = tokens[i] + "";
                    if (checkTokenAndGetIndex(this, token) === -1) {
                        this.push(token);
                        updated = true;
                    }
                }
                while (++i < l);

                if (updated) {
                    this._updateClassName();
                }
            };
            classListProto.remove = function() {
                var
                    tokens = arguments,
                    i = 0,
                    l = tokens.length,
                    token, updated = false,
                    index;
                do {
                    token = tokens[i] + "";
                    index = checkTokenAndGetIndex(this, token);
                    while (index !== -1) {
                        this.splice(index, 1);
                        updated = true;
                        index = checkTokenAndGetIndex(this, token);
                    }
                }
                while (++i < l);

                if (updated) {
                    this._updateClassName();
                }
            };
            classListProto.toggle = function(token, force) {
                token += "";

                var
                    result = this.contains(token),
                    method = result ?
                    force !== true && "remove" :
                    force !== false && "add";

                if (method) {
                    this[method](token);
                }

                if (force === true || force === false) {
                    return force;
                } else {
                    return !result;
                }
            };
            classListProto.toString = function() {
                return this.join(" ");
            };

            if (objCtr.defineProperty) {
                var classListPropDesc = {
                    get: classListGetter,
                    enumerable: true,
                    configurable: true
                };
                try {
                    objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                } catch (ex) { // IE 8 doesn't support enumerable:true
                    if (ex.number === -0x7FF5EC54) {
                        classListPropDesc.enumerable = false;
                        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                    }
                }
            } else if (objCtr[protoProp].__defineGetter__) {
                elemCtrProto.__defineGetter__(classListProp, classListGetter);
            }

        }(self));

    } else {
        // There is full or partial native classList support, so just check if we need
        // to normalize the add/remove and toggle APIs.

        (function() {
            "use strict";

            var testElement = document.createElement("_");

            testElement.classList.add("c1", "c2");

            // Polyfill for IE 10/11 and Firefox <26, where classList.add and
            // classList.remove exist but support only one argument at a time.
            if (!testElement.classList.contains("c2")) {
                var createMethod = function(method) {
                    var original = DOMTokenList.prototype[method];

                    DOMTokenList.prototype[method] = function(token) {
                        var i, len = arguments.length;

                        for (i = 0; i < len; i++) {
                            token = arguments[i];
                            original.call(this, token);
                        }
                    };
                };
                createMethod('add');
                createMethod('remove');
            }

            testElement.classList.toggle("c3", false);

            // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
            // support the second argument.
            if (testElement.classList.contains("c3")) {
                var _toggle = DOMTokenList.prototype.toggle;

                DOMTokenList.prototype.toggle = function(token, force) {
                    if (1 in arguments && !this.contains(token) === !force) {
                        return force;
                    } else {
                        return _toggle.call(this, token);
                    }
                };

            }

            testElement = null;
        }());

    }

}

// EventListener | CC0 | github.com/jonathantneal/EventListener

this.Element && Element.prototype.attachEvent && !Element.prototype.addEventListener && (function() {
    function addToPrototype(name, method) {
        Window.prototype[name] = HTMLDocument.prototype[name] = Element.prototype[name] = method;
    }

    // add
    addToPrototype("addEventListener", function(type, listener) {
        var
            target = this,
            listeners = target.addEventListener.listeners = target.addEventListener.listeners || {},
            typeListeners = listeners[type] = listeners[type] || [];

        // if no events exist, attach the listener
        if (!typeListeners.length) {
            target.attachEvent("on" + type, typeListeners.event = function(event) {
                var documentElement = target.document && target.document.documentElement || target.documentElement || {
                    scrollLeft: 0,
                    scrollTop: 0
                };

                // polyfill w3c properties and methods
                event.currentTarget = target;
                event.pageX = event.clientX + documentElement.scrollLeft;
                event.pageY = event.clientY + documentElement.scrollTop;
                event.preventDefault = function() {
                    event.returnValue = false
                };
                event.relatedTarget = event.fromElement || null;
                event.stopImmediatePropagation = function() {
                    immediatePropagation = false;
                    event.cancelBubble = true
                };
                event.stopPropagation = function() {
                    event.cancelBubble = true
                };
                event.target = event.srcElement || target;
                event.timeStamp = +new Date;

                var plainEvt = {};
                for (var i in event) {
                    plainEvt[i] = event[i];
                }

                // create an cached list of the master events list (to protect this loop from breaking when an event is removed)
                for (var i = 0, typeListenersCache = [].concat(typeListeners), typeListenerCache, immediatePropagation = true; immediatePropagation && (typeListenerCache = typeListenersCache[i]); ++i) {
                    // check to see if the cached event still exists in the master events list
                    for (var ii = 0, typeListener; typeListener = typeListeners[ii]; ++ii) {
                        if (typeListener == typeListenerCache) {
                            typeListener.call(target, plainEvt);

                            break;
                        }
                    }
                }
            });
        }

        // add the event to the master event list
        typeListeners.push(listener);
    });

    // remove
    addToPrototype("removeEventListener", function(type, listener) {
        var
            target = this,
            listeners = target.addEventListener.listeners = target.addEventListener.listeners || {},
            typeListeners = listeners[type] = listeners[type] || [];

        // remove the newest matching event from the master event list
        for (var i = typeListeners.length - 1, typeListener; typeListener = typeListeners[i]; --i) {
            if (typeListener == listener) {
                typeListeners.splice(i, 1);

                break;
            }
        }

        // if no events exist, detach the listener
        if (!typeListeners.length && typeListeners.event) {
            target.detachEvent("on" + type, typeListeners.event);
        }
    });

    // dispatch
    addToPrototype("dispatchEvent", function(eventObject) {
        var
            target = this,
            type = eventObject.type,
            listeners = target.addEventListener.listeners = target.addEventListener.listeners || {},
            typeListeners = listeners[type] = listeners[type] || [];

        try {
            return target.fireEvent("on" + type, eventObject);
        } catch (error) {
            if (typeListeners.event) {
                typeListeners.event(eventObject);
            }

            return;
        }
    });

    // CustomEvent
    Object.defineProperty(Window.prototype, "CustomEvent", {
        get: function() {
            var self = this;

            return function CustomEvent(type, eventInitDict) {
                var event = self.document.createEventObject(),
                    key;

                event.type = type;
                for (key in eventInitDict) {
                    if (key == 'cancelable') {
                        event.returnValue = !eventInitDict.cancelable;
                    } else if (key == 'bubbles') {
                        event.cancelBubble = !eventInitDict.bubbles;
                    } else if (key == 'detail') {
                        event.detail = eventInitDict.detail;
                    }
                }
                return event;
            };
        }
    });

    // ready
    function ready(event) {
        if (ready.interval && document.body) {
            ready.interval = clearInterval(ready.interval);

            document.dispatchEvent(new CustomEvent("DOMContentLoaded"));
        }
    }

    ready.interval = setInterval(ready, 1);

    window.addEventListener("load", ready);
})();

(!this.CustomEvent || typeof this.CustomEvent === "object") && (function() {
    // CustomEvent for browsers which don't natively support the Constructor method
    this.CustomEvent = function CustomEvent(type, eventInitDict) {
        var event;
        eventInitDict = eventInitDict || {
            bubbles: false,
            cancelable: false,
            detail: undefined
        };

        try {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent(type, eventInitDict.bubbles, eventInitDict.cancelable, eventInitDict.detail);
        } catch (error) {
            // for browsers which don't support CustomEvent at all, we use a regular event instead
            event = document.createEvent('Event');
            event.initEvent(type, eventInitDict.bubbles, eventInitDict.cancelable);
            event.detail = eventInitDict.detail;
        }

        return event;
    };
})();

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
    Object.keys = (function() {
        'use strict';
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({
                toString: null
            }).propertyIsEnumerable('toString'),
            dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            dontEnumsLength = dontEnums.length;

        return function(obj) {
            if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                throw new TypeError('Object.keys called on non-object');
            }

            var result = [],
                prop, i;

            for (prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                    result.push(prop);
                }
            }

            if (hasDontEnumBug) {
                for (i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
    }());
}

if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}