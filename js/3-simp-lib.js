/*! jQuery UI - v1.11.4 - 2015-12-17
* http://jqueryui.com
* Includes: core.js, widget.js, mouse.js, position.js, datepicker.js
* Copyright jQuery Foundation and other contributors; Licensed MIT */

(function( factory ) {
    if ( typeof define === "function" && define.amd ) {

        // AMD. Register as an anonymous module.
        define([ "jquery" ], factory );
    } else {

        // Browser globals
        factory( jQuery );
    }
}(function( $ ) {
/*!
 * jQuery UI Core 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */


// $.ui might exist from components with no dependencies, e.g., $.ui.position
$.ui = $.ui || {};

$.extend( $.ui, {
    version: "1.11.4",

    keyCode: {
        BACKSPACE: 8,
        COMMA: 188,
        DELETE: 46,
        DOWN: 40,
        END: 35,
        ENTER: 13,
        ESCAPE: 27,
        HOME: 36,
        LEFT: 37,
        PAGE_DOWN: 34,
        PAGE_UP: 33,
        PERIOD: 190,
        RIGHT: 39,
        SPACE: 32,
        TAB: 9,
        UP: 38
    }
});

// plugins
$.fn.extend({
    scrollParent: function( includeHidden ) {
        var position = this.css( "position" ),
            excludeStaticParent = position === "absolute",
            overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
            scrollParent = this.parents().filter( function() {
                var parent = $( this );
                if ( excludeStaticParent && parent.css( "position" ) === "static" ) {
                    return false;
                }
                return overflowRegex.test( parent.css( "overflow" ) + parent.css( "overflow-y" ) + parent.css( "overflow-x" ) );
            }).eq( 0 );

        return position === "fixed" || !scrollParent.length ? $( this[ 0 ].ownerDocument || document ) : scrollParent;
    },

    uniqueId: (function() {
        var uuid = 0;

        return function() {
            return this.each(function() {
                if ( !this.id ) {
                    this.id = "ui-id-" + ( ++uuid );
                }
            });
        };
    })(),

    removeUniqueId: function() {
        return this.each(function() {
            if ( /^ui-id-\d+$/.test( this.id ) ) {
                $( this ).removeAttr( "id" );
            }
        });
    }
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
    var map, mapName, img,
        nodeName = element.nodeName.toLowerCase();
    if ( "area" === nodeName ) {
        map = element.parentNode;
        mapName = map.name;
        if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
            return false;
        }
        img = $( "img[usemap='#" + mapName + "']" )[ 0 ];
        return !!img && visible( img );
    }
    return ( /^(input|select|textarea|button|object)$/.test( nodeName ) ?
        !element.disabled :
        "a" === nodeName ?
            element.href || isTabIndexNotNaN :
            isTabIndexNotNaN) &&
        // the element and all of its ancestors must be visible
        visible( element );
}

function visible( element ) {
    return $.expr.filters.visible( element ) &&
        !$( element ).parents().addBack().filter(function() {
            return $.css( this, "visibility" ) === "hidden";
        }).length;
}

$.extend( $.expr[ ":" ], {
    data: $.expr.createPseudo ?
        $.expr.createPseudo(function( dataName ) {
            return function( elem ) {
                return !!$.data( elem, dataName );
            };
        }) :
        // support: jQuery <1.8
        function( elem, i, match ) {
            return !!$.data( elem, match[ 3 ] );
        },

    focusable: function( element ) {
        return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
    },

    tabbable: function( element ) {
        var tabIndex = $.attr( element, "tabindex" ),
            isTabIndexNaN = isNaN( tabIndex );
        return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
    }
});

// support: jQuery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
    $.each( [ "Width", "Height" ], function( i, name ) {
        var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
            type = name.toLowerCase(),
            orig = {
                innerWidth: $.fn.innerWidth,
                innerHeight: $.fn.innerHeight,
                outerWidth: $.fn.outerWidth,
                outerHeight: $.fn.outerHeight
            };

        function reduce( elem, size, border, margin ) {
            $.each( side, function() {
                size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
                if ( border ) {
                    size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
                }
                if ( margin ) {
                    size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
                }
            });
            return size;
        }

        $.fn[ "inner" + name ] = function( size ) {
            if ( size === undefined ) {
                return orig[ "inner" + name ].call( this );
            }

            return this.each(function() {
                $( this ).css( type, reduce( this, size ) + "px" );
            });
        };

        $.fn[ "outer" + name] = function( size, margin ) {
            if ( typeof size !== "number" ) {
                return orig[ "outer" + name ].call( this, size );
            }

            return this.each(function() {
                $( this).css( type, reduce( this, size, true, margin ) + "px" );
            });
        };
    });
}

// support: jQuery <1.8
if ( !$.fn.addBack ) {
    $.fn.addBack = function( selector ) {
        return this.add( selector == null ?
            this.prevObject : this.prevObject.filter( selector )
        );
    };
}

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
    $.fn.removeData = (function( removeData ) {
        return function( key ) {
            if ( arguments.length ) {
                return removeData.call( this, $.camelCase( key ) );
            } else {
                return removeData.call( this );
            }
        };
    })( $.fn.removeData );
}

// deprecated
$.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

$.fn.extend({
    focus: (function( orig ) {
        return function( delay, fn ) {
            return typeof delay === "number" ?
                this.each(function() {
                    var elem = this;
                    setTimeout(function() {
                        $( elem ).focus();
                        if ( fn ) {
                            fn.call( elem );
                        }
                    }, delay );
                }) :
                orig.apply( this, arguments );
        };
    })( $.fn.focus ),

    disableSelection: (function() {
        var eventType = "onselectstart" in document.createElement( "div" ) ?
            "selectstart" :
            "mousedown";

        return function() {
            return this.bind( eventType + ".ui-disableSelection", function( event ) {
                event.preventDefault();
            });
        };
    })(),

    enableSelection: function() {
        return this.unbind( ".ui-disableSelection" );
    },

    zIndex: function( zIndex ) {
        if ( zIndex !== undefined ) {
            return this.css( "zIndex", zIndex );
        }

        if ( this.length ) {
            var elem = $( this[ 0 ] ), position, value;
            while ( elem.length && elem[ 0 ] !== document ) {
                // Ignore z-index if position is set to a value where z-index is ignored by the browser
                // This makes behavior of this function consistent across browsers
                // WebKit always returns auto if the element is positioned
                position = elem.css( "position" );
                if ( position === "absolute" || position === "relative" || position === "fixed" ) {
                    // IE returns 0 when zIndex is not specified
                    // other browsers return a string
                    // we ignore the case of nested elements with an explicit value of 0
                    // <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
                    value = parseInt( elem.css( "zIndex" ), 10 );
                    if ( !isNaN( value ) && value !== 0 ) {
                        return value;
                    }
                }
                elem = elem.parent();
            }
        }

        return 0;
    }
});

// $.ui.plugin is deprecated. Use $.widget() extensions instead.
$.ui.plugin = {
    add: function( module, option, set ) {
        var i,
            proto = $.ui[ module ].prototype;
        for ( i in set ) {
            proto.plugins[ i ] = proto.plugins[ i ] || [];
            proto.plugins[ i ].push( [ option, set[ i ] ] );
        }
    },
    call: function( instance, name, args, allowDisconnected ) {
        var i,
            set = instance.plugins[ name ];

        if ( !set ) {
            return;
        }

        if ( !allowDisconnected && ( !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) ) {
            return;
        }

        for ( i = 0; i < set.length; i++ ) {
            if ( instance.options[ set[ i ][ 0 ] ] ) {
                set[ i ][ 1 ].apply( instance.element, args );
            }
        }
    }
};


/*!
 * jQuery UI Widget 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/jQuery.widget/
 */


var widget_uuid = 0,
    widget_slice = Array.prototype.slice;

$.cleanData = (function( orig ) {
    return function( elems ) {
        var events, elem, i;
        for ( i = 0; (elem = elems[i]) != null; i++ ) {
            try {

                // Only trigger remove when necessary to save time
                events = $._data( elem, "events" );
                if ( events && events.remove ) {
                    $( elem ).triggerHandler( "remove" );
                }

            // http://bugs.jquery.com/ticket/8235
            } catch ( e ) {}
        }
        orig( elems );
    };
})( $.cleanData );

$.widget = function( name, base, prototype ) {
    var fullName, existingConstructor, constructor, basePrototype,
        // proxiedPrototype allows the provided prototype to remain unmodified
        // so that it can be used as a mixin for multiple widgets (#8876)
        proxiedPrototype = {},
        namespace = name.split( "." )[ 0 ];

    name = name.split( "." )[ 1 ];
    fullName = namespace + "-" + name;

    if ( !prototype ) {
        prototype = base;
        base = $.Widget;
    }

    // create selector for plugin
    $.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
        return !!$.data( elem, fullName );
    };

    $[ namespace ] = $[ namespace ] || {};
    existingConstructor = $[ namespace ][ name ];
    constructor = $[ namespace ][ name ] = function( options, element ) {
        // allow instantiation without "new" keyword
        if ( !this._createWidget ) {
            return new constructor( options, element );
        }

        // allow instantiation without initializing for simple inheritance
        // must use "new" keyword (the code above always passes args)
        if ( arguments.length ) {
            this._createWidget( options, element );
        }
    };
    // extend with the existing constructor to carry over any static properties
    $.extend( constructor, existingConstructor, {
        version: prototype.version,
        // copy the object used to create the prototype in case we need to
        // redefine the widget later
        _proto: $.extend( {}, prototype ),
        // track widgets that inherit from this widget in case this widget is
        // redefined after a widget inherits from it
        _childConstructors: []
    });

    basePrototype = new base();
    // we need to make the options hash a property directly on the new instance
    // otherwise we'll modify the options hash on the prototype that we're
    // inheriting from
    basePrototype.options = $.widget.extend( {}, basePrototype.options );
    $.each( prototype, function( prop, value ) {
        if ( !$.isFunction( value ) ) {
            proxiedPrototype[ prop ] = value;
            return;
        }
        proxiedPrototype[ prop ] = (function() {
            var _super = function() {
                    return base.prototype[ prop ].apply( this, arguments );
                },
                _superApply = function( args ) {
                    return base.prototype[ prop ].apply( this, args );
                };
            return function() {
                var __super = this._super,
                    __superApply = this._superApply,
                    returnValue;

                this._super = _super;
                this._superApply = _superApply;

                returnValue = value.apply( this, arguments );

                this._super = __super;
                this._superApply = __superApply;

                return returnValue;
            };
        })();
    });
    constructor.prototype = $.widget.extend( basePrototype, {
        // TODO: remove support for widgetEventPrefix
        // always use the name + a colon as the prefix, e.g., draggable:start
        // don't prefix for widgets that aren't DOM-based
        widgetEventPrefix: existingConstructor ? (basePrototype.widgetEventPrefix || name) : name
    }, proxiedPrototype, {
        constructor: constructor,
        namespace: namespace,
        widgetName: name,
        widgetFullName: fullName
    });

    // If this widget is being redefined then we need to find all widgets that
    // are inheriting from it and redefine all of them so that they inherit from
    // the new version of this widget. We're essentially trying to replace one
    // level in the prototype chain.
    if ( existingConstructor ) {
        $.each( existingConstructor._childConstructors, function( i, child ) {
            var childPrototype = child.prototype;

            // redefine the child widget using the same prototype that was
            // originally used, but inherit from the new version of the base
            $.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
        });
        // remove the list of existing child constructors from the old constructor
        // so the old child constructors can be garbage collected
        delete existingConstructor._childConstructors;
    } else {
        base._childConstructors.push( constructor );
    }

    $.widget.bridge( name, constructor );

    return constructor;
};

$.widget.extend = function( target ) {
    var input = widget_slice.call( arguments, 1 ),
        inputIndex = 0,
        inputLength = input.length,
        key,
        value;
    for ( ; inputIndex < inputLength; inputIndex++ ) {
        for ( key in input[ inputIndex ] ) {
            value = input[ inputIndex ][ key ];
            if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
                // Clone objects
                if ( $.isPlainObject( value ) ) {
                    target[ key ] = $.isPlainObject( target[ key ] ) ?
                        $.widget.extend( {}, target[ key ], value ) :
                        // Don't extend strings, arrays, etc. with objects
                        $.widget.extend( {}, value );
                // Copy everything else by reference
                } else {
                    target[ key ] = value;
                }
            }
        }
    }
    return target;
};

$.widget.bridge = function( name, object ) {
    var fullName = object.prototype.widgetFullName || name;
    $.fn[ name ] = function( options ) {
        var isMethodCall = typeof options === "string",
            args = widget_slice.call( arguments, 1 ),
            returnValue = this;

        if ( isMethodCall ) {
            this.each(function() {
                var methodValue,
                    instance = $.data( this, fullName );
                if ( options === "instance" ) {
                    returnValue = instance;
                    return false;
                }
                if ( !instance ) {
                    return $.error( "cannot call methods on " + name + " prior to initialization; " +
                        "attempted to call method '" + options + "'" );
                }
                if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
                    return $.error( "no such method '" + options + "' for " + name + " widget instance" );
                }
                methodValue = instance[ options ].apply( instance, args );
                if ( methodValue !== instance && methodValue !== undefined ) {
                    returnValue = methodValue && methodValue.jquery ?
                        returnValue.pushStack( methodValue.get() ) :
                        methodValue;
                    return false;
                }
            });
        } else {

            // Allow multiple hashes to be passed on init
            if ( args.length ) {
                options = $.widget.extend.apply( null, [ options ].concat(args) );
            }

            this.each(function() {
                var instance = $.data( this, fullName );
                if ( instance ) {
                    instance.option( options || {} );
                    if ( instance._init ) {
                        instance._init();
                    }
                } else {
                    $.data( this, fullName, new object( options, this ) );
                }
            });
        }

        return returnValue;
    };
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
    widgetName: "widget",
    widgetEventPrefix: "",
    defaultElement: "<div>",
    options: {
        disabled: false,

        // callbacks
        create: null
    },
    _createWidget: function( options, element ) {
        element = $( element || this.defaultElement || this )[ 0 ];
        this.element = $( element );
        this.uuid = widget_uuid++;
        this.eventNamespace = "." + this.widgetName + this.uuid;

        this.bindings = $();
        this.hoverable = $();
        this.focusable = $();

        if ( element !== this ) {
            $.data( element, this.widgetFullName, this );
            this._on( true, this.element, {
                remove: function( event ) {
                    if ( event.target === element ) {
                        this.destroy();
                    }
                }
            });
            this.document = $( element.style ?
                // element within the document
                element.ownerDocument :
                // element is window or document
                element.document || element );
            this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
        }

        this.options = $.widget.extend( {},
            this.options,
            this._getCreateOptions(),
            options );

        this._create();
        this._trigger( "create", null, this._getCreateEventData() );
        this._init();
    },
    _getCreateOptions: $.noop,
    _getCreateEventData: $.noop,
    _create: $.noop,
    _init: $.noop,

    destroy: function() {
        this._destroy();
        // we can probably remove the unbind calls in 2.0
        // all event bindings should go through this._on()
        this.element
            .unbind( this.eventNamespace )
            .removeData( this.widgetFullName )
            // support: jquery <1.6.3
            // http://bugs.jquery.com/ticket/9413
            .removeData( $.camelCase( this.widgetFullName ) );
        this.widget()
            .unbind( this.eventNamespace )
            .removeAttr( "aria-disabled" )
            .removeClass(
                this.widgetFullName + "-disabled " +
                "ui-state-disabled" );

        // clean up events and states
        this.bindings.unbind( this.eventNamespace );
        this.hoverable.removeClass( "ui-state-hover" );
        this.focusable.removeClass( "ui-state-focus" );
    },
    _destroy: $.noop,

    widget: function() {
        return this.element;
    },

    option: function( key, value ) {
        var options = key,
            parts,
            curOption,
            i;

        if ( arguments.length === 0 ) {
            // don't return a reference to the internal hash
            return $.widget.extend( {}, this.options );
        }

        if ( typeof key === "string" ) {
            // handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
            options = {};
            parts = key.split( "." );
            key = parts.shift();
            if ( parts.length ) {
                curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
                for ( i = 0; i < parts.length - 1; i++ ) {
                    curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
                    curOption = curOption[ parts[ i ] ];
                }
                key = parts.pop();
                if ( arguments.length === 1 ) {
                    return curOption[ key ] === undefined ? null : curOption[ key ];
                }
                curOption[ key ] = value;
            } else {
                if ( arguments.length === 1 ) {
                    return this.options[ key ] === undefined ? null : this.options[ key ];
                }
                options[ key ] = value;
            }
        }

        this._setOptions( options );

        return this;
    },
    _setOptions: function( options ) {
        var key;

        for ( key in options ) {
            this._setOption( key, options[ key ] );
        }

        return this;
    },
    _setOption: function( key, value ) {
        this.options[ key ] = value;

        if ( key === "disabled" ) {
            this.widget()
                .toggleClass( this.widgetFullName + "-disabled", !!value );

            // If the widget is becoming disabled, then nothing is interactive
            if ( value ) {
                this.hoverable.removeClass( "ui-state-hover" );
                this.focusable.removeClass( "ui-state-focus" );
            }
        }

        return this;
    },

    enable: function() {
        return this._setOptions({ disabled: false });
    },
    disable: function() {
        return this._setOptions({ disabled: true });
    },

    _on: function( suppressDisabledCheck, element, handlers ) {
        var delegateElement,
            instance = this;

        // no suppressDisabledCheck flag, shuffle arguments
        if ( typeof suppressDisabledCheck !== "boolean" ) {
            handlers = element;
            element = suppressDisabledCheck;
            suppressDisabledCheck = false;
        }

        // no element argument, shuffle and use this.element
        if ( !handlers ) {
            handlers = element;
            element = this.element;
            delegateElement = this.widget();
        } else {
            element = delegateElement = $( element );
            this.bindings = this.bindings.add( element );
        }

        $.each( handlers, function( event, handler ) {
            function handlerProxy() {
                // allow widgets to customize the disabled handling
                // - disabled as an array instead of boolean
                // - disabled class as method for disabling individual parts
                if ( !suppressDisabledCheck &&
                        ( instance.options.disabled === true ||
                            $( this ).hasClass( "ui-state-disabled" ) ) ) {
                    return;
                }
                return ( typeof handler === "string" ? instance[ handler ] : handler )
                    .apply( instance, arguments );
            }

            // copy the guid so direct unbinding works
            if ( typeof handler !== "string" ) {
                handlerProxy.guid = handler.guid =
                    handler.guid || handlerProxy.guid || $.guid++;
            }

            var match = event.match( /^([\w:-]*)\s*(.*)$/ ),
                eventName = match[1] + instance.eventNamespace,
                selector = match[2];
            if ( selector ) {
                delegateElement.delegate( selector, eventName, handlerProxy );
            } else {
                element.bind( eventName, handlerProxy );
            }
        });
    },

    _off: function( element, eventName ) {
        eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) +
            this.eventNamespace;
        element.unbind( eventName ).undelegate( eventName );

        // Clear the stack to avoid memory leaks (#10056)
        this.bindings = $( this.bindings.not( element ).get() );
        this.focusable = $( this.focusable.not( element ).get() );
        this.hoverable = $( this.hoverable.not( element ).get() );
    },

    _delay: function( handler, delay ) {
        function handlerProxy() {
            return ( typeof handler === "string" ? instance[ handler ] : handler )
                .apply( instance, arguments );
        }
        var instance = this;
        return setTimeout( handlerProxy, delay || 0 );
    },

    _hoverable: function( element ) {
        this.hoverable = this.hoverable.add( element );
        this._on( element, {
            mouseenter: function( event ) {
                $( event.currentTarget ).addClass( "ui-state-hover" );
            },
            mouseleave: function( event ) {
                $( event.currentTarget ).removeClass( "ui-state-hover" );
            }
        });
    },

    _focusable: function( element ) {
        this.focusable = this.focusable.add( element );
        this._on( element, {
            focusin: function( event ) {
                $( event.currentTarget ).addClass( "ui-state-focus" );
            },
            focusout: function( event ) {
                $( event.currentTarget ).removeClass( "ui-state-focus" );
            }
        });
    },

    _trigger: function( type, event, data ) {
        var prop, orig,
            callback = this.options[ type ];

        data = data || {};
        event = $.Event( event );
        event.type = ( type === this.widgetEventPrefix ?
            type :
            this.widgetEventPrefix + type ).toLowerCase();
        // the original event may come from any element
        // so we need to reset the target on the new event
        event.target = this.element[ 0 ];

        // copy original event properties over to the new event
        orig = event.originalEvent;
        if ( orig ) {
            for ( prop in orig ) {
                if ( !( prop in event ) ) {
                    event[ prop ] = orig[ prop ];
                }
            }
        }

        this.element.trigger( event, data );
        return !( $.isFunction( callback ) &&
            callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
            event.isDefaultPrevented() );
    }
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
    $.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
        if ( typeof options === "string" ) {
            options = { effect: options };
        }
        var hasOptions,
            effectName = !options ?
                method :
                options === true || typeof options === "number" ?
                    defaultEffect :
                    options.effect || defaultEffect;
        options = options || {};
        if ( typeof options === "number" ) {
            options = { duration: options };
        }
        hasOptions = !$.isEmptyObject( options );
        options.complete = callback;
        if ( options.delay ) {
            element.delay( options.delay );
        }
        if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
            element[ method ]( options );
        } else if ( effectName !== method && element[ effectName ] ) {
            element[ effectName ]( options.duration, options.easing, callback );
        } else {
            element.queue(function( next ) {
                $( this )[ method ]();
                if ( callback ) {
                    callback.call( element[ 0 ] );
                }
                next();
            });
        }
    };
});

var widget = $.widget;


/*!
 * jQuery UI Mouse 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/mouse/
 */


var mouseHandled = false;
$( document ).mouseup( function() {
    mouseHandled = false;
});

var mouse = $.widget("ui.mouse", {
    version: "1.11.4",
    options: {
        cancel: "input,textarea,button,select,option",
        distance: 1,
        delay: 0
    },
    _mouseInit: function() {
        var that = this;

        this.element
            .bind("mousedown." + this.widgetName, function(event) {
                return that._mouseDown(event);
            })
            .bind("click." + this.widgetName, function(event) {
                if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
                    $.removeData(event.target, that.widgetName + ".preventClickEvent");
                    event.stopImmediatePropagation();
                    return false;
                }
            });

        this.started = false;
    },

    // TODO: make sure destroying one instance of mouse doesn't mess with
    // other instances of mouse
    _mouseDestroy: function() {
        this.element.unbind("." + this.widgetName);
        if ( this._mouseMoveDelegate ) {
            this.document
                .unbind("mousemove." + this.widgetName, this._mouseMoveDelegate)
                .unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
        }
    },

    _mouseDown: function(event) {
        // don't let more than one widget handle mouseStart
        if ( mouseHandled ) {
            return;
        }

        this._mouseMoved = false;

        // we may have missed mouseup (out of window)
        (this._mouseStarted && this._mouseUp(event));

        this._mouseDownEvent = event;

        var that = this,
            btnIsLeft = (event.which === 1),
            // event.target.nodeName works around a bug in IE 8 with
            // disabled inputs (#7620)
            elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
        if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
            return true;
        }

        this.mouseDelayMet = !this.options.delay;
        if (!this.mouseDelayMet) {
            this._mouseDelayTimer = setTimeout(function() {
                that.mouseDelayMet = true;
            }, this.options.delay);
        }

        if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
            this._mouseStarted = (this._mouseStart(event) !== false);
            if (!this._mouseStarted) {
                event.preventDefault();
                return true;
            }
        }

        // Click event may never have fired (Gecko & Opera)
        if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
            $.removeData(event.target, this.widgetName + ".preventClickEvent");
        }

        // these delegates are required to keep context
        this._mouseMoveDelegate = function(event) {
            return that._mouseMove(event);
        };
        this._mouseUpDelegate = function(event) {
            return that._mouseUp(event);
        };

        this.document
            .bind( "mousemove." + this.widgetName, this._mouseMoveDelegate )
            .bind( "mouseup." + this.widgetName, this._mouseUpDelegate );

        event.preventDefault();

        mouseHandled = true;
        return true;
    },

    _mouseMove: function(event) {
        // Only check for mouseups outside the document if you've moved inside the document
        // at least once. This prevents the firing of mouseup in the case of IE<9, which will
        // fire a mousemove event if content is placed under the cursor. See #7778
        // Support: IE <9
        if ( this._mouseMoved ) {
            // IE mouseup check - mouseup happened when mouse was out of window
            if ($.ui.ie && ( !document.documentMode || document.documentMode < 9 ) && !event.button) {
                return this._mouseUp(event);

            // Iframe mouseup check - mouseup occurred in another document
            } else if ( !event.which ) {
                return this._mouseUp( event );
            }
        }

        if ( event.which || event.button ) {
            this._mouseMoved = true;
        }

        if (this._mouseStarted) {
            this._mouseDrag(event);
            return event.preventDefault();
        }

        if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
            this._mouseStarted =
                (this._mouseStart(this._mouseDownEvent, event) !== false);
            (this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
        }

        return !this._mouseStarted;
    },

    _mouseUp: function(event) {
        this.document
            .unbind( "mousemove." + this.widgetName, this._mouseMoveDelegate )
            .unbind( "mouseup." + this.widgetName, this._mouseUpDelegate );

        if (this._mouseStarted) {
            this._mouseStarted = false;

            if (event.target === this._mouseDownEvent.target) {
                $.data(event.target, this.widgetName + ".preventClickEvent", true);
            }

            this._mouseStop(event);
        }

        mouseHandled = false;
        return false;
    },

    _mouseDistanceMet: function(event) {
        return (Math.max(
                Math.abs(this._mouseDownEvent.pageX - event.pageX),
                Math.abs(this._mouseDownEvent.pageY - event.pageY)
            ) >= this.options.distance
        );
    },

    _mouseDelayMet: function(/* event */) {
        return this.mouseDelayMet;
    },

    // These are placeholder methods, to be overriden by extending plugin
    _mouseStart: function(/* event */) {},
    _mouseDrag: function(/* event */) {},
    _mouseStop: function(/* event */) {},
    _mouseCapture: function(/* event */) { return true; }
});


/*!
 * jQuery UI Position 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/position/
 */

(function() {

$.ui = $.ui || {};

var cachedScrollbarWidth, supportsOffsetFractions,
    max = Math.max,
    abs = Math.abs,
    round = Math.round,
    rhorizontal = /left|center|right/,
    rvertical = /top|center|bottom/,
    roffset = /[\+\-]\d+(\.[\d]+)?%?/,
    rposition = /^\w+/,
    rpercent = /%$/,
    _position = $.fn.position;

function getOffsets( offsets, width, height ) {
    return [
        parseFloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
        parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
    ];
}

function parseCss( element, property ) {
    return parseInt( $.css( element, property ), 10 ) || 0;
}

function getDimensions( elem ) {
    var raw = elem[0];
    if ( raw.nodeType === 9 ) {
        return {
            width: elem.width(),
            height: elem.height(),
            offset: { top: 0, left: 0 }
        };
    }
    if ( $.isWindow( raw ) ) {
        return {
            width: elem.width(),
            height: elem.height(),
            offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
        };
    }
    if ( raw.preventDefault ) {
        return {
            width: 0,
            height: 0,
            offset: { top: raw.pageY, left: raw.pageX }
        };
    }
    return {
        width: elem.outerWidth(),
        height: elem.outerHeight(),
        offset: elem.offset()
    };
}

$.position = {
    scrollbarWidth: function() {
        if ( cachedScrollbarWidth !== undefined ) {
            return cachedScrollbarWidth;
        }
        var w1, w2,
            div = $( "<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>" ),
            innerDiv = div.children()[0];

        $( "body" ).append( div );
        w1 = innerDiv.offsetWidth;
        div.css( "overflow", "scroll" );

        w2 = innerDiv.offsetWidth;

        if ( w1 === w2 ) {
            w2 = div[0].clientWidth;
        }

        div.remove();

        return (cachedScrollbarWidth = w1 - w2);
    },
    getScrollInfo: function( within ) {
        var overflowX = within.isWindow || within.isDocument ? "" :
                within.element.css( "overflow-x" ),
            overflowY = within.isWindow || within.isDocument ? "" :
                within.element.css( "overflow-y" ),
            hasOverflowX = overflowX === "scroll" ||
                ( overflowX === "auto" && within.width < within.element[0].scrollWidth ),
            hasOverflowY = overflowY === "scroll" ||
                ( overflowY === "auto" && within.height < within.element[0].scrollHeight );
        return {
            width: hasOverflowY ? $.position.scrollbarWidth() : 0,
            height: hasOverflowX ? $.position.scrollbarWidth() : 0
        };
    },
    getWithinInfo: function( element ) {
        var withinElement = $( element || window ),
            isWindow = $.isWindow( withinElement[0] ),
            isDocument = !!withinElement[ 0 ] && withinElement[ 0 ].nodeType === 9;
        return {
            element: withinElement,
            isWindow: isWindow,
            isDocument: isDocument,
            offset: withinElement.offset() || { left: 0, top: 0 },
            scrollLeft: withinElement.scrollLeft(),
            scrollTop: withinElement.scrollTop(),

            // support: jQuery 1.6.x
            // jQuery 1.6 doesn't support .outerWidth/Height() on documents or windows
            width: isWindow || isDocument ? withinElement.width() : withinElement.outerWidth(),
            height: isWindow || isDocument ? withinElement.height() : withinElement.outerHeight()
        };
    }
};

$.fn.position = function( options ) {
    if ( !options || !options.of ) {
        return _position.apply( this, arguments );
    }

    // make a copy, we don't want to modify arguments
    options = $.extend( {}, options );

    var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
        target = $( options.of ),
        within = $.position.getWithinInfo( options.within ),
        scrollInfo = $.position.getScrollInfo( within ),
        collision = ( options.collision || "flip" ).split( " " ),
        offsets = {};

    dimensions = getDimensions( target );
    if ( target[0].preventDefault ) {
        // force left top to allow flipping
        options.at = "left top";
    }
    targetWidth = dimensions.width;
    targetHeight = dimensions.height;
    targetOffset = dimensions.offset;
    // clone to reuse original targetOffset later
    basePosition = $.extend( {}, targetOffset );

    // force my and at to have valid horizontal and vertical positions
    // if a value is missing or invalid, it will be converted to center
    $.each( [ "my", "at" ], function() {
        var pos = ( options[ this ] || "" ).split( " " ),
            horizontalOffset,
            verticalOffset;

        if ( pos.length === 1) {
            pos = rhorizontal.test( pos[ 0 ] ) ?
                pos.concat( [ "center" ] ) :
                rvertical.test( pos[ 0 ] ) ?
                    [ "center" ].concat( pos ) :
                    [ "center", "center" ];
        }
        pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
        pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

        // calculate offsets
        horizontalOffset = roffset.exec( pos[ 0 ] );
        verticalOffset = roffset.exec( pos[ 1 ] );
        offsets[ this ] = [
            horizontalOffset ? horizontalOffset[ 0 ] : 0,
            verticalOffset ? verticalOffset[ 0 ] : 0
        ];

        // reduce to just the positions without the offsets
        options[ this ] = [
            rposition.exec( pos[ 0 ] )[ 0 ],
            rposition.exec( pos[ 1 ] )[ 0 ]
        ];
    });

    // normalize collision option
    if ( collision.length === 1 ) {
        collision[ 1 ] = collision[ 0 ];
    }

    if ( options.at[ 0 ] === "right" ) {
        basePosition.left += targetWidth;
    } else if ( options.at[ 0 ] === "center" ) {
        basePosition.left += targetWidth / 2;
    }

    if ( options.at[ 1 ] === "bottom" ) {
        basePosition.top += targetHeight;
    } else if ( options.at[ 1 ] === "center" ) {
        basePosition.top += targetHeight / 2;
    }

    atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
    basePosition.left += atOffset[ 0 ];
    basePosition.top += atOffset[ 1 ];

    return this.each(function() {
        var collisionPosition, using,
            elem = $( this ),
            elemWidth = elem.outerWidth(),
            elemHeight = elem.outerHeight(),
            marginLeft = parseCss( this, "marginLeft" ),
            marginTop = parseCss( this, "marginTop" ),
            collisionWidth = elemWidth + marginLeft + parseCss( this, "marginRight" ) + scrollInfo.width,
            collisionHeight = elemHeight + marginTop + parseCss( this, "marginBottom" ) + scrollInfo.height,
            position = $.extend( {}, basePosition ),
            myOffset = getOffsets( offsets.my, elem.outerWidth(), elem.outerHeight() );

        if ( options.my[ 0 ] === "right" ) {
            position.left -= elemWidth;
        } else if ( options.my[ 0 ] === "center" ) {
            position.left -= elemWidth / 2;
        }

        if ( options.my[ 1 ] === "bottom" ) {
            position.top -= elemHeight;
        } else if ( options.my[ 1 ] === "center" ) {
            position.top -= elemHeight / 2;
        }

        position.left += myOffset[ 0 ];
        position.top += myOffset[ 1 ];

        // if the browser doesn't support fractions, then round for consistent results
        if ( !supportsOffsetFractions ) {
            position.left = round( position.left );
            position.top = round( position.top );
        }

        collisionPosition = {
            marginLeft: marginLeft,
            marginTop: marginTop
        };

        $.each( [ "left", "top" ], function( i, dir ) {
            if ( $.ui.position[ collision[ i ] ] ) {
                $.ui.position[ collision[ i ] ][ dir ]( position, {
                    targetWidth: targetWidth,
                    targetHeight: targetHeight,
                    elemWidth: elemWidth,
                    elemHeight: elemHeight,
                    collisionPosition: collisionPosition,
                    collisionWidth: collisionWidth,
                    collisionHeight: collisionHeight,
                    offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
                    my: options.my,
                    at: options.at,
                    within: within,
                    elem: elem
                });
            }
        });

        if ( options.using ) {
            // adds feedback as second argument to using callback, if present
            using = function( props ) {
                var left = targetOffset.left - position.left,
                    right = left + targetWidth - elemWidth,
                    top = targetOffset.top - position.top,
                    bottom = top + targetHeight - elemHeight,
                    feedback = {
                        target: {
                            element: target,
                            left: targetOffset.left,
                            top: targetOffset.top,
                            width: targetWidth,
                            height: targetHeight
                        },
                        element: {
                            element: elem,
                            left: position.left,
                            top: position.top,
                            width: elemWidth,
                            height: elemHeight
                        },
                        horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
                        vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
                    };
                if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
                    feedback.horizontal = "center";
                }
                if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
                    feedback.vertical = "middle";
                }
                if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
                    feedback.important = "horizontal";
                } else {
                    feedback.important = "vertical";
                }
                options.using.call( this, props, feedback );
            };
        }

        elem.offset( $.extend( position, { using: using } ) );
    });
};

$.ui.position = {
    fit: {
        left: function( position, data ) {
            var within = data.within,
                withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
                outerWidth = within.width,
                collisionPosLeft = position.left - data.collisionPosition.marginLeft,
                overLeft = withinOffset - collisionPosLeft,
                overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
                newOverRight;

            // element is wider than within
            if ( data.collisionWidth > outerWidth ) {
                // element is initially over the left side of within
                if ( overLeft > 0 && overRight <= 0 ) {
                    newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
                    position.left += overLeft - newOverRight;
                // element is initially over right side of within
                } else if ( overRight > 0 && overLeft <= 0 ) {
                    position.left = withinOffset;
                // element is initially over both left and right sides of within
                } else {
                    if ( overLeft > overRight ) {
                        position.left = withinOffset + outerWidth - data.collisionWidth;
                    } else {
                        position.left = withinOffset;
                    }
                }
            // too far left -> align with left edge
            } else if ( overLeft > 0 ) {
                position.left += overLeft;
            // too far right -> align with right edge
            } else if ( overRight > 0 ) {
                position.left -= overRight;
            // adjust based on position and margin
            } else {
                position.left = max( position.left - collisionPosLeft, position.left );
            }
        },
        top: function( position, data ) {
            var within = data.within,
                withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
                outerHeight = data.within.height,
                collisionPosTop = position.top - data.collisionPosition.marginTop,
                overTop = withinOffset - collisionPosTop,
                overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
                newOverBottom;

            // element is taller than within
            if ( data.collisionHeight > outerHeight ) {
                // element is initially over the top of within
                if ( overTop > 0 && overBottom <= 0 ) {
                    newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
                    position.top += overTop - newOverBottom;
                // element is initially over bottom of within
                } else if ( overBottom > 0 && overTop <= 0 ) {
                    position.top = withinOffset;
                // element is initially over both top and bottom of within
                } else {
                    if ( overTop > overBottom ) {
                        position.top = withinOffset + outerHeight - data.collisionHeight;
                    } else {
                        position.top = withinOffset;
                    }
                }
            // too far up -> align with top
            } else if ( overTop > 0 ) {
                position.top += overTop;
            // too far down -> align with bottom edge
            } else if ( overBottom > 0 ) {
                position.top -= overBottom;
            // adjust based on position and margin
            } else {
                position.top = max( position.top - collisionPosTop, position.top );
            }
        }
    },
    flip: {
        left: function( position, data ) {
            var within = data.within,
                withinOffset = within.offset.left + within.scrollLeft,
                outerWidth = within.width,
                offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
                collisionPosLeft = position.left - data.collisionPosition.marginLeft,
                overLeft = collisionPosLeft - offsetLeft,
                overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
                myOffset = data.my[ 0 ] === "left" ?
                    -data.elemWidth :
                    data.my[ 0 ] === "right" ?
                        data.elemWidth :
                        0,
                atOffset = data.at[ 0 ] === "left" ?
                    data.targetWidth :
                    data.at[ 0 ] === "right" ?
                        -data.targetWidth :
                        0,
                offset = -2 * data.offset[ 0 ],
                newOverRight,
                newOverLeft;

            if ( overLeft < 0 ) {
                newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
                if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
                    position.left += myOffset + atOffset + offset;
                }
            } else if ( overRight > 0 ) {
                newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
                if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
                    position.left += myOffset + atOffset + offset;
                }
            }
        },
        top: function( position, data ) {
            var within = data.within,
                withinOffset = within.offset.top + within.scrollTop,
                outerHeight = within.height,
                offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
                collisionPosTop = position.top - data.collisionPosition.marginTop,
                overTop = collisionPosTop - offsetTop,
                overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
                top = data.my[ 1 ] === "top",
                myOffset = top ?
                    -data.elemHeight :
                    data.my[ 1 ] === "bottom" ?
                        data.elemHeight :
                        0,
                atOffset = data.at[ 1 ] === "top" ?
                    data.targetHeight :
                    data.at[ 1 ] === "bottom" ?
                        -data.targetHeight :
                        0,
                offset = -2 * data.offset[ 1 ],
                newOverTop,
                newOverBottom;
            if ( overTop < 0 ) {
                newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
                if ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) {
                    position.top += myOffset + atOffset + offset;
                }
            } else if ( overBottom > 0 ) {
                newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
                if ( newOverTop > 0 || abs( newOverTop ) < overBottom ) {
                    position.top += myOffset + atOffset + offset;
                }
            }
        }
    },
    flipfit: {
        left: function() {
            $.ui.position.flip.left.apply( this, arguments );
            $.ui.position.fit.left.apply( this, arguments );
        },
        top: function() {
            $.ui.position.flip.top.apply( this, arguments );
            $.ui.position.fit.top.apply( this, arguments );
        }
    }
};

// fraction support test
(function() {
    var testElement, testElementParent, testElementStyle, offsetLeft, i,
        body = document.getElementsByTagName( "body" )[ 0 ],
        div = document.createElement( "div" );

    //Create a "fake body" for testing based on method used in jQuery.support
    testElement = document.createElement( body ? "div" : "body" );
    testElementStyle = {
        visibility: "hidden",
        width: 0,
        height: 0,
        border: 0,
        margin: 0,
        background: "none"
    };
    if ( body ) {
        $.extend( testElementStyle, {
            position: "absolute",
            left: "-1000px",
            top: "-1000px"
        });
    }
    for ( i in testElementStyle ) {
        testElement.style[ i ] = testElementStyle[ i ];
    }
    testElement.appendChild( div );
    testElementParent = body || document.documentElement;
    testElementParent.insertBefore( testElement, testElementParent.firstChild );

    div.style.cssText = "position: absolute; left: 10.7432222px;";

    offsetLeft = $( div ).offset().left;
    supportsOffsetFractions = offsetLeft > 10 && offsetLeft < 11;

    testElement.innerHTML = "";
    testElementParent.removeChild( testElement );
})();

})();

var position = $.ui.position;


/*!
 * jQuery UI Datepicker 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/datepicker/
 */


$.extend($.ui, { datepicker: { version: "1.11.4" } });

var datepicker_instActive;

function datepicker_getZindex( elem ) {
    var position, value;
    while ( elem.length && elem[ 0 ] !== document ) {
        // Ignore z-index if position is set to a value where z-index is ignored by the browser
        // This makes behavior of this function consistent across browsers
        // WebKit always returns auto if the element is positioned
        position = elem.css( "position" );
        if ( position === "absolute" || position === "relative" || position === "fixed" ) {
            // IE returns 0 when zIndex is not specified
            // other browsers return a string
            // we ignore the case of nested elements with an explicit value of 0
            // <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
            value = parseInt( elem.css( "zIndex" ), 10 );
            if ( !isNaN( value ) && value !== 0 ) {
                return value;
            }
        }
        elem = elem.parent();
    }

    return 0;
}
/* Date picker manager.
   Use the singleton instance of this class, $.datepicker, to interact with the date picker.
   Settings for (groups of) date pickers are maintained in an instance object,
   allowing multiple different settings on the same page. */

function Datepicker() {
    this._curInst = null; // The current instance in use
    this._keyEvent = false; // If the last event was a key event
    this._disabledInputs = []; // List of date picker inputs that have been disabled
    this._datepickerShowing = false; // True if the popup picker is showing , false if not
    this._inDialog = false; // True if showing within a "dialog", false if not
    this._mainDivId = "ui-datepicker-div"; // The ID of the main datepicker division
    this._inlineClass = "ui-datepicker-inline"; // The name of the inline marker class
    this._appendClass = "ui-datepicker-append"; // The name of the append marker class
    this._triggerClass = "ui-datepicker-trigger"; // The name of the trigger marker class
    this._dialogClass = "ui-datepicker-dialog"; // The name of the dialog marker class
    this._disableClass = "ui-datepicker-disabled"; // The name of the disabled covering marker class
    this._unselectableClass = "ui-datepicker-unselectable"; // The name of the unselectable cell marker class
    this._currentClass = "ui-datepicker-current-day"; // The name of the current day marker class
    this._dayOverClass = "ui-datepicker-days-cell-over"; // The name of the day hover marker class
    this.regional = []; // Available regional settings, indexed by language code
    this.regional[""] = { // Default regional settings
        closeText: "Done", // Display text for close link
        prevText: "Prev", // Display text for previous month link
        nextText: "Next", // Display text for next month link
        currentText: "Today", // Display text for current month link
        monthNames: ["January","February","March","April","May","June",
            "July","August","September","October","November","December"], // Names of months for drop-down and formatting
        monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // For formatting
        dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], // For formatting
        dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], // For formatting
        dayNamesMin: ["Su","Mo","Tu","We","Th","Fr","Sa"], // Column headings for days starting at Sunday
        weekHeader: "Wk", // Column header for week of the year
        dateFormat: "mm/dd/yy", // See format options on parseDate
        firstDay: 0, // The first day of the week, Sun = 0, Mon = 1, ...
        isRTL: false, // True if right-to-left language, false if left-to-right
        showMonthAfterYear: false, // True if the year select precedes month, false for month then year
        yearSuffix: "" // Additional text to append to the year in the month headers
    };
    this._defaults = { // Global defaults for all the date picker instances
        showOn: "focus", // "focus" for popup on focus,
            // "button" for trigger button, or "both" for either
        showAnim: "fadeIn", // Name of jQuery animation for popup
        showOptions: {}, // Options for enhanced animations
        defaultDate: null, // Used when field is blank: actual date,
            // +/-number for offset from today, null for today
        appendText: "", // Display text following the input box, e.g. showing the format
        buttonText: "...", // Text for trigger button
        buttonImage: "", // URL for trigger button image
        buttonImageOnly: false, // True if the image appears alone, false if it appears on a button
        hideIfNoPrevNext: false, // True to hide next/previous month links
            // if not applicable, false to just disable them
        navigationAsDateFormat: false, // True if date formatting applied to prev/today/next links
        gotoCurrent: false, // True if today link goes back to current selection instead
        changeMonth: false, // True if month can be selected directly, false if only prev/next
        changeYear: false, // True if year can be selected directly, false if only prev/next
        yearRange: "c-10:c+10", // Range of years to display in drop-down,
            // either relative to today's year (-nn:+nn), relative to currently displayed year
            // (c-nn:c+nn), absolute (nnnn:nnnn), or a combination of the above (nnnn:-n)
        showOtherMonths: false, // True to show dates in other months, false to leave blank
        selectOtherMonths: false, // True to allow selection of dates in other months, false for unselectable
        showWeek: false, // True to show week of the year, false to not show it
        calculateWeek: this.iso8601Week, // How to calculate the week of the year,
            // takes a Date and returns the number of the week for it
        shortYearCutoff: "+10", // Short year values < this are in the current century,
            // > this are in the previous century,
            // string value starting with "+" for current year + value
        minDate: null, // The earliest selectable date, or null for no limit
        maxDate: null, // The latest selectable date, or null for no limit
        duration: "fast", // Duration of display/closure
        beforeShowDay: null, // Function that takes a date and returns an array with
            // [0] = true if selectable, false if not, [1] = custom CSS class name(s) or "",
            // [2] = cell title (optional), e.g. $.datepicker.noWeekends
        beforeShow: null, // Function that takes an input field and
            // returns a set of custom settings for the date picker
        onSelect: null, // Define a callback function when a date is selected
        onChangeMonthYear: null, // Define a callback function when the month or year is changed
        onClose: null, // Define a callback function when the datepicker is closed
        numberOfMonths: 1, // Number of months to show at a time
        showCurrentAtPos: 0, // The position in multipe months at which to show the current month (starting at 0)
        stepMonths: 1, // Number of months to step back/forward
        stepBigMonths: 12, // Number of months to step back/forward for the big links
        altField: "", // Selector for an alternate field to store selected dates into
        altFormat: "", // The date format to use for the alternate field
        constrainInput: true, // The input is constrained by the current date format
        showButtonPanel: false, // True to show button panel, false to not show it
        autoSize: false, // True to size the input for the date format, false to leave as is
        disabled: false // The initial disabled state
    };
    $.extend(this._defaults, this.regional[""]);
    this.regional.en = $.extend( true, {}, this.regional[ "" ]);
    this.regional[ "en-US" ] = $.extend( true, {}, this.regional.en );
    this.dpDiv = datepicker_bindHover($("<div id='" + this._mainDivId + "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"));
}

$.extend(Datepicker.prototype, {
    /* Class name added to elements to indicate already configured with a date picker. */
    markerClassName: "hasDatepicker",

    //Keep track of the maximum number of rows displayed (see #7043)
    maxRows: 4,

    // TODO rename to "widget" when switching to widget factory
    _widgetDatepicker: function() {
        return this.dpDiv;
    },

    /* Override the default settings for all instances of the date picker.
     * @param  settings  object - the new settings to use as defaults (anonymous object)
     * @return the manager object
     */
    setDefaults: function(settings) {
        datepicker_extendRemove(this._defaults, settings || {});
        return this;
    },

    /* Attach the date picker to a jQuery selection.
     * @param  target   element - the target input field or division or span
     * @param  settings  object - the new settings to use for this date picker instance (anonymous)
     */
    _attachDatepicker: function(target, settings) {
        var nodeName, inline, inst;
        nodeName = target.nodeName.toLowerCase();
        inline = (nodeName === "div" || nodeName === "span");
        if (!target.id) {
            this.uuid += 1;
            target.id = "dp" + this.uuid;
        }
        inst = this._newInst($(target), inline);
        inst.settings = $.extend({}, settings || {});
        if (nodeName === "input") {
            this._connectDatepicker(target, inst);
        } else if (inline) {
            this._inlineDatepicker(target, inst);
        }
    },

    /* Create a new instance object. */
    _newInst: function(target, inline) {
        var id = target[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1"); // escape jQuery meta chars
        return {id: id, input: target, // associated target
            selectedDay: 0, selectedMonth: 0, selectedYear: 0, // current selection
            drawMonth: 0, drawYear: 0, // month being drawn
            inline: inline, // is datepicker inline or not
            dpDiv: (!inline ? this.dpDiv : // presentation div
            datepicker_bindHover($("<div class='" + this._inlineClass + " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")))};
    },

    /* Attach the date picker to an input field. */
    _connectDatepicker: function(target, inst) {
        var input = $(target);
        inst.append = $([]);
        inst.trigger = $([]);
        if (input.hasClass(this.markerClassName)) {
            return;
        }
        this._attachments(input, inst);
        input.addClass(this.markerClassName).keydown(this._doKeyDown).
            keypress(this._doKeyPress).keyup(this._doKeyUp);
        this._autoSize(inst);
        $.data(target, "datepicker", inst);
        //If disabled option is true, disable the datepicker once it has been attached to the input (see ticket #5665)
        if( inst.settings.disabled ) {
            this._disableDatepicker( target );
        }
    },

    /* Make attachments based on settings. */
    _attachments: function(input, inst) {
        var showOn, buttonText, buttonImage,
            appendText = this._get(inst, "appendText"),
            isRTL = this._get(inst, "isRTL");

        if (inst.append) {
            inst.append.remove();
        }
        if (appendText) {
            inst.append = $("<span class='" + this._appendClass + "'>" + appendText + "</span>");
            input[isRTL ? "before" : "after"](inst.append);
        }

        input.unbind("focus", this._showDatepicker);

        if (inst.trigger) {
            inst.trigger.remove();
        }

        showOn = this._get(inst, "showOn");
        if (showOn === "focus" || showOn === "both") { // pop-up date picker when in the marked field
            input.focus(this._showDatepicker);
        }
        if (showOn === "button" || showOn === "both") { // pop-up date picker when button clicked
            buttonText = this._get(inst, "buttonText");
            buttonImage = this._get(inst, "buttonImage");
            inst.trigger = $(this._get(inst, "buttonImageOnly") ?
                $("<img/>").addClass(this._triggerClass).
                    attr({ src: buttonImage, alt: buttonText, title: buttonText }) :
                $("<button type='button'></button>").addClass(this._triggerClass).
                    html(!buttonImage ? buttonText : $("<img/>").attr(
                    { src:buttonImage, alt:buttonText, title:buttonText })));
            input[isRTL ? "before" : "after"](inst.trigger);
            inst.trigger.click(function() {
                if ($.datepicker._datepickerShowing && $.datepicker._lastInput === input[0]) {
                    $.datepicker._hideDatepicker();
                } else if ($.datepicker._datepickerShowing && $.datepicker._lastInput !== input[0]) {
                    $.datepicker._hideDatepicker();
                    $.datepicker._showDatepicker(input[0]);
                } else {
                    $.datepicker._showDatepicker(input[0]);
                }
                return false;
            });
        }
    },

    /* Apply the maximum length for the date format. */
    _autoSize: function(inst) {
        if (this._get(inst, "autoSize") && !inst.inline) {
            var findMax, max, maxI, i,
                date = new Date(2009, 12 - 1, 20), // Ensure double digits
                dateFormat = this._get(inst, "dateFormat");

            if (dateFormat.match(/[DM]/)) {
                findMax = function(names) {
                    max = 0;
                    maxI = 0;
                    for (i = 0; i < names.length; i++) {
                        if (names[i].length > max) {
                            max = names[i].length;
                            maxI = i;
                        }
                    }
                    return maxI;
                };
                date.setMonth(findMax(this._get(inst, (dateFormat.match(/MM/) ?
                    "monthNames" : "monthNamesShort"))));
                date.setDate(findMax(this._get(inst, (dateFormat.match(/DD/) ?
                    "dayNames" : "dayNamesShort"))) + 20 - date.getDay());
            }
            inst.input.attr("size", this._formatDate(inst, date).length);
        }
    },

    /* Attach an inline date picker to a div. */
    _inlineDatepicker: function(target, inst) {
        var divSpan = $(target);
        if (divSpan.hasClass(this.markerClassName)) {
            return;
        }
        divSpan.addClass(this.markerClassName).append(inst.dpDiv);
        $.data(target, "datepicker", inst);
        this._setDate(inst, this._getDefaultDate(inst), true);
        this._updateDatepicker(inst);
        this._updateAlternate(inst);
        //If disabled option is true, disable the datepicker before showing it (see ticket #5665)
        if( inst.settings.disabled ) {
            this._disableDatepicker( target );
        }
        // Set display:block in place of inst.dpDiv.show() which won't work on disconnected elements
        // http://bugs.jqueryui.com/ticket/7552 - A Datepicker created on a detached div has zero height
        inst.dpDiv.css( "display", "block" );
    },

    /* Pop-up the date picker in a "dialog" box.
     * @param  input element - ignored
     * @param  date string or Date - the initial date to display
     * @param  onSelect  function - the function to call when a date is selected
     * @param  settings  object - update the dialog date picker instance's settings (anonymous object)
     * @param  pos int[2] - coordinates for the dialog's position within the screen or
     *                  event - with x/y coordinates or
     *                  leave empty for default (screen centre)
     * @return the manager object
     */
    _dialogDatepicker: function(input, date, onSelect, settings, pos) {
        var id, browserWidth, browserHeight, scrollX, scrollY,
            inst = this._dialogInst; // internal instance

        if (!inst) {
            this.uuid += 1;
            id = "dp" + this.uuid;
            this._dialogInput = $("<input type='text' id='" + id +
                "' style='position: absolute; top: -100px; width: 0px;'/>");
            this._dialogInput.keydown(this._doKeyDown);
            $("body").append(this._dialogInput);
            inst = this._dialogInst = this._newInst(this._dialogInput, false);
            inst.settings = {};
            $.data(this._dialogInput[0], "datepicker", inst);
        }
        datepicker_extendRemove(inst.settings, settings || {});
        date = (date && date.constructor === Date ? this._formatDate(inst, date) : date);
        this._dialogInput.val(date);

        this._pos = (pos ? (pos.length ? pos : [pos.pageX, pos.pageY]) : null);
        if (!this._pos) {
            browserWidth = document.documentElement.clientWidth;
            browserHeight = document.documentElement.clientHeight;
            scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
            scrollY = document.documentElement.scrollTop || document.body.scrollTop;
            this._pos = // should use actual width/height below
                [(browserWidth / 2) - 100 + scrollX, (browserHeight / 2) - 150 + scrollY];
        }

        // move input on screen for focus, but hidden behind dialog
        this._dialogInput.css("left", (this._pos[0] + 20) + "px").css("top", this._pos[1] + "px");
        inst.settings.onSelect = onSelect;
        this._inDialog = true;
        this.dpDiv.addClass(this._dialogClass);
        this._showDatepicker(this._dialogInput[0]);
        if ($.blockUI) {
            $.blockUI(this.dpDiv);
        }
        $.data(this._dialogInput[0], "datepicker", inst);
        return this;
    },

    /* Detach a datepicker from its control.
     * @param  target   element - the target input field or division or span
     */
    _destroyDatepicker: function(target) {
        var nodeName,
            $target = $(target),
            inst = $.data(target, "datepicker");

        if (!$target.hasClass(this.markerClassName)) {
            return;
        }

        nodeName = target.nodeName.toLowerCase();
        $.removeData(target, "datepicker");
        if (nodeName === "input") {
            inst.append.remove();
            inst.trigger.remove();
            $target.removeClass(this.markerClassName).
                unbind("focus", this._showDatepicker).
                unbind("keydown", this._doKeyDown).
                unbind("keypress", this._doKeyPress).
                unbind("keyup", this._doKeyUp);
        } else if (nodeName === "div" || nodeName === "span") {
            $target.removeClass(this.markerClassName).empty();
        }

        if ( datepicker_instActive === inst ) {
            datepicker_instActive = null;
        }
    },

    /* Enable the date picker to a jQuery selection.
     * @param  target   element - the target input field or division or span
     */
    _enableDatepicker: function(target) {
        var nodeName, inline,
            $target = $(target),
            inst = $.data(target, "datepicker");

        if (!$target.hasClass(this.markerClassName)) {
            return;
        }

        nodeName = target.nodeName.toLowerCase();
        if (nodeName === "input") {
            target.disabled = false;
            inst.trigger.filter("button").
                each(function() { this.disabled = false; }).end().
                filter("img").css({opacity: "1.0", cursor: ""});
        } else if (nodeName === "div" || nodeName === "span") {
            inline = $target.children("." + this._inlineClass);
            inline.children().removeClass("ui-state-disabled");
            inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
                prop("disabled", false);
        }
        this._disabledInputs = $.map(this._disabledInputs,
            function(value) { return (value === target ? null : value); }); // delete entry
    },

    /* Disable the date picker to a jQuery selection.
     * @param  target   element - the target input field or division or span
     */
    _disableDatepicker: function(target) {
        var nodeName, inline,
            $target = $(target),
            inst = $.data(target, "datepicker");

        if (!$target.hasClass(this.markerClassName)) {
            return;
        }

        nodeName = target.nodeName.toLowerCase();
        if (nodeName === "input") {
            target.disabled = true;
            inst.trigger.filter("button").
                each(function() { this.disabled = true; }).end().
                filter("img").css({opacity: "0.5", cursor: "default"});
        } else if (nodeName === "div" || nodeName === "span") {
            inline = $target.children("." + this._inlineClass);
            inline.children().addClass("ui-state-disabled");
            inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
                prop("disabled", true);
        }
        this._disabledInputs = $.map(this._disabledInputs,
            function(value) { return (value === target ? null : value); }); // delete entry
        this._disabledInputs[this._disabledInputs.length] = target;
    },

    /* Is the first field in a jQuery collection disabled as a datepicker?
     * @param  target   element - the target input field or division or span
     * @return boolean - true if disabled, false if enabled
     */
    _isDisabledDatepicker: function(target) {
        if (!target) {
            return false;
        }
        for (var i = 0; i < this._disabledInputs.length; i++) {
            if (this._disabledInputs[i] === target) {
                return true;
            }
        }
        return false;
    },

    /* Retrieve the instance data for the target control.
     * @param  target  element - the target input field or division or span
     * @return  object - the associated instance data
     * @throws  error if a jQuery problem getting data
     */
    _getInst: function(target) {
        try {
            return $.data(target, "datepicker");
        }
        catch (err) {
            throw "Missing instance data for this datepicker";
        }
    },

    /* Update or retrieve the settings for a date picker attached to an input field or division.
     * @param  target  element - the target input field or division or span
     * @param  name object - the new settings to update or
     *              string - the name of the setting to change or retrieve,
     *              when retrieving also "all" for all instance settings or
     *              "defaults" for all global defaults
     * @param  value   any - the new value for the setting
     *              (omit if above is an object or to retrieve a value)
     */
    _optionDatepicker: function(target, name, value) {
        var settings, date, minDate, maxDate,
            inst = this._getInst(target);

        if (arguments.length === 2 && typeof name === "string") {
            return (name === "defaults" ? $.extend({}, $.datepicker._defaults) :
                (inst ? (name === "all" ? $.extend({}, inst.settings) :
                this._get(inst, name)) : null));
        }

        settings = name || {};
        if (typeof name === "string") {
            settings = {};
            settings[name] = value;
        }

        if (inst) {
            if (this._curInst === inst) {
                this._hideDatepicker();
            }

            date = this._getDateDatepicker(target, true);
            minDate = this._getMinMaxDate(inst, "min");
            maxDate = this._getMinMaxDate(inst, "max");
            datepicker_extendRemove(inst.settings, settings);
            // reformat the old minDate/maxDate values if dateFormat changes and a new minDate/maxDate isn't provided
            if (minDate !== null && settings.dateFormat !== undefined && settings.minDate === undefined) {
                inst.settings.minDate = this._formatDate(inst, minDate);
            }
            if (maxDate !== null && settings.dateFormat !== undefined && settings.maxDate === undefined) {
                inst.settings.maxDate = this._formatDate(inst, maxDate);
            }
            if ( "disabled" in settings ) {
                if ( settings.disabled ) {
                    this._disableDatepicker(target);
                } else {
                    this._enableDatepicker(target);
                }
            }
            this._attachments($(target), inst);
            this._autoSize(inst);
            this._setDate(inst, date);
            this._updateAlternate(inst);
            this._updateDatepicker(inst);
        }
    },

    // change method deprecated
    _changeDatepicker: function(target, name, value) {
        this._optionDatepicker(target, name, value);
    },

    /* Redraw the date picker attached to an input field or division.
     * @param  target  element - the target input field or division or span
     */
    _refreshDatepicker: function(target) {
        var inst = this._getInst(target);
        if (inst) {
            this._updateDatepicker(inst);
        }
    },

    /* Set the dates for a jQuery selection.
     * @param  target element - the target input field or division or span
     * @param  date Date - the new date
     */
    _setDateDatepicker: function(target, date) {
        var inst = this._getInst(target);
        if (inst) {
            this._setDate(inst, date);
            this._updateDatepicker(inst);
            this._updateAlternate(inst);
        }
    },

    /* Get the date(s) for the first entry in a jQuery selection.
     * @param  target element - the target input field or division or span
     * @param  noDefault boolean - true if no default date is to be used
     * @return Date - the current date
     */
    _getDateDatepicker: function(target, noDefault) {
        var inst = this._getInst(target);
        if (inst && !inst.inline) {
            this._setDateFromField(inst, noDefault);
        }
        return (inst ? this._getDate(inst) : null);
    },

    /* Handle keystrokes. */
    _doKeyDown: function(event) {
        var onSelect, dateStr, sel,
            inst = $.datepicker._getInst(event.target),
            handled = true,
            isRTL = inst.dpDiv.is(".ui-datepicker-rtl");

        inst._keyEvent = true;
        if ($.datepicker._datepickerShowing) {
            switch (event.keyCode) {
                case 9: $.datepicker._hideDatepicker();
                        handled = false;
                        break; // hide on tab out
                case 13: sel = $("td." + $.datepicker._dayOverClass + ":not(." +
                                    $.datepicker._currentClass + ")", inst.dpDiv);
                        if (sel[0]) {
                            $.datepicker._selectDay(event.target, inst.selectedMonth, inst.selectedYear, sel[0]);
                        }

                        onSelect = $.datepicker._get(inst, "onSelect");
                        if (onSelect) {
                            dateStr = $.datepicker._formatDate(inst);

                            // trigger custom callback
                            onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);
                        } else {
                            $.datepicker._hideDatepicker();
                        }

                        return false; // don't submit the form
                case 27: $.datepicker._hideDatepicker();
                        break; // hide on escape
                case 33: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
                            -$.datepicker._get(inst, "stepBigMonths") :
                            -$.datepicker._get(inst, "stepMonths")), "M");
                        break; // previous month/year on page up/+ ctrl
                case 34: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
                            +$.datepicker._get(inst, "stepBigMonths") :
                            +$.datepicker._get(inst, "stepMonths")), "M");
                        break; // next month/year on page down/+ ctrl
                case 35: if (event.ctrlKey || event.metaKey) {
                            $.datepicker._clearDate(event.target);
                        }
                        handled = event.ctrlKey || event.metaKey;
                        break; // clear on ctrl or command +end
                case 36: if (event.ctrlKey || event.metaKey) {
                            $.datepicker._gotoToday(event.target);
                        }
                        handled = event.ctrlKey || event.metaKey;
                        break; // current on ctrl or command +home
                case 37: if (event.ctrlKey || event.metaKey) {
                            $.datepicker._adjustDate(event.target, (isRTL ? +1 : -1), "D");
                        }
                        handled = event.ctrlKey || event.metaKey;
                        // -1 day on ctrl or command +left
                        if (event.originalEvent.altKey) {
                            $.datepicker._adjustDate(event.target, (event.ctrlKey ?
                                -$.datepicker._get(inst, "stepBigMonths") :
                                -$.datepicker._get(inst, "stepMonths")), "M");
                        }
                        // next month/year on alt +left on Mac
                        break;
                case 38: if (event.ctrlKey || event.metaKey) {
                            $.datepicker._adjustDate(event.target, -7, "D");
                        }
                        handled = event.ctrlKey || event.metaKey;
                        break; // -1 week on ctrl or command +up
                case 39: if (event.ctrlKey || event.metaKey) {
                            $.datepicker._adjustDate(event.target, (isRTL ? -1 : +1), "D");
                        }
                        handled = event.ctrlKey || event.metaKey;
                        // +1 day on ctrl or command +right
                        if (event.originalEvent.altKey) {
                            $.datepicker._adjustDate(event.target, (event.ctrlKey ?
                                +$.datepicker._get(inst, "stepBigMonths") :
                                +$.datepicker._get(inst, "stepMonths")), "M");
                        }
                        // next month/year on alt +right
                        break;
                case 40: if (event.ctrlKey || event.metaKey) {
                            $.datepicker._adjustDate(event.target, +7, "D");
                        }
                        handled = event.ctrlKey || event.metaKey;
                        break; // +1 week on ctrl or command +down
                default: handled = false;
            }
        } else if (event.keyCode === 36 && event.ctrlKey) { // display the date picker on ctrl+home
            $.datepicker._showDatepicker(this);
        } else {
            handled = false;
        }

        if (handled) {
            event.preventDefault();
            event.stopPropagation();
        }
    },

    /* Filter entered characters - based on date format. */
    _doKeyPress: function(event) {
        var chars, chr,
            inst = $.datepicker._getInst(event.target);

        if ($.datepicker._get(inst, "constrainInput")) {
            chars = $.datepicker._possibleChars($.datepicker._get(inst, "dateFormat"));
            chr = String.fromCharCode(event.charCode == null ? event.keyCode : event.charCode);
            return event.ctrlKey || event.metaKey || (chr < " " || !chars || chars.indexOf(chr) > -1);
        }
    },

    /* Synchronise manual entry and field/alternate field. */
    _doKeyUp: function(event) {
        var date,
            inst = $.datepicker._getInst(event.target);

        if (inst.input.val() !== inst.lastVal) {
            try {
                date = $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"),
                    (inst.input ? inst.input.val() : null),
                    $.datepicker._getFormatConfig(inst));

                if (date) { // only if valid
                    $.datepicker._setDateFromField(inst);
                    $.datepicker._updateAlternate(inst);
                    $.datepicker._updateDatepicker(inst);
                }
            }
            catch (err) {
            }
        }
        return true;
    },

    /* Pop-up the date picker for a given input field.
     * If false returned from beforeShow event handler do not show.
     * @param  input  element - the input field attached to the date picker or
     *                  event - if triggered by focus
     */
    _showDatepicker: function(input) {
        input = input.target || input;
        if (input.nodeName.toLowerCase() !== "input") { // find from button/image trigger
            input = $("input", input.parentNode)[0];
        }

        if ($.datepicker._isDisabledDatepicker(input) || $.datepicker._lastInput === input) { // already here
            return;
        }

        var inst, beforeShow, beforeShowSettings, isFixed,
            offset, showAnim, duration;

        inst = $.datepicker._getInst(input);
        if ($.datepicker._curInst && $.datepicker._curInst !== inst) {
            $.datepicker._curInst.dpDiv.stop(true, true);
            if ( inst && $.datepicker._datepickerShowing ) {
                $.datepicker._hideDatepicker( $.datepicker._curInst.input[0] );
            }
        }

        beforeShow = $.datepicker._get(inst, "beforeShow");
        beforeShowSettings = beforeShow ? beforeShow.apply(input, [input, inst]) : {};
        if(beforeShowSettings === false){
            return;
        }
        datepicker_extendRemove(inst.settings, beforeShowSettings);

        inst.lastVal = null;
        $.datepicker._lastInput = input;
        $.datepicker._setDateFromField(inst);

        if ($.datepicker._inDialog) { // hide cursor
            input.value = "";
        }
        if (!$.datepicker._pos) { // position below input
            $.datepicker._pos = $.datepicker._findPos(input);
            $.datepicker._pos[1] += input.offsetHeight; // add the height
        }

        isFixed = false;
        $(input).parents().each(function() {
            isFixed |= $(this).css("position") === "fixed";
            return !isFixed;
        });

        offset = {left: $.datepicker._pos[0], top: $.datepicker._pos[1]};
        $.datepicker._pos = null;
        //to avoid flashes on Firefox
        inst.dpDiv.empty();
        // determine sizing offscreen
        inst.dpDiv.css({position: "absolute", display: "block", top: "-1000px"});
        $.datepicker._updateDatepicker(inst);
        // fix width for dynamic number of date pickers
        // and adjust position before showing
        offset = $.datepicker._checkOffset(inst, offset, isFixed);
        inst.dpDiv.css({position: ($.datepicker._inDialog && $.blockUI ?
            "static" : (isFixed ? "fixed" : "absolute")), display: "none",
            left: offset.left + "px", top: offset.top + "px"});

        if (!inst.inline) {
            showAnim = $.datepicker._get(inst, "showAnim");
            duration = $.datepicker._get(inst, "duration");
            inst.dpDiv.css( "z-index", datepicker_getZindex( $( input ) ) + 1 );
            $.datepicker._datepickerShowing = true;

            if ( $.effects && $.effects.effect[ showAnim ] ) {
                inst.dpDiv.show(showAnim, $.datepicker._get(inst, "showOptions"), duration);
            } else {
                inst.dpDiv[showAnim || "show"](showAnim ? duration : null);
            }

            if ( $.datepicker._shouldFocusInput( inst ) ) {
                inst.input.focus();
            }

            $.datepicker._curInst = inst;
        }
    },

    /* Generate the date picker content. */
    _updateDatepicker: function(inst) {
        this.maxRows = 4; //Reset the max number of rows being displayed (see #7043)
        datepicker_instActive = inst; // for delegate hover events
        inst.dpDiv.empty().append(this._generateHTML(inst));
        this._attachHandlers(inst);

        var origyearshtml,
            numMonths = this._getNumberOfMonths(inst),
            cols = numMonths[1],
            width = 17,
            activeCell = inst.dpDiv.find( "." + this._dayOverClass + " a" );

        if ( activeCell.length > 0 ) {
            datepicker_handleMouseover.apply( activeCell.get( 0 ) );
        }

        inst.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width("");
        if (cols > 1) {
            inst.dpDiv.addClass("ui-datepicker-multi-" + cols).css("width", (width * cols) + "em");
        }
        inst.dpDiv[(numMonths[0] !== 1 || numMonths[1] !== 1 ? "add" : "remove") +
            "Class"]("ui-datepicker-multi");
        inst.dpDiv[(this._get(inst, "isRTL") ? "add" : "remove") +
            "Class"]("ui-datepicker-rtl");

        if (inst === $.datepicker._curInst && $.datepicker._datepickerShowing && $.datepicker._shouldFocusInput( inst ) ) {
            inst.input.focus();
        }

        // deffered render of the years select (to avoid flashes on Firefox)
        if( inst.yearshtml ){
            origyearshtml = inst.yearshtml;
            setTimeout(function(){
                //assure that inst.yearshtml didn't change.
                if( origyearshtml === inst.yearshtml && inst.yearshtml ){
                    inst.dpDiv.find("select.ui-datepicker-year:first").replaceWith(inst.yearshtml);
                }
                origyearshtml = inst.yearshtml = null;
            }, 0);
        }
    },

    // #6694 - don't focus the input if it's already focused
    // this breaks the change event in IE
    // Support: IE and jQuery <1.9
    _shouldFocusInput: function( inst ) {
        return inst.input && inst.input.is( ":visible" ) && !inst.input.is( ":disabled" ) && !inst.input.is( ":focus" );
    },

    /* Check positioning to remain on screen. */
    _checkOffset: function(inst, offset, isFixed) {
        var dpWidth = inst.dpDiv.outerWidth(),
            dpHeight = inst.dpDiv.outerHeight(),
            inputWidth = inst.input ? inst.input.outerWidth() : 0,
            inputHeight = inst.input ? inst.input.outerHeight() : 0,
            viewWidth = document.documentElement.clientWidth + (isFixed ? 0 : $(document).scrollLeft()),
            viewHeight = document.documentElement.clientHeight + (isFixed ? 0 : $(document).scrollTop());

        offset.left -= (this._get(inst, "isRTL") ? (dpWidth - inputWidth) : 0);
        offset.left -= (isFixed && offset.left === inst.input.offset().left) ? $(document).scrollLeft() : 0;
        offset.top -= (isFixed && offset.top === (inst.input.offset().top + inputHeight)) ? $(document).scrollTop() : 0;

        // now check if datepicker is showing outside window viewport - move to a better place if so.
        offset.left -= Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
            Math.abs(offset.left + dpWidth - viewWidth) : 0);
        offset.top -= Math.min(offset.top, (offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
            Math.abs(dpHeight + inputHeight) : 0);

        return offset;
    },

    /* Find an object's position on the screen. */
    _findPos: function(obj) {
        var position,
            inst = this._getInst(obj),
            isRTL = this._get(inst, "isRTL");

        while (obj && (obj.type === "hidden" || obj.nodeType !== 1 || $.expr.filters.hidden(obj))) {
            obj = obj[isRTL ? "previousSibling" : "nextSibling"];
        }

        position = $(obj).offset();
        return [position.left, position.top];
    },

    /* Hide the date picker from view.
     * @param  input  element - the input field attached to the date picker
     */
    _hideDatepicker: function(input) {
        var showAnim, duration, postProcess, onClose,
            inst = this._curInst;

        if (!inst || (input && inst !== $.data(input, "datepicker"))) {
            return;
        }

        if (this._datepickerShowing) {
            showAnim = this._get(inst, "showAnim");
            duration = this._get(inst, "duration");
            postProcess = function() {
                $.datepicker._tidyDialog(inst);
            };

            // DEPRECATED: after BC for 1.8.x $.effects[ showAnim ] is not needed
            if ( $.effects && ( $.effects.effect[ showAnim ] || $.effects[ showAnim ] ) ) {
                inst.dpDiv.hide(showAnim, $.datepicker._get(inst, "showOptions"), duration, postProcess);
            } else {
                inst.dpDiv[(showAnim === "slideDown" ? "slideUp" :
                    (showAnim === "fadeIn" ? "fadeOut" : "hide"))]((showAnim ? duration : null), postProcess);
            }

            if (!showAnim) {
                postProcess();
            }
            this._datepickerShowing = false;

            onClose = this._get(inst, "onClose");
            if (onClose) {
                onClose.apply((inst.input ? inst.input[0] : null), [(inst.input ? inst.input.val() : ""), inst]);
            }

            this._lastInput = null;
            if (this._inDialog) {
                this._dialogInput.css({ position: "absolute", left: "0", top: "-100px" });
                if ($.blockUI) {
                    $.unblockUI();
                    $("body").append(this.dpDiv);
                }
            }
            this._inDialog = false;
        }
    },

    /* Tidy up after a dialog display. */
    _tidyDialog: function(inst) {
        inst.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar");
    },

    /* Close date picker if clicked elsewhere. */
    _checkExternalClick: function(event) {
        if (!$.datepicker._curInst) {
            return;
        }

        var $target = $(event.target),
            inst = $.datepicker._getInst($target[0]);

        if ( ( ( $target[0].id !== $.datepicker._mainDivId &&
                $target.parents("#" + $.datepicker._mainDivId).length === 0 &&
                !$target.hasClass($.datepicker.markerClassName) &&
                !$target.closest("." + $.datepicker._triggerClass).length &&
                $.datepicker._datepickerShowing && !($.datepicker._inDialog && $.blockUI) ) ) ||
            ( $target.hasClass($.datepicker.markerClassName) && $.datepicker._curInst !== inst ) ) {
                $.datepicker._hideDatepicker();
        }
    },

    /* Adjust one of the date sub-fields. */
    _adjustDate: function(id, offset, period) {
        var target = $(id),
            inst = this._getInst(target[0]);

        if (this._isDisabledDatepicker(target[0])) {
            return;
        }
        this._adjustInstDate(inst, offset +
            (period === "M" ? this._get(inst, "showCurrentAtPos") : 0), // undo positioning
            period);
        this._updateDatepicker(inst);
    },

    /* Action for current link. */
    _gotoToday: function(id) {
        var date,
            target = $(id),
            inst = this._getInst(target[0]);

        if (this._get(inst, "gotoCurrent") && inst.currentDay) {
            inst.selectedDay = inst.currentDay;
            inst.drawMonth = inst.selectedMonth = inst.currentMonth;
            inst.drawYear = inst.selectedYear = inst.currentYear;
        } else {
            date = new Date();
            inst.selectedDay = date.getDate();
            inst.drawMonth = inst.selectedMonth = date.getMonth();
            inst.drawYear = inst.selectedYear = date.getFullYear();
        }
        this._notifyChange(inst);
        this._adjustDate(target);
    },

    /* Action for selecting a new month/year. */
    _selectMonthYear: function(id, select, period) {
        var target = $(id),
            inst = this._getInst(target[0]);

        inst["selected" + (period === "M" ? "Month" : "Year")] =
        inst["draw" + (period === "M" ? "Month" : "Year")] =
            parseInt(select.options[select.selectedIndex].value,10);

        this._notifyChange(inst);
        this._adjustDate(target);
    },

    /* Action for selecting a day. */
    _selectDay: function(id, month, year, td) {
        var inst,
            target = $(id);

        if ($(td).hasClass(this._unselectableClass) || this._isDisabledDatepicker(target[0])) {
            return;
        }

        inst = this._getInst(target[0]);
        inst.selectedDay = inst.currentDay = $("a", td).html();
        inst.selectedMonth = inst.currentMonth = month;
        inst.selectedYear = inst.currentYear = year;
        this._selectDate(id, this._formatDate(inst,
            inst.currentDay, inst.currentMonth, inst.currentYear));
    },

    /* Erase the input field and hide the date picker. */
    _clearDate: function(id) {
        var target = $(id);
        this._selectDate(target, "");
    },

    /* Update the input field with the selected date. */
    _selectDate: function(id, dateStr) {
        var onSelect,
            target = $(id),
            inst = this._getInst(target[0]);

        dateStr = (dateStr != null ? dateStr : this._formatDate(inst));
        if (inst.input) {
            inst.input.val(dateStr);
        }
        this._updateAlternate(inst);

        onSelect = this._get(inst, "onSelect");
        if (onSelect) {
            onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);  // trigger custom callback
        } else if (inst.input) {
            inst.input.trigger("change"); // fire the change event
        }

        if (inst.inline){
            this._updateDatepicker(inst);
        } else {
            this._hideDatepicker();
            this._lastInput = inst.input[0];
            if (typeof(inst.input[0]) !== "object") {
                inst.input.focus(); // restore focus
            }
            this._lastInput = null;
        }
    },

    /* Update any alternate field to synchronise with the main field. */
    _updateAlternate: function(inst) {
        var altFormat, date, dateStr,
            altField = this._get(inst, "altField");

        if (altField) { // update alternate field too
            altFormat = this._get(inst, "altFormat") || this._get(inst, "dateFormat");
            date = this._getDate(inst);
            dateStr = this.formatDate(altFormat, date, this._getFormatConfig(inst));
            $(altField).each(function() { $(this).val(dateStr); });
        }
    },

    /* Set as beforeShowDay function to prevent selection of weekends.
     * @param  date  Date - the date to customise
     * @return [boolean, string] - is this date selectable?, what is its CSS class?
     */
    noWeekends: function(date) {
        var day = date.getDay();
        return [(day > 0 && day < 6), ""];
    },

    /* Set as calculateWeek to determine the week of the year based on the ISO 8601 definition.
     * @param  date  Date - the date to get the week for
     * @return  number - the number of the week within the year that contains this date
     */
    iso8601Week: function(date) {
        var time,
            checkDate = new Date(date.getTime());

        // Find Thursday of this week starting on Monday
        checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));

        time = checkDate.getTime();
        checkDate.setMonth(0); // Compare with Jan 1
        checkDate.setDate(1);
        return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
    },

    /* Parse a string value into a date object.
     * See formatDate below for the possible formats.
     *
     * @param  format string - the expected format of the date
     * @param  value string - the date in the above format
     * @param  settings Object - attributes include:
     *                  shortYearCutoff  number - the cutoff year for determining the century (optional)
     *                  dayNamesShort   string[7] - abbreviated names of the days from Sunday (optional)
     *                  dayNames        string[7] - names of the days from Sunday (optional)
     *                  monthNamesShort string[12] - abbreviated names of the months (optional)
     *                  monthNames      string[12] - names of the months (optional)
     * @return  Date - the extracted date value or null if value is blank
     */
    parseDate: function (format, value, settings) {
        if (format == null || value == null) {
            throw "Invalid arguments";
        }

        value = (typeof value === "object" ? value.toString() : value + "");
        if (value === "") {
            return null;
        }

        var iFormat, dim, extra,
            iValue = 0,
            shortYearCutoffTemp = (settings ? settings.shortYearCutoff : null) || this._defaults.shortYearCutoff,
            shortYearCutoff = (typeof shortYearCutoffTemp !== "string" ? shortYearCutoffTemp :
                new Date().getFullYear() % 100 + parseInt(shortYearCutoffTemp, 10)),
            dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
            dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
            monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
            monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
            year = -1,
            month = -1,
            day = -1,
            doy = -1,
            literal = false,
            date,
            // Check whether a format character is doubled
            lookAhead = function(match) {
                var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
                if (matches) {
                    iFormat++;
                }
                return matches;
            },
            // Extract a number from the string value
            getNumber = function(match) {
                var isDoubled = lookAhead(match),
                    size = (match === "@" ? 14 : (match === "!" ? 20 :
                    (match === "y" && isDoubled ? 4 : (match === "o" ? 3 : 2)))),
                    minSize = (match === "y" ? size : 1),
                    digits = new RegExp("^\\d{" + minSize + "," + size + "}"),
                    num = value.substring(iValue).match(digits);
                if (!num) {
                    throw "Missing number at position " + iValue;
                }
                iValue += num[0].length;
                return parseInt(num[0], 10);
            },
            // Extract a name from the string value and convert to an index
            getName = function(match, shortNames, longNames) {
                var index = -1,
                    names = $.map(lookAhead(match) ? longNames : shortNames, function (v, k) {
                        return [ [k, v] ];
                    }).sort(function (a, b) {
                        return -(a[1].length - b[1].length);
                    });

                $.each(names, function (i, pair) {
                    var name = pair[1];
                    if (value.substr(iValue, name.length).toLowerCase() === name.toLowerCase()) {
                        index = pair[0];
                        iValue += name.length;
                        return false;
                    }
                });
                if (index !== -1) {
                    return index + 1;
                } else {
                    throw "Unknown name at position " + iValue;
                }
            },
            // Confirm that a literal character matches the string value
            checkLiteral = function() {
                if (value.charAt(iValue) !== format.charAt(iFormat)) {
                    throw "Unexpected literal at position " + iValue;
                }
                iValue++;
            };

        for (iFormat = 0; iFormat < format.length; iFormat++) {
            if (literal) {
                if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
                    literal = false;
                } else {
                    checkLiteral();
                }
            } else {
                switch (format.charAt(iFormat)) {
                    case "d":
                        day = getNumber("d");
                        break;
                    case "D":
                        getName("D", dayNamesShort, dayNames);
                        break;
                    case "o":
                        doy = getNumber("o");
                        break;
                    case "m":
                        month = getNumber("m");
                        break;
                    case "M":
                        month = getName("M", monthNamesShort, monthNames);
                        break;
                    case "y":
                        year = getNumber("y");
                        break;
                    case "@":
                        date = new Date(getNumber("@"));
                        year = date.getFullYear();
                        month = date.getMonth() + 1;
                        day = date.getDate();
                        break;
                    case "!":
                        date = new Date((getNumber("!") - this._ticksTo1970) / 10000);
                        year = date.getFullYear();
                        month = date.getMonth() + 1;
                        day = date.getDate();
                        break;
                    case "'":
                        if (lookAhead("'")){
                            checkLiteral();
                        } else {
                            literal = true;
                        }
                        break;
                    default:
                        checkLiteral();
                }
            }
        }

        if (iValue < value.length){
            extra = value.substr(iValue);
            if (!/^\s+/.test(extra)) {
                throw "Extra/unparsed characters found in date: " + extra;
            }
        }

        if (year === -1) {
            year = new Date().getFullYear();
        } else if (year < 100) {
            year += new Date().getFullYear() - new Date().getFullYear() % 100 +
                (year <= shortYearCutoff ? 0 : -100);
        }

        if (doy > -1) {
            month = 1;
            day = doy;
            do {
                dim = this._getDaysInMonth(year, month - 1);
                if (day <= dim) {
                    break;
                }
                month++;
                day -= dim;
            } while (true);
        }

        date = this._daylightSavingAdjust(new Date(year, month - 1, day));
        if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
            throw "Invalid date"; // E.g. 31/02/00
        }
        return date;
    },

    /* Standard date formats. */
    ATOM: "yy-mm-dd", // RFC 3339 (ISO 8601)
    COOKIE: "D, dd M yy",
    ISO_8601: "yy-mm-dd",
    RFC_822: "D, d M y",
    RFC_850: "DD, dd-M-y",
    RFC_1036: "D, d M y",
    RFC_1123: "D, d M yy",
    RFC_2822: "D, d M yy",
    RSS: "D, d M y", // RFC 822
    TICKS: "!",
    TIMESTAMP: "@",
    W3C: "yy-mm-dd", // ISO 8601

    _ticksTo1970: (((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) +
        Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000),

    /* Format a date object into a string value.
     * The format can be combinations of the following:
     * d  - day of month (no leading zero)
     * dd - day of month (two digit)
     * o  - day of year (no leading zeros)
     * oo - day of year (three digit)
     * D  - day name short
     * DD - day name long
     * m  - month of year (no leading zero)
     * mm - month of year (two digit)
     * M  - month name short
     * MM - month name long
     * y  - year (two digit)
     * yy - year (four digit)
     * @ - Unix timestamp (ms since 01/01/1970)
     * ! - Windows ticks (100ns since 01/01/0001)
     * "..." - literal text
     * '' - single quote
     *
     * @param  format string - the desired format of the date
     * @param  date Date - the date value to format
     * @param  settings Object - attributes include:
     *                  dayNamesShort   string[7] - abbreviated names of the days from Sunday (optional)
     *                  dayNames        string[7] - names of the days from Sunday (optional)
     *                  monthNamesShort string[12] - abbreviated names of the months (optional)
     *                  monthNames      string[12] - names of the months (optional)
     * @return  string - the date in the above format
     */
    formatDate: function (format, date, settings) {
        if (!date) {
            return "";
        }

        var iFormat,
            dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
            dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
            monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
            monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
            // Check whether a format character is doubled
            lookAhead = function(match) {
                var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
                if (matches) {
                    iFormat++;
                }
                return matches;
            },
            // Format a number, with leading zero if necessary
            formatNumber = function(match, value, len) {
                var num = "" + value;
                if (lookAhead(match)) {
                    while (num.length < len) {
                        num = "0" + num;
                    }
                }
                return num;
            },
            // Format a name, short or long as requested
            formatName = function(match, value, shortNames, longNames) {
                return (lookAhead(match) ? longNames[value] : shortNames[value]);
            },
            output = "",
            literal = false;

        if (date) {
            for (iFormat = 0; iFormat < format.length; iFormat++) {
                if (literal) {
                    if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
                        literal = false;
                    } else {
                        output += format.charAt(iFormat);
                    }
                } else {
                    switch (format.charAt(iFormat)) {
                        case "d":
                            output += formatNumber("d", date.getDate(), 2);
                            break;
                        case "D":
                            output += formatName("D", date.getDay(), dayNamesShort, dayNames);
                            break;
                        case "o":
                            output += formatNumber("o",
                                Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
                            break;
                        case "m":
                            output += formatNumber("m", date.getMonth() + 1, 2);
                            break;
                        case "M":
                            output += formatName("M", date.getMonth(), monthNamesShort, monthNames);
                            break;
                        case "y":
                            output += (lookAhead("y") ? date.getFullYear() :
                                (date.getYear() % 100 < 10 ? "0" : "") + date.getYear() % 100);
                            break;
                        case "@":
                            output += date.getTime();
                            break;
                        case "!":
                            output += date.getTime() * 10000 + this._ticksTo1970;
                            break;
                        case "'":
                            if (lookAhead("'")) {
                                output += "'";
                            } else {
                                literal = true;
                            }
                            break;
                        default:
                            output += format.charAt(iFormat);
                    }
                }
            }
        }
        return output;
    },

    /* Extract all possible characters from the date format. */
    _possibleChars: function (format) {
        var iFormat,
            chars = "",
            literal = false,
            // Check whether a format character is doubled
            lookAhead = function(match) {
                var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
                if (matches) {
                    iFormat++;
                }
                return matches;
            };

        for (iFormat = 0; iFormat < format.length; iFormat++) {
            if (literal) {
                if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
                    literal = false;
                } else {
                    chars += format.charAt(iFormat);
                }
            } else {
                switch (format.charAt(iFormat)) {
                    case "d": case "m": case "y": case "@":
                        chars += "0123456789";
                        break;
                    case "D": case "M":
                        return null; // Accept anything
                    case "'":
                        if (lookAhead("'")) {
                            chars += "'";
                        } else {
                            literal = true;
                        }
                        break;
                    default:
                        chars += format.charAt(iFormat);
                }
            }
        }
        return chars;
    },

    /* Get a setting value, defaulting if necessary. */
    _get: function(inst, name) {
        return inst.settings[name] !== undefined ?
            inst.settings[name] : this._defaults[name];
    },

    /* Parse existing date and initialise date picker. */
    _setDateFromField: function(inst, noDefault) {
        if (inst.input.val() === inst.lastVal) {
            return;
        }

        var dateFormat = this._get(inst, "dateFormat"),
            dates = inst.lastVal = inst.input ? inst.input.val() : null,
            defaultDate = this._getDefaultDate(inst),
            date = defaultDate,
            settings = this._getFormatConfig(inst);

        try {
            date = this.parseDate(dateFormat, dates, settings) || defaultDate;
        } catch (event) {
            dates = (noDefault ? "" : dates);
        }
        inst.selectedDay = date.getDate();
        inst.drawMonth = inst.selectedMonth = date.getMonth();
        inst.drawYear = inst.selectedYear = date.getFullYear();
        inst.currentDay = (dates ? date.getDate() : 0);
        inst.currentMonth = (dates ? date.getMonth() : 0);
        inst.currentYear = (dates ? date.getFullYear() : 0);
        this._adjustInstDate(inst);
    },

    /* Retrieve the default date shown on opening. */
    _getDefaultDate: function(inst) {
        return this._restrictMinMax(inst,
            this._determineDate(inst, this._get(inst, "defaultDate"), new Date()));
    },

    /* A date may be specified as an exact value or a relative one. */
    _determineDate: function(inst, date, defaultDate) {
        var offsetNumeric = function(offset) {
                var date = new Date();
                date.setDate(date.getDate() + offset);
                return date;
            },
            offsetString = function(offset) {
                try {
                    return $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"),
                        offset, $.datepicker._getFormatConfig(inst));
                }
                catch (e) {
                    // Ignore
                }

                var date = (offset.toLowerCase().match(/^c/) ?
                    $.datepicker._getDate(inst) : null) || new Date(),
                    year = date.getFullYear(),
                    month = date.getMonth(),
                    day = date.getDate(),
                    pattern = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,
                    matches = pattern.exec(offset);

                while (matches) {
                    switch (matches[2] || "d") {
                        case "d" : case "D" :
                            day += parseInt(matches[1],10); break;
                        case "w" : case "W" :
                            day += parseInt(matches[1],10) * 7; break;
                        case "m" : case "M" :
                            month += parseInt(matches[1],10);
                            day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
                            break;
                        case "y": case "Y" :
                            year += parseInt(matches[1],10);
                            day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
                            break;
                    }
                    matches = pattern.exec(offset);
                }
                return new Date(year, month, day);
            },
            newDate = (date == null || date === "" ? defaultDate : (typeof date === "string" ? offsetString(date) :
                (typeof date === "number" ? (isNaN(date) ? defaultDate : offsetNumeric(date)) : new Date(date.getTime()))));

        newDate = (newDate && newDate.toString() === "Invalid Date" ? defaultDate : newDate);
        if (newDate) {
            newDate.setHours(0);
            newDate.setMinutes(0);
            newDate.setSeconds(0);
            newDate.setMilliseconds(0);
        }
        return this._daylightSavingAdjust(newDate);
    },

    /* Handle switch to/from daylight saving.
     * Hours may be non-zero on daylight saving cut-over:
     * > 12 when midnight changeover, but then cannot generate
     * midnight datetime, so jump to 1AM, otherwise reset.
     * @param  date  (Date) the date to check
     * @return  (Date) the corrected date
     */
    _daylightSavingAdjust: function(date) {
        if (!date) {
            return null;
        }
        date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
        return date;
    },

    /* Set the date(s) directly. */
    _setDate: function(inst, date, noChange) {
        var clear = !date,
            origMonth = inst.selectedMonth,
            origYear = inst.selectedYear,
            newDate = this._restrictMinMax(inst, this._determineDate(inst, date, new Date()));

        inst.selectedDay = inst.currentDay = newDate.getDate();
        inst.drawMonth = inst.selectedMonth = inst.currentMonth = newDate.getMonth();
        inst.drawYear = inst.selectedYear = inst.currentYear = newDate.getFullYear();
        if ((origMonth !== inst.selectedMonth || origYear !== inst.selectedYear) && !noChange) {
            this._notifyChange(inst);
        }
        this._adjustInstDate(inst);
        if (inst.input) {
            inst.input.val(clear ? "" : this._formatDate(inst));
        }
    },

    /* Retrieve the date(s) directly. */
    _getDate: function(inst) {
        var startDate = (!inst.currentYear || (inst.input && inst.input.val() === "") ? null :
            this._daylightSavingAdjust(new Date(
            inst.currentYear, inst.currentMonth, inst.currentDay)));
            return startDate;
    },

    /* Attach the onxxx handlers.  These are declared statically so
     * they work with static code transformers like Caja.
     */
    _attachHandlers: function(inst) {
        var stepMonths = this._get(inst, "stepMonths"),
            id = "#" + inst.id.replace( /\\\\/g, "\\" );
        inst.dpDiv.find("[data-handler]").map(function () {
            var handler = {
                prev: function () {
                    $.datepicker._adjustDate(id, -stepMonths, "M");
                },
                next: function () {
                    $.datepicker._adjustDate(id, +stepMonths, "M");
                },
                hide: function () {
                    $.datepicker._hideDatepicker();
                },
                today: function () {
                    $.datepicker._gotoToday(id);
                },
                selectDay: function () {
                    $.datepicker._selectDay(id, +this.getAttribute("data-month"), +this.getAttribute("data-year"), this);
                    return false;
                },
                selectMonth: function () {
                    $.datepicker._selectMonthYear(id, this, "M");
                    return false;
                },
                selectYear: function () {
                    $.datepicker._selectMonthYear(id, this, "Y");
                    return false;
                }
            };
            $(this).bind(this.getAttribute("data-event"), handler[this.getAttribute("data-handler")]);
        });
    },

    /* Generate the HTML for the current state of the date picker. */
    _generateHTML: function(inst) {
        var maxDraw, prevText, prev, nextText, next, currentText, gotoDate,
            controls, buttonPanel, firstDay, showWeek, dayNames, dayNamesMin,
            monthNames, monthNamesShort, beforeShowDay, showOtherMonths,
            selectOtherMonths, defaultDate, html, dow, row, group, col, selectedDate,
            cornerClass, calender, thead, day, daysInMonth, leadDays, curRows, numRows,
            printDate, dRow, tbody, daySettings, otherMonth, unselectable,
            tempDate = new Date(),
            today = this._daylightSavingAdjust(
                new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate())), // clear time
            isRTL = this._get(inst, "isRTL"),
            showButtonPanel = this._get(inst, "showButtonPanel"),
            hideIfNoPrevNext = this._get(inst, "hideIfNoPrevNext"),
            navigationAsDateFormat = this._get(inst, "navigationAsDateFormat"),
            numMonths = this._getNumberOfMonths(inst),
            showCurrentAtPos = this._get(inst, "showCurrentAtPos"),
            stepMonths = this._get(inst, "stepMonths"),
            isMultiMonth = (numMonths[0] !== 1 || numMonths[1] !== 1),
            currentDate = this._daylightSavingAdjust((!inst.currentDay ? new Date(9999, 9, 9) :
                new Date(inst.currentYear, inst.currentMonth, inst.currentDay))),
            minDate = this._getMinMaxDate(inst, "min"),
            maxDate = this._getMinMaxDate(inst, "max"),
            drawMonth = inst.drawMonth - showCurrentAtPos,
            drawYear = inst.drawYear;

        if (drawMonth < 0) {
            drawMonth += 12;
            drawYear--;
        }
        if (maxDate) {
            maxDraw = this._daylightSavingAdjust(new Date(maxDate.getFullYear(),
                maxDate.getMonth() - (numMonths[0] * numMonths[1]) + 1, maxDate.getDate()));
            maxDraw = (minDate && maxDraw < minDate ? minDate : maxDraw);
            while (this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1)) > maxDraw) {
                drawMonth--;
                if (drawMonth < 0) {
                    drawMonth = 11;
                    drawYear--;
                }
            }
        }
        inst.drawMonth = drawMonth;
        inst.drawYear = drawYear;

        prevText = this._get(inst, "prevText");
        prevText = (!navigationAsDateFormat ? prevText : this.formatDate(prevText,
            this._daylightSavingAdjust(new Date(drawYear, drawMonth - stepMonths, 1)),
            this._getFormatConfig(inst)));

        prev = (this._canAdjustMonth(inst, -1, drawYear, drawMonth) ?
            "<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click'" +
            " title='" + prevText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "e" : "w") + "'>" + prevText + "</span></a>" :
            (hideIfNoPrevNext ? "" : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='"+ prevText +"'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "e" : "w") + "'>" + prevText + "</span></a>"));

        nextText = this._get(inst, "nextText");
        nextText = (!navigationAsDateFormat ? nextText : this.formatDate(nextText,
            this._daylightSavingAdjust(new Date(drawYear, drawMonth + stepMonths, 1)),
            this._getFormatConfig(inst)));

        next = (this._canAdjustMonth(inst, +1, drawYear, drawMonth) ?
            "<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click'" +
            " title='" + nextText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "w" : "e") + "'>" + nextText + "</span></a>" :
            (hideIfNoPrevNext ? "" : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='"+ nextText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "w" : "e") + "'>" + nextText + "</span></a>"));

        currentText = this._get(inst, "currentText");
        gotoDate = (this._get(inst, "gotoCurrent") && inst.currentDay ? currentDate : today);
        currentText = (!navigationAsDateFormat ? currentText :
            this.formatDate(currentText, gotoDate, this._getFormatConfig(inst)));

        controls = (!inst.inline ? "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" +
            this._get(inst, "closeText") + "</button>" : "");

        buttonPanel = (showButtonPanel) ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" + (isRTL ? controls : "") +
            (this._isInRange(inst, gotoDate) ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'" +
            ">" + currentText + "</button>" : "") + (isRTL ? "" : controls) + "</div>" : "";

        firstDay = parseInt(this._get(inst, "firstDay"),10);
        firstDay = (isNaN(firstDay) ? 0 : firstDay);

        showWeek = this._get(inst, "showWeek");
        dayNames = this._get(inst, "dayNames");
        dayNamesMin = this._get(inst, "dayNamesMin");
        monthNames = this._get(inst, "monthNames");
        monthNamesShort = this._get(inst, "monthNamesShort");
        beforeShowDay = this._get(inst, "beforeShowDay");
        showOtherMonths = this._get(inst, "showOtherMonths");
        selectOtherMonths = this._get(inst, "selectOtherMonths");
        defaultDate = this._getDefaultDate(inst);
        html = "";
        dow;
        for (row = 0; row < numMonths[0]; row++) {
            group = "";
            this.maxRows = 4;
            for (col = 0; col < numMonths[1]; col++) {
                selectedDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, inst.selectedDay));
                cornerClass = " ui-corner-all";
                calender = "";
                if (isMultiMonth) {
                    calender += "<div class='ui-datepicker-group";
                    if (numMonths[1] > 1) {
                        switch (col) {
                            case 0: calender += " ui-datepicker-group-first";
                                cornerClass = " ui-corner-" + (isRTL ? "right" : "left"); break;
                            case numMonths[1]-1: calender += " ui-datepicker-group-last";
                                cornerClass = " ui-corner-" + (isRTL ? "left" : "right"); break;
                            default: calender += " ui-datepicker-group-middle"; cornerClass = ""; break;
                        }
                    }
                    calender += "'>";
                }
                calender += "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" + cornerClass + "'>" +
                    (/all|left/.test(cornerClass) && row === 0 ? (isRTL ? next : prev) : "") +
                    (/all|right/.test(cornerClass) && row === 0 ? (isRTL ? prev : next) : "") +
                    this._generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate,
                    row > 0 || col > 0, monthNames, monthNamesShort) + // draw month headers
                    "</div><table class='ui-datepicker-calendar'><thead>" +
                    "<tr>";
                thead = (showWeek ? "<th class='ui-datepicker-week-col'>" + this._get(inst, "weekHeader") + "</th>" : "");
                for (dow = 0; dow < 7; dow++) { // days of the week
                    day = (dow + firstDay) % 7;
                    thead += "<th scope='col'" + ((dow + firstDay + 6) % 7 >= 5 ? " class='ui-datepicker-week-end'" : "") + ">" +
                        "<span title='" + dayNames[day] + "'>" + dayNamesMin[day] + "</span></th>";
                }
                calender += thead + "</tr></thead><tbody>";
                daysInMonth = this._getDaysInMonth(drawYear, drawMonth);
                if (drawYear === inst.selectedYear && drawMonth === inst.selectedMonth) {
                    inst.selectedDay = Math.min(inst.selectedDay, daysInMonth);
                }
                leadDays = (this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
                curRows = Math.ceil((leadDays + daysInMonth) / 7); // calculate the number of rows to generate
                numRows = (isMultiMonth ? this.maxRows > curRows ? this.maxRows : curRows : curRows); //If multiple months, use the higher number of rows (see #7043)
                this.maxRows = numRows;
                printDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1 - leadDays));
                for (dRow = 0; dRow < numRows; dRow++) { // create date picker rows
                    calender += "<tr>";
                    tbody = (!showWeek ? "" : "<td class='ui-datepicker-week-col'>" +
                        this._get(inst, "calculateWeek")(printDate) + "</td>");
                    for (dow = 0; dow < 7; dow++) { // create date picker days
                        daySettings = (beforeShowDay ?
                            beforeShowDay.apply((inst.input ? inst.input[0] : null), [printDate]) : [true, ""]);
                        otherMonth = (printDate.getMonth() !== drawMonth);
                        unselectable = (otherMonth && !selectOtherMonths) || !daySettings[0] ||
                            (minDate && printDate < minDate) || (maxDate && printDate > maxDate);
                        tbody += "<td class='" +
                            ((dow + firstDay + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + // highlight weekends
                            (otherMonth ? " ui-datepicker-other-month" : "") + // highlight days from other months
                            ((printDate.getTime() === selectedDate.getTime() && drawMonth === inst.selectedMonth && inst._keyEvent) || // user pressed key
                            (defaultDate.getTime() === printDate.getTime() && defaultDate.getTime() === selectedDate.getTime()) ?
                            // or defaultDate is current printedDate and defaultDate is selectedDate
                            " " + this._dayOverClass : "") + // highlight selected day
                            (unselectable ? " " + this._unselectableClass + " ui-state-disabled": "") +  // highlight unselectable days
                            (otherMonth && !showOtherMonths ? "" : " " + daySettings[1] + // highlight custom dates
                            (printDate.getTime() === currentDate.getTime() ? " " + this._currentClass : "") + // highlight selected day
                            (printDate.getTime() === today.getTime() ? " ui-datepicker-today" : "")) + "'" + // highlight today (if different)
                            ((!otherMonth || showOtherMonths) && daySettings[2] ? " title='" + daySettings[2].replace(/'/g, "&#39;") + "'" : "") + // cell title
                            (unselectable ? "" : " data-handler='selectDay' data-event='click' data-month='" + printDate.getMonth() + "' data-year='" + printDate.getFullYear() + "'") + ">" + // actions
                            (otherMonth && !showOtherMonths ? "&#xa0;" : // display for other months
                            (unselectable ? "<span class='ui-state-default'>" + printDate.getDate() + "</span>" : "<a class='ui-state-default" +
                            (printDate.getTime() === today.getTime() ? " ui-state-highlight" : "") +
                            (printDate.getTime() === currentDate.getTime() ? " ui-state-active" : "") + // highlight selected day
                            (otherMonth ? " ui-priority-secondary" : "") + // distinguish dates from other months
                            "' href='#'>" + printDate.getDate() + "</a>")) + "</td>"; // display selectable date
                        printDate.setDate(printDate.getDate() + 1);
                        printDate = this._daylightSavingAdjust(printDate);
                    }
                    calender += tbody + "</tr>";
                }
                drawMonth++;
                if (drawMonth > 11) {
                    drawMonth = 0;
                    drawYear++;
                }
                calender += "</tbody></table>" + (isMultiMonth ? "</div>" +
                            ((numMonths[0] > 0 && col === numMonths[1]-1) ? "<div class='ui-datepicker-row-break'></div>" : "") : "");
                group += calender;
            }
            html += group;
        }
        html += buttonPanel;
        inst._keyEvent = false;
        return html;
    },

    /* Generate the month and year header. */
    _generateMonthYearHeader: function(inst, drawMonth, drawYear, minDate, maxDate,
            secondary, monthNames, monthNamesShort) {

        var inMinYear, inMaxYear, month, years, thisYear, determineYear, year, endYear,
            changeMonth = this._get(inst, "changeMonth"),
            changeYear = this._get(inst, "changeYear"),
            showMonthAfterYear = this._get(inst, "showMonthAfterYear"),
            html = "<div class='ui-datepicker-title'>",
            monthHtml = "";

        // month selection
        if (secondary || !changeMonth) {
            monthHtml += "<span class='ui-datepicker-month'>" + monthNames[drawMonth] + "</span>";
        } else {
            inMinYear = (minDate && minDate.getFullYear() === drawYear);
            inMaxYear = (maxDate && maxDate.getFullYear() === drawYear);
            monthHtml += "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>";
            for ( month = 0; month < 12; month++) {
                if ((!inMinYear || month >= minDate.getMonth()) && (!inMaxYear || month <= maxDate.getMonth())) {
                    monthHtml += "<option value='" + month + "'" +
                        (month === drawMonth ? " selected='selected'" : "") +
                        ">" + monthNamesShort[month] + "</option>";
                }
            }
            monthHtml += "</select>";
        }

        if (!showMonthAfterYear) {
            html += monthHtml + (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "");
        }

        // year selection
        if ( !inst.yearshtml ) {
            inst.yearshtml = "";
            if (secondary || !changeYear) {
                html += "<span class='ui-datepicker-year'>" + drawYear + "</span>";
            } else {
                // determine range of years to display
                years = this._get(inst, "yearRange").split(":");
                thisYear = new Date().getFullYear();
                determineYear = function(value) {
                    var year = (value.match(/c[+\-].*/) ? drawYear + parseInt(value.substring(1), 10) :
                        (value.match(/[+\-].*/) ? thisYear + parseInt(value, 10) :
                        parseInt(value, 10)));
                    return (isNaN(year) ? thisYear : year);
                };
                year = determineYear(years[0]);
                endYear = Math.max(year, determineYear(years[1] || ""));
                year = (minDate ? Math.max(year, minDate.getFullYear()) : year);
                endYear = (maxDate ? Math.min(endYear, maxDate.getFullYear()) : endYear);
                inst.yearshtml += "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";
                for (; year <= endYear; year++) {
                    inst.yearshtml += "<option value='" + year + "'" +
                        (year === drawYear ? " selected='selected'" : "") +
                        ">" + year + "</option>";
                }
                inst.yearshtml += "</select>";

                html += inst.yearshtml;
                inst.yearshtml = null;
            }
        }

        html += this._get(inst, "yearSuffix");
        if (showMonthAfterYear) {
            html += (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "") + monthHtml;
        }
        html += "</div>"; // Close datepicker_header
        return html;
    },

    /* Adjust one of the date sub-fields. */
    _adjustInstDate: function(inst, offset, period) {
        var year = inst.drawYear + (period === "Y" ? offset : 0),
            month = inst.drawMonth + (period === "M" ? offset : 0),
            day = Math.min(inst.selectedDay, this._getDaysInMonth(year, month)) + (period === "D" ? offset : 0),
            date = this._restrictMinMax(inst, this._daylightSavingAdjust(new Date(year, month, day)));

        inst.selectedDay = date.getDate();
        inst.drawMonth = inst.selectedMonth = date.getMonth();
        inst.drawYear = inst.selectedYear = date.getFullYear();
        if (period === "M" || period === "Y") {
            this._notifyChange(inst);
        }
    },

    /* Ensure a date is within any min/max bounds. */
    _restrictMinMax: function(inst, date) {
        var minDate = this._getMinMaxDate(inst, "min"),
            maxDate = this._getMinMaxDate(inst, "max"),
            newDate = (minDate && date < minDate ? minDate : date);
        return (maxDate && newDate > maxDate ? maxDate : newDate);
    },

    /* Notify change of month/year. */
    _notifyChange: function(inst) {
        var onChange = this._get(inst, "onChangeMonthYear");
        if (onChange) {
            onChange.apply((inst.input ? inst.input[0] : null),
                [inst.selectedYear, inst.selectedMonth + 1, inst]);
        }
    },

    /* Determine the number of months to show. */
    _getNumberOfMonths: function(inst) {
        var numMonths = this._get(inst, "numberOfMonths");
        return (numMonths == null ? [1, 1] : (typeof numMonths === "number" ? [1, numMonths] : numMonths));
    },

    /* Determine the current maximum date - ensure no time components are set. */
    _getMinMaxDate: function(inst, minMax) {
        return this._determineDate(inst, this._get(inst, minMax + "Date"), null);
    },

    /* Find the number of days in a given month. */
    _getDaysInMonth: function(year, month) {
        return 32 - this._daylightSavingAdjust(new Date(year, month, 32)).getDate();
    },

    /* Find the day of the week of the first of a month. */
    _getFirstDayOfMonth: function(year, month) {
        return new Date(year, month, 1).getDay();
    },

    /* Determines if we should allow a "next/prev" month display change. */
    _canAdjustMonth: function(inst, offset, curYear, curMonth) {
        var numMonths = this._getNumberOfMonths(inst),
            date = this._daylightSavingAdjust(new Date(curYear,
            curMonth + (offset < 0 ? offset : numMonths[0] * numMonths[1]), 1));

        if (offset < 0) {
            date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
        }
        return this._isInRange(inst, date);
    },

    /* Is the given date in the accepted range? */
    _isInRange: function(inst, date) {
        var yearSplit, currentYear,
            minDate = this._getMinMaxDate(inst, "min"),
            maxDate = this._getMinMaxDate(inst, "max"),
            minYear = null,
            maxYear = null,
            years = this._get(inst, "yearRange");
            if (years){
                yearSplit = years.split(":");
                currentYear = new Date().getFullYear();
                minYear = parseInt(yearSplit[0], 10);
                maxYear = parseInt(yearSplit[1], 10);
                if ( yearSplit[0].match(/[+\-].*/) ) {
                    minYear += currentYear;
                }
                if ( yearSplit[1].match(/[+\-].*/) ) {
                    maxYear += currentYear;
                }
            }

        return ((!minDate || date.getTime() >= minDate.getTime()) &&
            (!maxDate || date.getTime() <= maxDate.getTime()) &&
            (!minYear || date.getFullYear() >= minYear) &&
            (!maxYear || date.getFullYear() <= maxYear));
    },

    /* Provide the configuration settings for formatting/parsing. */
    _getFormatConfig: function(inst) {
        var shortYearCutoff = this._get(inst, "shortYearCutoff");
        shortYearCutoff = (typeof shortYearCutoff !== "string" ? shortYearCutoff :
            new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
        return {shortYearCutoff: shortYearCutoff,
            dayNamesShort: this._get(inst, "dayNamesShort"), dayNames: this._get(inst, "dayNames"),
            monthNamesShort: this._get(inst, "monthNamesShort"), monthNames: this._get(inst, "monthNames")};
    },

    /* Format the given date for display. */
    _formatDate: function(inst, day, month, year) {
        if (!day) {
            inst.currentDay = inst.selectedDay;
            inst.currentMonth = inst.selectedMonth;
            inst.currentYear = inst.selectedYear;
        }
        var date = (day ? (typeof day === "object" ? day :
            this._daylightSavingAdjust(new Date(year, month, day))) :
            this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
        return this.formatDate(this._get(inst, "dateFormat"), date, this._getFormatConfig(inst));
    }
});

/*
 * Bind hover events for datepicker elements.
 * Done via delegate so the binding only occurs once in the lifetime of the parent div.
 * Global datepicker_instActive, set by _updateDatepicker allows the handlers to find their way back to the active picker.
 */
function datepicker_bindHover(dpDiv) {
    var selector = "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
    return dpDiv.delegate(selector, "mouseout", function() {
            $(this).removeClass("ui-state-hover");
            if (this.className.indexOf("ui-datepicker-prev") !== -1) {
                $(this).removeClass("ui-datepicker-prev-hover");
            }
            if (this.className.indexOf("ui-datepicker-next") !== -1) {
                $(this).removeClass("ui-datepicker-next-hover");
            }
        })
        .delegate( selector, "mouseover", datepicker_handleMouseover );
}

function datepicker_handleMouseover() {
    if (!$.datepicker._isDisabledDatepicker( datepicker_instActive.inline? datepicker_instActive.dpDiv.parent()[0] : datepicker_instActive.input[0])) {
        $(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover");
        $(this).addClass("ui-state-hover");
        if (this.className.indexOf("ui-datepicker-prev") !== -1) {
            $(this).addClass("ui-datepicker-prev-hover");
        }
        if (this.className.indexOf("ui-datepicker-next") !== -1) {
            $(this).addClass("ui-datepicker-next-hover");
        }
    }
}

/* jQuery extend now ignores nulls! */
function datepicker_extendRemove(target, props) {
    $.extend(target, props);
    for (var name in props) {
        if (props[name] == null) {
            target[name] = props[name];
        }
    }
    return target;
}

/* Invoke the datepicker functionality.
   @param  options  string - a command, optionally followed by additional parameters or
                    Object - settings for attaching new datepicker functionality
   @return  jQuery object */
$.fn.datepicker = function(options){

    /* Verify an empty collection wasn't passed - Fixes #6976 */
    if ( !this.length ) {
        return this;
    }

    /* Initialise the date picker. */
    if (!$.datepicker.initialized) {
        $(document).mousedown($.datepicker._checkExternalClick);
        $.datepicker.initialized = true;
    }

    /* Append datepicker main container to body if not exist. */
    if ($("#"+$.datepicker._mainDivId).length === 0) {
        $("body").append($.datepicker.dpDiv);
    }

    var otherArgs = Array.prototype.slice.call(arguments, 1);
    if (typeof options === "string" && (options === "isDisabled" || options === "getDate" || options === "widget")) {
        return $.datepicker["_" + options + "Datepicker"].
            apply($.datepicker, [this[0]].concat(otherArgs));
    }
    if (options === "option" && arguments.length === 2 && typeof arguments[1] === "string") {
        return $.datepicker["_" + options + "Datepicker"].
            apply($.datepicker, [this[0]].concat(otherArgs));
    }
    return this.each(function() {
        typeof options === "string" ?
            $.datepicker["_" + options + "Datepicker"].
                apply($.datepicker, [this].concat(otherArgs)) :
            $.datepicker._attachDatepicker(this, options);
    });
};

$.datepicker = new Datepicker(); // singleton instance
$.datepicker.initialized = false;
$.datepicker.uuid = new Date().getTime();
$.datepicker.version = "1.11.4";

var datepicker = $.datepicker;



}));
/*!
* jQuery Cycle2; version: 2.1.2 build: 20140216
* http://jquery.malsup.com/cycle2/
* Copyright (c) 2014 M. Alsup; Dual licensed: MIT/GPL
*/
(function(e){"use strict";function t(e){return(e||"").toLowerCase()}var i="2.1.2";e.fn.cycle=function(i){var n;return 0!==this.length||e.isReady?this.each(function(){var n,s,o,c,l=e(this),r=e.fn.cycle.log;if(!l.data("cycle.opts")){(l.data("cycle-log")===!1||i&&i.log===!1||s&&s.log===!1)&&(r=e.noop),r("--c2 init--"),n=l.data();for(var a in n)n.hasOwnProperty(a)&&/^cycle[A-Z]+/.test(a)&&(c=n[a],o=a.match(/^cycle(.*)/)[1].replace(/^[A-Z]/,t),r(o+":",c,"("+typeof c+")"),n[o]=c);s=e.extend({},e.fn.cycle.defaults,n,i||{}),s.timeoutId=0,s.paused=s.paused||!1,s.container=l,s._maxZ=s.maxZ,s.API=e.extend({_container:l},e.fn.cycle.API),s.API.log=r,s.API.trigger=function(e,t){return s.container.trigger(e,t),s.API},l.data("cycle.opts",s),l.data("cycle.API",s.API),s.API.trigger("cycle-bootstrap",[s,s.API]),s.API.addInitialSlides(),s.API.preInitSlideshow(),s.slides.length&&s.API.initSlideshow()}}):(n={s:this.selector,c:this.context},e.fn.cycle.log("requeuing slideshow (dom not ready)"),e(function(){e(n.s,n.c).cycle(i)}),this)},e.fn.cycle.API={opts:function(){return this._container.data("cycle.opts")},addInitialSlides:function(){var t=this.opts(),i=t.slides;t.slideCount=0,t.slides=e(),i=i.jquery?i:t.container.find(i),t.random&&i.sort(function(){return Math.random()-.5}),t.API.add(i)},preInitSlideshow:function(){var t=this.opts();t.API.trigger("cycle-pre-initialize",[t]);var i=e.fn.cycle.transitions[t.fx];i&&e.isFunction(i.preInit)&&i.preInit(t),t._preInitialized=!0},postInitSlideshow:function(){var t=this.opts();t.API.trigger("cycle-post-initialize",[t]);var i=e.fn.cycle.transitions[t.fx];i&&e.isFunction(i.postInit)&&i.postInit(t)},initSlideshow:function(){var t,i=this.opts(),n=i.container;i.API.calcFirstSlide(),"static"==i.container.css("position")&&i.container.css("position","relative"),e(i.slides[i.currSlide]).css({opacity:1,display:"block",visibility:"visible"}),i.API.stackSlides(i.slides[i.currSlide],i.slides[i.nextSlide],!i.reverse),i.pauseOnHover&&(i.pauseOnHover!==!0&&(n=e(i.pauseOnHover)),n.hover(function(){i.API.pause(!0)},function(){i.API.resume(!0)})),i.timeout&&(t=i.API.getSlideOpts(i.currSlide),i.API.queueTransition(t,t.timeout+i.delay)),i._initialized=!0,i.API.updateView(!0),i.API.trigger("cycle-initialized",[i]),i.API.postInitSlideshow()},pause:function(t){var i=this.opts(),n=i.API.getSlideOpts(),s=i.hoverPaused||i.paused;t?i.hoverPaused=!0:i.paused=!0,s||(i.container.addClass("cycle-paused"),i.API.trigger("cycle-paused",[i]).log("cycle-paused"),n.timeout&&(clearTimeout(i.timeoutId),i.timeoutId=0,i._remainingTimeout-=e.now()-i._lastQueue,(0>i._remainingTimeout||isNaN(i._remainingTimeout))&&(i._remainingTimeout=void 0)))},resume:function(e){var t=this.opts(),i=!t.hoverPaused&&!t.paused;e?t.hoverPaused=!1:t.paused=!1,i||(t.container.removeClass("cycle-paused"),0===t.slides.filter(":animated").length&&t.API.queueTransition(t.API.getSlideOpts(),t._remainingTimeout),t.API.trigger("cycle-resumed",[t,t._remainingTimeout]).log("cycle-resumed"))},add:function(t,i){var n,s=this.opts(),o=s.slideCount,c=!1;"string"==e.type(t)&&(t=e.trim(t)),e(t).each(function(){var t,n=e(this);i?s.container.prepend(n):s.container.append(n),s.slideCount++,t=s.API.buildSlideOpts(n),s.slides=i?e(n).add(s.slides):s.slides.add(n),s.API.initSlide(t,n,--s._maxZ),n.data("cycle.opts",t),s.API.trigger("cycle-slide-added",[s,t,n])}),s.API.updateView(!0),c=s._preInitialized&&2>o&&s.slideCount>=1,c&&(s._initialized?s.timeout&&(n=s.slides.length,s.nextSlide=s.reverse?n-1:1,s.timeoutId||s.API.queueTransition(s)):s.API.initSlideshow())},calcFirstSlide:function(){var e,t=this.opts();e=parseInt(t.startingSlide||0,10),(e>=t.slides.length||0>e)&&(e=0),t.currSlide=e,t.reverse?(t.nextSlide=e-1,0>t.nextSlide&&(t.nextSlide=t.slides.length-1)):(t.nextSlide=e+1,t.nextSlide==t.slides.length&&(t.nextSlide=0))},calcNextSlide:function(){var e,t=this.opts();t.reverse?(e=0>t.nextSlide-1,t.nextSlide=e?t.slideCount-1:t.nextSlide-1,t.currSlide=e?0:t.nextSlide+1):(e=t.nextSlide+1==t.slides.length,t.nextSlide=e?0:t.nextSlide+1,t.currSlide=e?t.slides.length-1:t.nextSlide-1)},calcTx:function(t,i){var n,s=t;return i&&s.manualFx&&(n=e.fn.cycle.transitions[s.manualFx]),n||(n=e.fn.cycle.transitions[s.fx]),n||(n=e.fn.cycle.transitions.fade,s.API.log('Transition "'+s.fx+'" not found.  Using fade.')),n},prepareTx:function(e,t){var i,n,s,o,c,l=this.opts();return 2>l.slideCount?(l.timeoutId=0,void 0):(!e||l.busy&&!l.manualTrump||(l.API.stopTransition(),l.busy=!1,clearTimeout(l.timeoutId),l.timeoutId=0),l.busy||(0!==l.timeoutId||e)&&(n=l.slides[l.currSlide],s=l.slides[l.nextSlide],o=l.API.getSlideOpts(l.nextSlide),c=l.API.calcTx(o,e),l._tx=c,e&&void 0!==o.manualSpeed&&(o.speed=o.manualSpeed),l.nextSlide!=l.currSlide&&(e||!l.paused&&!l.hoverPaused&&l.timeout)?(l.API.trigger("cycle-before",[o,n,s,t]),c.before&&c.before(o,n,s,t),i=function(){l.busy=!1,l.container.data("cycle.opts")&&(c.after&&c.after(o,n,s,t),l.API.trigger("cycle-after",[o,n,s,t]),l.API.queueTransition(o),l.API.updateView(!0))},l.busy=!0,c.transition?c.transition(o,n,s,t,i):l.API.doTransition(o,n,s,t,i),l.API.calcNextSlide(),l.API.updateView()):l.API.queueTransition(o)),void 0)},doTransition:function(t,i,n,s,o){var c=t,l=e(i),r=e(n),a=function(){r.animate(c.animIn||{opacity:1},c.speed,c.easeIn||c.easing,o)};r.css(c.cssBefore||{}),l.animate(c.animOut||{},c.speed,c.easeOut||c.easing,function(){l.css(c.cssAfter||{}),c.sync||a()}),c.sync&&a()},queueTransition:function(t,i){var n=this.opts(),s=void 0!==i?i:t.timeout;return 0===n.nextSlide&&0===--n.loop?(n.API.log("terminating; loop=0"),n.timeout=0,s?setTimeout(function(){n.API.trigger("cycle-finished",[n])},s):n.API.trigger("cycle-finished",[n]),n.nextSlide=n.currSlide,void 0):void 0!==n.continueAuto&&(n.continueAuto===!1||e.isFunction(n.continueAuto)&&n.continueAuto()===!1)?(n.API.log("terminating automatic transitions"),n.timeout=0,n.timeoutId&&clearTimeout(n.timeoutId),void 0):(s&&(n._lastQueue=e.now(),void 0===i&&(n._remainingTimeout=t.timeout),n.paused||n.hoverPaused||(n.timeoutId=setTimeout(function(){n.API.prepareTx(!1,!n.reverse)},s))),void 0)},stopTransition:function(){var e=this.opts();e.slides.filter(":animated").length&&(e.slides.stop(!1,!0),e.API.trigger("cycle-transition-stopped",[e])),e._tx&&e._tx.stopTransition&&e._tx.stopTransition(e)},advanceSlide:function(e){var t=this.opts();return clearTimeout(t.timeoutId),t.timeoutId=0,t.nextSlide=t.currSlide+e,0>t.nextSlide?t.nextSlide=t.slides.length-1:t.nextSlide>=t.slides.length&&(t.nextSlide=0),t.API.prepareTx(!0,e>=0),!1},buildSlideOpts:function(i){var n,s,o=this.opts(),c=i.data()||{};for(var l in c)c.hasOwnProperty(l)&&/^cycle[A-Z]+/.test(l)&&(n=c[l],s=l.match(/^cycle(.*)/)[1].replace(/^[A-Z]/,t),o.API.log("["+(o.slideCount-1)+"]",s+":",n,"("+typeof n+")"),c[s]=n);c=e.extend({},e.fn.cycle.defaults,o,c),c.slideNum=o.slideCount;try{delete c.API,delete c.slideCount,delete c.currSlide,delete c.nextSlide,delete c.slides}catch(r){}return c},getSlideOpts:function(t){var i=this.opts();void 0===t&&(t=i.currSlide);var n=i.slides[t],s=e(n).data("cycle.opts");return e.extend({},i,s)},initSlide:function(t,i,n){var s=this.opts();i.css(t.slideCss||{}),n>0&&i.css("zIndex",n),isNaN(t.speed)&&(t.speed=e.fx.speeds[t.speed]||e.fx.speeds._default),t.sync||(t.speed=t.speed/2),i.addClass(s.slideClass)},updateView:function(e,t){var i=this.opts();if(i._initialized){var n=i.API.getSlideOpts(),s=i.slides[i.currSlide];!e&&t!==!0&&(i.API.trigger("cycle-update-view-before",[i,n,s]),0>i.updateView)||(i.slideActiveClass&&i.slides.removeClass(i.slideActiveClass).eq(i.currSlide).addClass(i.slideActiveClass),e&&i.hideNonActive&&i.slides.filter(":not(."+i.slideActiveClass+")").css("visibility","hidden"),0===i.updateView&&setTimeout(function(){i.API.trigger("cycle-update-view",[i,n,s,e])},n.speed/(i.sync?2:1)),0!==i.updateView&&i.API.trigger("cycle-update-view",[i,n,s,e]),e&&i.API.trigger("cycle-update-view-after",[i,n,s]))}},getComponent:function(t){var i=this.opts(),n=i[t];return"string"==typeof n?/^\s*[\>|\+|~]/.test(n)?i.container.find(n):e(n):n.jquery?n:e(n)},stackSlides:function(t,i,n){var s=this.opts();t||(t=s.slides[s.currSlide],i=s.slides[s.nextSlide],n=!s.reverse),e(t).css("zIndex",s.maxZ);var o,c=s.maxZ-2,l=s.slideCount;if(n){for(o=s.currSlide+1;l>o;o++)e(s.slides[o]).css("zIndex",c--);for(o=0;s.currSlide>o;o++)e(s.slides[o]).css("zIndex",c--)}else{for(o=s.currSlide-1;o>=0;o--)e(s.slides[o]).css("zIndex",c--);for(o=l-1;o>s.currSlide;o--)e(s.slides[o]).css("zIndex",c--)}e(i).css("zIndex",s.maxZ-1)},getSlideIndex:function(e){return this.opts().slides.index(e)}},e.fn.cycle.log=function(){window.console&&console.log&&console.log("[cycle2] "+Array.prototype.join.call(arguments," "))},e.fn.cycle.version=function(){return"Cycle2: "+i},e.fn.cycle.transitions={custom:{},none:{before:function(e,t,i,n){e.API.stackSlides(i,t,n),e.cssBefore={opacity:1,visibility:"visible",display:"block"}}},fade:{before:function(t,i,n,s){var o=t.API.getSlideOpts(t.nextSlide).slideCss||{};t.API.stackSlides(i,n,s),t.cssBefore=e.extend(o,{opacity:0,visibility:"visible",display:"block"}),t.animIn={opacity:1},t.animOut={opacity:0}}},fadeout:{before:function(t,i,n,s){var o=t.API.getSlideOpts(t.nextSlide).slideCss||{};t.API.stackSlides(i,n,s),t.cssBefore=e.extend(o,{opacity:1,visibility:"visible",display:"block"}),t.animOut={opacity:0}}},scrollHorz:{before:function(e,t,i,n){e.API.stackSlides(t,i,n);var s=e.container.css("overflow","hidden").width();e.cssBefore={left:n?s:-s,top:0,opacity:1,visibility:"visible",display:"block"},e.cssAfter={zIndex:e._maxZ-2,left:0},e.animIn={left:0},e.animOut={left:n?-s:s}}}},e.fn.cycle.defaults={allowWrap:!0,autoSelector:".cycle-slideshow[data-cycle-auto-init!=false]",delay:0,easing:null,fx:"fade",hideNonActive:!0,loop:0,manualFx:void 0,manualSpeed:void 0,manualTrump:!0,maxZ:100,pauseOnHover:!1,reverse:!1,slideActiveClass:"cycle-slide-active",slideClass:"cycle-slide",slideCss:{position:"absolute",top:0,left:0},slides:"> img",speed:500,startingSlide:0,sync:!0,timeout:4e3,updateView:0},e(document).ready(function(){e(e.fn.cycle.defaults.autoSelector).cycle()})})(jQuery),/*! Cycle2 autoheight plugin; Copyright (c) M.Alsup, 2012; version: 20130913 */
function(e){"use strict";function t(t,n){var s,o,c,l=n.autoHeight;if("container"==l)o=e(n.slides[n.currSlide]).outerHeight(),n.container.height(o);else if(n._autoHeightRatio)n.container.height(n.container.width()/n._autoHeightRatio);else if("calc"===l||"number"==e.type(l)&&l>=0){if(c="calc"===l?i(t,n):l>=n.slides.length?0:l,c==n._sentinelIndex)return;n._sentinelIndex=c,n._sentinel&&n._sentinel.remove(),s=e(n.slides[c].cloneNode(!0)),s.removeAttr("id name rel").find("[id],[name],[rel]").removeAttr("id name rel"),s.css({position:"static",visibility:"hidden",display:"block"}).prependTo(n.container).addClass("cycle-sentinel cycle-slide").removeClass("cycle-slide-active"),s.find("*").css("visibility","hidden"),n._sentinel=s}}function i(t,i){var n=0,s=-1;return i.slides.each(function(t){var i=e(this).height();i>s&&(s=i,n=t)}),n}function n(t,i,n,s){var o=e(s).outerHeight();i.container.animate({height:o},i.autoHeightSpeed,i.autoHeightEasing)}function s(i,o){o._autoHeightOnResize&&(e(window).off("resize orientationchange",o._autoHeightOnResize),o._autoHeightOnResize=null),o.container.off("cycle-slide-added cycle-slide-removed",t),o.container.off("cycle-destroyed",s),o.container.off("cycle-before",n),o._sentinel&&(o._sentinel.remove(),o._sentinel=null)}e.extend(e.fn.cycle.defaults,{autoHeight:0,autoHeightSpeed:250,autoHeightEasing:null}),e(document).on("cycle-initialized",function(i,o){function c(){t(i,o)}var l,r=o.autoHeight,a=e.type(r),d=null;("string"===a||"number"===a)&&(o.container.on("cycle-slide-added cycle-slide-removed",t),o.container.on("cycle-destroyed",s),"container"==r?o.container.on("cycle-before",n):"string"===a&&/\d+\:\d+/.test(r)&&(l=r.match(/(\d+)\:(\d+)/),l=l[1]/l[2],o._autoHeightRatio=l),"number"!==a&&(o._autoHeightOnResize=function(){clearTimeout(d),d=setTimeout(c,50)},e(window).on("resize orientationchange",o._autoHeightOnResize)),setTimeout(c,30))})}(jQuery),/*! caption plugin for Cycle2;  version: 20130306 */
function(e){"use strict";e.extend(e.fn.cycle.defaults,{caption:"> .cycle-caption",captionTemplate:"{{slideNum}} / {{slideCount}}",overlay:"> .cycle-overlay",overlayTemplate:"<div>{{title}}</div><div>{{desc}}</div>",captionModule:"caption"}),e(document).on("cycle-update-view",function(t,i,n,s){"caption"===i.captionModule&&e.each(["caption","overlay"],function(){var e=this,t=n[e+"Template"],o=i.API.getComponent(e);o.length&&t?(o.html(i.API.tmpl(t,n,i,s)),o.show()):o.hide()})}),e(document).on("cycle-destroyed",function(t,i){var n;e.each(["caption","overlay"],function(){var e=this,t=i[e+"Template"];i[e]&&t&&(n=i.API.getComponent("caption"),n.empty())})})}(jQuery),/*! command plugin for Cycle2;  version: 20130707 */
function(e){"use strict";var t=e.fn.cycle;e.fn.cycle=function(i){var n,s,o,c=e.makeArray(arguments);return"number"==e.type(i)?this.cycle("goto",i):"string"==e.type(i)?this.each(function(){var l;return n=i,o=e(this).data("cycle.opts"),void 0===o?(t.log('slideshow must be initialized before sending commands; "'+n+'" ignored'),void 0):(n="goto"==n?"jump":n,s=o.API[n],e.isFunction(s)?(l=e.makeArray(c),l.shift(),s.apply(o.API,l)):(t.log("unknown command: ",n),void 0))}):t.apply(this,arguments)},e.extend(e.fn.cycle,t),e.extend(t.API,{next:function(){var e=this.opts();if(!e.busy||e.manualTrump){var t=e.reverse?-1:1;e.allowWrap===!1&&e.currSlide+t>=e.slideCount||(e.API.advanceSlide(t),e.API.trigger("cycle-next",[e]).log("cycle-next"))}},prev:function(){var e=this.opts();if(!e.busy||e.manualTrump){var t=e.reverse?1:-1;e.allowWrap===!1&&0>e.currSlide+t||(e.API.advanceSlide(t),e.API.trigger("cycle-prev",[e]).log("cycle-prev"))}},destroy:function(){this.stop();var t=this.opts(),i=e.isFunction(e._data)?e._data:e.noop;clearTimeout(t.timeoutId),t.timeoutId=0,t.API.stop(),t.API.trigger("cycle-destroyed",[t]).log("cycle-destroyed"),t.container.removeData(),i(t.container[0],"parsedAttrs",!1),t.retainStylesOnDestroy||(t.container.removeAttr("style"),t.slides.removeAttr("style"),t.slides.removeClass(t.slideActiveClass)),t.slides.each(function(){e(this).removeData(),i(this,"parsedAttrs",!1)})},jump:function(e){var t,i=this.opts();if(!i.busy||i.manualTrump){var n=parseInt(e,10);if(isNaN(n)||0>n||n>=i.slides.length)return i.API.log("goto: invalid slide index: "+n),void 0;if(n==i.currSlide)return i.API.log("goto: skipping, already on slide",n),void 0;i.nextSlide=n,clearTimeout(i.timeoutId),i.timeoutId=0,i.API.log("goto: ",n," (zero-index)"),t=i.currSlide<i.nextSlide,i.API.prepareTx(!0,t)}},stop:function(){var t=this.opts(),i=t.container;clearTimeout(t.timeoutId),t.timeoutId=0,t.API.stopTransition(),t.pauseOnHover&&(t.pauseOnHover!==!0&&(i=e(t.pauseOnHover)),i.off("mouseenter mouseleave")),t.API.trigger("cycle-stopped",[t]).log("cycle-stopped")},reinit:function(){var e=this.opts();e.API.destroy(),e.container.cycle()},remove:function(t){for(var i,n,s=this.opts(),o=[],c=1,l=0;s.slides.length>l;l++)i=s.slides[l],l==t?n=i:(o.push(i),e(i).data("cycle.opts").slideNum=c,c++);n&&(s.slides=e(o),s.slideCount--,e(n).remove(),t==s.currSlide?s.API.advanceSlide(1):s.currSlide>t?s.currSlide--:s.currSlide++,s.API.trigger("cycle-slide-removed",[s,t,n]).log("cycle-slide-removed"),s.API.updateView())}}),e(document).on("click.cycle","[data-cycle-cmd]",function(t){t.preventDefault();var i=e(this),n=i.data("cycle-cmd"),s=i.data("cycle-context")||".cycle-slideshow";e(s).cycle(n,i.data("cycle-arg"))})}(jQuery),/*! hash plugin for Cycle2;  version: 20130905 */
function(e){"use strict";function t(t,i){var n;return t._hashFence?(t._hashFence=!1,void 0):(n=window.location.hash.substring(1),t.slides.each(function(s){if(e(this).data("cycle-hash")==n){if(i===!0)t.startingSlide=s;else{var o=s>t.currSlide;t.nextSlide=s,t.API.prepareTx(!0,o)}return!1}}),void 0)}e(document).on("cycle-pre-initialize",function(i,n){t(n,!0),n._onHashChange=function(){t(n,!1)},e(window).on("hashchange",n._onHashChange)}),e(document).on("cycle-update-view",function(e,t,i){i.hash&&"#"+i.hash!=window.location.hash&&(t._hashFence=!0,window.location.hash=i.hash)}),e(document).on("cycle-destroyed",function(t,i){i._onHashChange&&e(window).off("hashchange",i._onHashChange)})}(jQuery),/*! loader plugin for Cycle2;  version: 20131121 */
function(e){"use strict";e.extend(e.fn.cycle.defaults,{loader:!1}),e(document).on("cycle-bootstrap",function(t,i){function n(t,n){function o(t){var o;"wait"==i.loader?(l.push(t),0===a&&(l.sort(c),s.apply(i.API,[l,n]),i.container.removeClass("cycle-loading"))):(o=e(i.slides[i.currSlide]),s.apply(i.API,[t,n]),o.show(),i.container.removeClass("cycle-loading"))}function c(e,t){return e.data("index")-t.data("index")}var l=[];if("string"==e.type(t))t=e.trim(t);else if("array"===e.type(t))for(var r=0;t.length>r;r++)t[r]=e(t[r])[0];t=e(t);var a=t.length;a&&(t.css("visibility","hidden").appendTo("body").each(function(t){function c(){0===--r&&(--a,o(d))}var r=0,d=e(this),u=d.is("img")?d:d.find("img");return d.data("index",t),u=u.filter(":not(.cycle-loader-ignore)").filter(':not([src=""])'),u.length?(r=u.length,u.each(function(){this.complete?c():e(this).load(function(){c()}).on("error",function(){0===--r&&(i.API.log("slide skipped; img not loaded:",this.src),0===--a&&"wait"==i.loader&&s.apply(i.API,[l,n]))})}),void 0):(--a,l.push(d),void 0)}),a&&i.container.addClass("cycle-loading"))}var s;i.loader&&(s=i.API.add,i.API.add=n)})}(jQuery),/*! pager plugin for Cycle2;  version: 20130525 */
function(e){"use strict";function t(t,i,n){var s,o=t.API.getComponent("pager");o.each(function(){var o=e(this);if(i.pagerTemplate){var c=t.API.tmpl(i.pagerTemplate,i,t,n[0]);s=e(c).appendTo(o)}else s=o.children().eq(t.slideCount-1);s.on(t.pagerEvent,function(e){e.preventDefault(),t.API.page(o,e.currentTarget)})})}function i(e,t){var i=this.opts();if(!i.busy||i.manualTrump){var n=e.children().index(t),s=n,o=s>i.currSlide;i.currSlide!=s&&(i.nextSlide=s,i.API.prepareTx(!0,o),i.API.trigger("cycle-pager-activated",[i,e,t]))}}e.extend(e.fn.cycle.defaults,{pager:"> .cycle-pager",pagerActiveClass:"cycle-pager-active",pagerEvent:"click.cycle",pagerTemplate:"<span>&bull;</span>"}),e(document).on("cycle-bootstrap",function(e,i,n){n.buildPagerLink=t}),e(document).on("cycle-slide-added",function(e,t,n,s){t.pager&&(t.API.buildPagerLink(t,n,s),t.API.page=i)}),e(document).on("cycle-slide-removed",function(t,i,n){if(i.pager){var s=i.API.getComponent("pager");s.each(function(){var t=e(this);e(t.children()[n]).remove()})}}),e(document).on("cycle-update-view",function(t,i){var n;i.pager&&(n=i.API.getComponent("pager"),n.each(function(){e(this).children().removeClass(i.pagerActiveClass).eq(i.currSlide).addClass(i.pagerActiveClass)}))}),e(document).on("cycle-destroyed",function(e,t){var i=t.API.getComponent("pager");i&&(i.children().off(t.pagerEvent),t.pagerTemplate&&i.empty())})}(jQuery),/*! prevnext plugin for Cycle2;  version: 20130709 */
function(e){"use strict";e.extend(e.fn.cycle.defaults,{next:"> .cycle-next",nextEvent:"click.cycle",disabledClass:"disabled",prev:"> .cycle-prev",prevEvent:"click.cycle",swipe:!1}),e(document).on("cycle-initialized",function(e,t){if(t.API.getComponent("next").on(t.nextEvent,function(e){e.preventDefault(),t.API.next()}),t.API.getComponent("prev").on(t.prevEvent,function(e){e.preventDefault(),t.API.prev()}),t.swipe){var i=t.swipeVert?"swipeUp.cycle":"swipeLeft.cycle swipeleft.cycle",n=t.swipeVert?"swipeDown.cycle":"swipeRight.cycle swiperight.cycle";t.container.on(i,function(){t.API.next()}),t.container.on(n,function(){t.API.prev()})}}),e(document).on("cycle-update-view",function(e,t){if(!t.allowWrap){var i=t.disabledClass,n=t.API.getComponent("next"),s=t.API.getComponent("prev"),o=t._prevBoundry||0,c=void 0!==t._nextBoundry?t._nextBoundry:t.slideCount-1;t.currSlide==c?n.addClass(i).prop("disabled",!0):n.removeClass(i).prop("disabled",!1),t.currSlide===o?s.addClass(i).prop("disabled",!0):s.removeClass(i).prop("disabled",!1)}}),e(document).on("cycle-destroyed",function(e,t){t.API.getComponent("prev").off(t.nextEvent),t.API.getComponent("next").off(t.prevEvent),t.container.off("swipeleft.cycle swiperight.cycle swipeLeft.cycle swipeRight.cycle swipeUp.cycle swipeDown.cycle")})}(jQuery),/*! progressive loader plugin for Cycle2;  version: 20130315 */
function(e){"use strict";e.extend(e.fn.cycle.defaults,{progressive:!1}),e(document).on("cycle-pre-initialize",function(t,i){if(i.progressive){var n,s,o=i.API,c=o.next,l=o.prev,r=o.prepareTx,a=e.type(i.progressive);if("array"==a)n=i.progressive;else if(e.isFunction(i.progressive))n=i.progressive(i);else if("string"==a){if(s=e(i.progressive),n=e.trim(s.html()),!n)return;if(/^(\[)/.test(n))try{n=e.parseJSON(n)}catch(d){return o.log("error parsing progressive slides",d),void 0}else n=n.split(RegExp(s.data("cycle-split")||"\n")),n[n.length-1]||n.pop()}r&&(o.prepareTx=function(e,t){var s,o;return e||0===n.length?(r.apply(i.API,[e,t]),void 0):(t&&i.currSlide==i.slideCount-1?(o=n[0],n=n.slice(1),i.container.one("cycle-slide-added",function(e,t){setTimeout(function(){t.API.advanceSlide(1)},50)}),i.API.add(o)):t||0!==i.currSlide?r.apply(i.API,[e,t]):(s=n.length-1,o=n[s],n=n.slice(0,s),i.container.one("cycle-slide-added",function(e,t){setTimeout(function(){t.currSlide=1,t.API.advanceSlide(-1)},50)}),i.API.add(o,!0)),void 0)}),c&&(o.next=function(){var e=this.opts();if(n.length&&e.currSlide==e.slideCount-1){var t=n[0];n=n.slice(1),e.container.one("cycle-slide-added",function(e,t){c.apply(t.API),t.container.removeClass("cycle-loading")}),e.container.addClass("cycle-loading"),e.API.add(t)}else c.apply(e.API)}),l&&(o.prev=function(){var e=this.opts();if(n.length&&0===e.currSlide){var t=n.length-1,i=n[t];n=n.slice(0,t),e.container.one("cycle-slide-added",function(e,t){t.currSlide=1,t.API.advanceSlide(-1),t.container.removeClass("cycle-loading")}),e.container.addClass("cycle-loading"),e.API.add(i,!0)}else l.apply(e.API)})}})}(jQuery),/*! tmpl plugin for Cycle2;  version: 20121227 */
function(e){"use strict";e.extend(e.fn.cycle.defaults,{tmplRegex:"{{((.)?.*?)}}"}),e.extend(e.fn.cycle.API,{tmpl:function(t,i){var n=RegExp(i.tmplRegex||e.fn.cycle.defaults.tmplRegex,"g"),s=e.makeArray(arguments);return s.shift(),t.replace(n,function(t,i){var n,o,c,l,r=i.split(".");for(n=0;s.length>n;n++)if(c=s[n]){if(r.length>1)for(l=c,o=0;r.length>o;o++)c=l,l=l[r[o]]||i;else l=c[i];if(e.isFunction(l))return l.apply(c,s);if(void 0!==l&&null!==l&&l!=i)return l}return i})}})}(jQuery);
//@ sourceMappingURL=jquery.cycle2.js.map
/*! carousel transition plugin for Cycle2;  version: 20130528 */
(function($) {
"use strict";

$( document ).on('cycle-bootstrap', function( e, opts, API ) {
    if ( opts.fx !== 'carousel' )
        return;

    API.getSlideIndex = function( el ) {
        var slides = this.opts()._carouselWrap.children();
        var i = slides.index( el );
        return i % slides.length;
    };

    // override default 'next' function
    API.next = function() {
        var count = opts.reverse ? -1 : 1;
        if ( opts.allowWrap === false && ( opts.currSlide + count ) > opts.slideCount - opts.carouselVisible )
            return;
        opts.API.advanceSlide( count );
        opts.API.trigger('cycle-next', [ opts ]).log('cycle-next');
    };

});


$.fn.cycle.transitions.carousel = {
    // transition API impl
    preInit: function( opts ) {
        opts.hideNonActive = false;
        
        opts.container.on('cycle-destroyed', $.proxy(this.onDestroy, opts.API));
        // override default API implementation
        opts.API.stopTransition = this.stopTransition;

        // issue #10
        for (var i=0; i < opts.startingSlide; i++) {
            opts.container.append( opts.slides[0] );
        }        
    },

    // transition API impl
    postInit: function( opts ) {
        var i, j, slide, pagerCutoffIndex, wrap;
        var vert = opts.carouselVertical;
        if (opts.carouselVisible && opts.carouselVisible > opts.slideCount)
            opts.carouselVisible = opts.slideCount - 1;
        var visCount = opts.carouselVisible || opts.slides.length;
        var slideCSS = { display: vert ? 'block' : 'inline-block', position: 'static' };

        // required styles
        opts.container.css({ position: 'relative', overflow: 'hidden' });
        opts.slides.css( slideCSS );

        opts._currSlide = opts.currSlide;

        // wrap slides in a div; this div is what is animated
        wrap = $('<div class="cycle-carousel-wrap"></div>')
            .prependTo( opts.container )
            .css({ margin: 0, padding: 0, top: 0, left: 0, position: 'absolute' })
            .append( opts.slides );

        opts._carouselWrap = wrap;

        if ( !vert )
            wrap.css('white-space', 'nowrap');

        if ( opts.allowWrap !== false ) {
            // prepend and append extra slides so we don't see any empty space when we
            // near the end of the carousel.  for fluid containers, add even more clones
            // so there is plenty to fill the screen
            // @todo: optimzie this based on slide sizes

            for ( j=0; j < (opts.carouselVisible === undefined ? 2 : 1); j++ ) {
                for ( i=0; i < opts.slideCount; i++ ) {
                    wrap.append( opts.slides[i].cloneNode(true) );
                }
                i = opts.slideCount;
                while ( i-- ) { // #160, #209
                    wrap.prepend( opts.slides[i].cloneNode(true) );
                }
            }

            wrap.find('.cycle-slide-active').removeClass('cycle-slide-active');
            opts.slides.eq(opts.startingSlide).addClass('cycle-slide-active');
        }

        if ( opts.pager && opts.allowWrap === false ) {
            // hide "extra" pagers
            pagerCutoffIndex = opts.slideCount - visCount;
            $( opts.pager ).children().filter( ':gt('+pagerCutoffIndex+')' ).hide();
        }

        opts._nextBoundry = opts.slideCount - opts.carouselVisible;

        this.prepareDimensions( opts );
    },

    prepareDimensions: function( opts ) {
        var dim, offset, pagerCutoffIndex, tmp;
        var vert = opts.carouselVertical;
        var visCount = opts.carouselVisible || opts.slides.length;

        if ( opts.carouselFluid && opts.carouselVisible ) {
            if ( ! opts._carouselResizeThrottle ) {
            // fluid container AND fluid slides; slides need to be resized to fit container
                this.fluidSlides( opts );
            }
        }
        else if ( opts.carouselVisible && opts.carouselSlideDimension ) {
            dim = visCount * opts.carouselSlideDimension;
            opts.container[ vert ? 'height' : 'width' ]( dim );
        }
        else if ( opts.carouselVisible ) {
            dim = visCount * $(opts.slides[0])[vert ? 'outerHeight' : 'outerWidth'](true);
            opts.container[ vert ? 'height' : 'width' ]( dim );
        }
        // else {
        //     // fluid; don't size the container
        // }

        offset = ( opts.carouselOffset || 0 );
        if ( opts.allowWrap !== false ) {
            if ( opts.carouselSlideDimension ) {
                offset -= ( (opts.slideCount + opts.currSlide) * opts.carouselSlideDimension );
            }
            else {
                // calculate offset based on actual slide dimensions
                tmp = opts._carouselWrap.children();
                for (var j=0; j < (opts.slideCount + opts.currSlide); j++) {
                    offset -= $(tmp[j])[vert?'outerHeight':'outerWidth'](true);
                }
            }
        }

        opts._carouselWrap.css( vert ? 'top' : 'left', offset );
    },

    fluidSlides: function( opts ) {
        var timeout;
        var slide = opts.slides.eq(0);
        var adjustment = slide.outerWidth() - slide.width();
        var prepareDimensions = this.prepareDimensions;

        // throttle resize event
        $(window).on( 'resize', resizeThrottle);

        opts._carouselResizeThrottle = resizeThrottle;
        onResize();

        function resizeThrottle() {
            clearTimeout( timeout );
            timeout = setTimeout( onResize, 20 );
        }

        function onResize() {
            opts._carouselWrap.stop( false, true );
            var slideWidth = opts.container.width() / opts.carouselVisible;
            slideWidth = Math.ceil( slideWidth - adjustment );
            opts._carouselWrap.children().width( slideWidth );
            if ( opts._sentinel )
                opts._sentinel.width( slideWidth );
            prepareDimensions( opts );
        }
    },

    // transition API impl
    transition: function( opts, curr, next, fwd, callback ) {
        var moveBy, props = {};
        var hops = opts.nextSlide - opts.currSlide;
        var vert = opts.carouselVertical;
        var speed = opts.speed;

        // handle all the edge cases for wrapping & non-wrapping
        if ( opts.allowWrap === false ) {
            fwd = hops > 0;
            var currSlide = opts._currSlide;
            var maxCurr = opts.slideCount - opts.carouselVisible;
            if ( hops > 0 && opts.nextSlide > maxCurr && currSlide == maxCurr ) {
                hops = 0;
            }
            else if ( hops > 0 && opts.nextSlide > maxCurr ) {
                hops = opts.nextSlide - currSlide - (opts.nextSlide - maxCurr);
            }
            else if ( hops < 0 && opts.currSlide > maxCurr && opts.nextSlide > maxCurr ) {
                hops = 0;
            }
            else if ( hops < 0 && opts.currSlide > maxCurr ) {
                hops += opts.currSlide - maxCurr;
            }
            else 
                currSlide = opts.currSlide;

            moveBy = this.getScroll( opts, vert, currSlide, hops );
            opts.API.opts()._currSlide = opts.nextSlide > maxCurr ? maxCurr : opts.nextSlide;
        }
        else {
            if ( fwd && opts.nextSlide === 0 ) {
                // moving from last slide to first
                moveBy = this.getDim( opts, opts.currSlide, vert );
                callback = this.genCallback( opts, fwd, vert, callback );
            }
            else if ( !fwd && opts.nextSlide == opts.slideCount - 1 ) {
                // moving from first slide to last
                moveBy = this.getDim( opts, opts.currSlide, vert );
                callback = this.genCallback( opts, fwd, vert, callback );
            }
            else {
                moveBy = this.getScroll( opts, vert, opts.currSlide, hops );
            }
        }

        props[ vert ? 'top' : 'left' ] = fwd ? ( "-=" + moveBy ) : ( "+=" + moveBy );

        // throttleSpeed means to scroll slides at a constant rate, rather than
        // a constant speed
        if ( opts.throttleSpeed )
            speed = (moveBy / $(opts.slides[0])[vert ? 'height' : 'width']() ) * opts.speed;

        opts._carouselWrap.animate( props, speed, opts.easing, callback );
    },

    getDim: function( opts, index, vert ) {
        var slide = $( opts.slides[index] );
        return slide[ vert ? 'outerHeight' : 'outerWidth'](true);
    },

    getScroll: function( opts, vert, currSlide, hops ) {
        var i, moveBy = 0;

        if (hops > 0) {
            for (i=currSlide; i < currSlide+hops; i++)
                moveBy += this.getDim( opts, i, vert);
        }
        else {
            for (i=currSlide; i > currSlide+hops; i--)
                moveBy += this.getDim( opts, i, vert);
        }
        return moveBy;
    },

    genCallback: function( opts, fwd, vert, callback ) {
        // returns callback fn that resets the left/top wrap position to the "real" slides
        return function() {
            var pos = $(opts.slides[opts.nextSlide]).position();
            var offset = 0 - pos[vert?'top':'left'] + (opts.carouselOffset || 0);
            opts._carouselWrap.css( opts.carouselVertical ? 'top' : 'left', offset );
            callback();
        };
    },

    // core API override
    stopTransition: function() {
        var opts = this.opts();
        opts.slides.stop( false, true );
        opts._carouselWrap.stop( false, true );
    },

    // core API supplement
    onDestroy: function( e ) {
        var opts = this.opts();
        if ( opts._carouselResizeThrottle )
            $( window ).off( 'resize', opts._carouselResizeThrottle );
        opts.slides.prependTo( opts.container );
        opts._carouselWrap.remove();
    }
};

})(jQuery);
/*!
 * jQuery Cookie Plugin v1.4.0
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as anonymous module.
		define(['jquery'], factory);
	} else {
		// Browser globals.
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
		} catch(e) {
			return;
		}

		try {
			// If we can't parse the cookie, ignore it, it's unusable.
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write
		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) !== undefined) {
			// Must not alter options, thus extending a fresh object...
			$.cookie(key, '', $.extend({}, options, { expires: -1 }));
			return true;
		}
		return false;
	};

}));

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */