(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["squatch"] = factory();
	else
		root["squatch"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.version = undefined;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /**
	                                                                                                                                                                                                                                                  * Squatch.js
	                                                                                                                                                                                                                                                  * 
	                                                                                                                                                                                                                                                  * This library is accessed using an asynchronous syntax, so none of the methods
	                                                                                                                                                                                                                                                  * in this library should be called directly.
	                                                                                                                                                                                                                                                  * 
	                                                                                                                                                                                                                                                  * To call methods, push them to an array called `_sqh`
	                                                                                                                                                                                                                                                  * 
	                                                                                                                                                                                                                                                  * Example: To initialize the library
	                                                                                                                                                                                                                                                  * 
	                                                                                                                                                                                                                                                  * _sqh = _sqh || [];
	                                                                                                                                                                                                                                                  * _sqh.push(['init', { 
	                                                                                                                                                                                                                                                  *   tenant_alias: 'example',
	                                                                                                                                                                                                                                                  *   account_id: 'abc_def',
	                                                                                                                                                                                                                                                  *   user_id: '54321',
	                                                                                                                                                                                                                                                  *   email: 'bob@example.com',
	                                                                                                                                                                                                                                                  *   first_name: 'Bob',
	                                                                                                                                                                                                                                                  *   last_name: 'Testerson',
	                                                                                                                                                                                                                                                  *   mode: 'POPUP'
	                                                                                                                                                                                                                                                  * }]);
	                                                                                                                                                                                                                                                  * 
	                                                                                                                                                                                                                                                  * For non-authenticated apps you will only be able to use the cookie loader and
	                                                                                                                                                                                                                                                  * should only pass in your tenant_alias.
	                                                                                                                                                                                                                                                  * 
	                                                                                                                                                                                                                                                  * For authenticated apps:
	                                                                                                                                                                                                                                                  * 
	                                                                                                                                                                                                                                                  * Accepts 3 Integer Modes for authenticated apps: 
	                                                                                                                                                                                                                                                  * 
	                                                                                                                                                                                                                                                  * NOCONTENT - No content mode :
	                                                                                                                                                                                                                                                  * This mode simply performs a lightweight data push to look for and synchronize
	                                                                                                                                                                                                                                                  * referral status changes. It also returns the referral code if the current
	                                                                                                                                                                                                                                                  * user has been referred. 
	                                                                                                                                                                                                                                                  * 
	                                                                                                                                                                                                                                                  * EMBED - Embed mode : This mode allows you to embed
	                                                                                                                                                                                                                                                  * the widget on your page and also supports code loading. 
	                                                                                                                                                                                                                                                  * 
	                                                                                                                                                                                                                                                  * POPUP - Popup mode :
	                                                                                                                                                                                                                                                  * This mode allows you to load a popup window that will be triggered when your
	                                                                                                                                                                                                                                                  * customers click on a button of your choosing. This mode is selected by
	                                                                                                                                                                                                                                                  * default if no other mode is selected.
	                                                                                                                                                                                                                                                  */

	var _getScriptPath = __webpack_require__(2);

	var _getScriptPath2 = _interopRequireDefault(_getScriptPath);

	var _polyfillJquery = __webpack_require__(4);

	var _polyfillJquery2 = _interopRequireDefault(_polyfillJquery);

	var _onScriptFailure = __webpack_require__(6);

	var _onScriptFailure2 = _interopRequireDefault(_onScriptFailure);

	var _log2 = __webpack_require__(3);

	var _log3 = _interopRequireDefault(_log2);

	var _consts = __webpack_require__(7);

	var consts = _interopRequireWildcard(_consts);

	var _rpc = __webpack_require__(8);

	var rpc = _interopRequireWildcard(_rpc);

	var _popupWidget = __webpack_require__(10);

	var popupWidget = _interopRequireWildcard(_popupWidget);

	var _cookieCodeWidget = __webpack_require__(16);

	var cookieCodeWidget = _interopRequireWildcard(_cookieCodeWidget);

	var _embeddedWidget = __webpack_require__(17);

	var embeddedWidget = _interopRequireWildcard(_embeddedWidget);

	var _noContentWidget = __webpack_require__(18);

	var noContentWidget = _interopRequireWildcard(_noContentWidget);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// Widget Configs
	var DEFAULT_MODE = consts.POPUP_MODE;

	// set via loadJQueryAndBegin (identifies the host we're loading under)
	var hostSrc = null;

	/**
	 * State variables
	 */
	var initCalled = false;

	var hasAccountId = false;
	var data = null;
	var $ = null;

	/**
	 * Synchronously calls methods from the async API
	 * 
	 * @param fnToDo -
	 *            an associative array such as ['init', sqhConfig]
	 */
	function execute(fnToDo) {
	    var method = void 0;

	    if (fnToDo instanceof Array) {
	        method = fnToDo[0];
	    } else {
	        method = fnToDo;
	    }

	    /*
	     * These are all of our public methods
	     */
	    switch (method) {
	        case consts.JS_API_INIT_CALL:
	            init(fnToDo[1]);
	            break;
	        case consts.JS_API_AUTOFILL_CALL:
	            autofill(fnToDo[1]);
	            break;
	        case consts.JS_API_GET_REWARD_BALANCES_CALL:
	            getRewardBalance(fnToDo[1], fnToDo[2]);
	            break;
	        case consts.JS_API_GET_FEATURE_REWARD_BALANCES_CALL:
	            getRewardFeatureBalance(fnToDo[1], fnToDo[2]);
	            break;
	        case consts.JS_API_GET_REWARD_CALL:
	            getReward(fnToDo[1]);
	            break;
	        case consts.JS_API_OPEN_CALL:
	            popupWidget.open();
	            break;
	        case consts.JS_API_CLOSE_CALL:
	            popupWidget.close();
	            break;
	        case consts.JS_API_SUBSCRIBE_CALL:
	            rpc.subscribe(fnToDo[1], fnToDo[2]);
	            break;
	        default:
	            console.error("Unknown method call `" + method + "`. Valid options are [init,autofill,getReward,getRewardBalance]");
	            break;
	    }
	}

	/**
	 * Called when the library is loaded. The library will not be fully ready
	 * until 'init' is called with appropriate configuration variables
	 * 
	 * @param $j - a version of jQuery compatible with the jQuery.reveal plugin
	 */
	function main($j) {
	    $j(document).ready(function ($jQuery) {
	        $ = $jQuery;

	        // first look for any subscriptions prior to init (these should be added first so there's no potential to miss subscribed events immediately after init)
	        for (var i = 0; i < window._sqh.length; i++) {
	            var current = window._sqh[i];
	            if (current[0] == consts.JS_API_SUBSCRIBE_CALL) {
	                execute(current);
	                window._sqh.splice(i, 1);
	            }
	        }

	        // now initialize the widget frame
	        var initIdx = -1;
	        for (var _i = 0; _i < window._sqh.length; _i++) {
	            var _current = window._sqh[_i];
	            if (_current[0] == consts.JS_API_INIT_CALL) {
	                execute(_current);
	                // Removes from the queue
	                initIdx = _i;
	                break;
	            }
	        }
	        if (initIdx > -1) {
	            window._sqh.splice(initIdx, 1);
	        } else {
	            console.error('Could not find "init" in the _sqh queue when squatch.js was loaded.');
	        }
	    });
	}

	/**
	 * Add a js api call to be added to the queue to be executed next
	 * 
	 */
	function pushJsApiCall(callName, callValue) {
	    window._sqh.push([callName, callValue]);
	}

	function formatEmptyParam(sqhConfig, propName, debugMsg) {
	    if (typeof sqhConfig[propName] === 'undefined') {
	        sqhConfig[propName] = consts.IGNORE_OPTIONAL_WIDGET_PARAM;
	    } else if (!sqhConfig[propName]) {
	        (0, _log3.default)(debugMsg);
	        sqhConfig[propName] = "";
	    }
	}

	/**
	 * Initializes the Squatch.Js library with configuration variables
	 * 
	 * @param sqh_config -
	 *            a config object
	 */
	function init(sqh_config) {

	    if (initCalled) {
	        (0, _log3.default)('Should not call init more than once');
	        return;
	    }
	    initCalled = true;

	    if (!sqh_config.tenant_alias) {
	        // EM allow this to continue so we can catch the resulting 404
	        console.error('tenant_alias must be set');
	    }

	    // if the autofill param is pushed then queue it to be run after init
	    if (typeof sqh_config.autofill !== 'undefined') {
	        pushJsApiCall(consts.JS_API_AUTOFILL_CALL, sqh_config.autofill);
	    }

	    var widgetToEmbed = void 0;

	    if (typeof sqh_config.account_id === 'undefined') {
	        // load the code from the cookie code filler
	        widgetToEmbed = cookieCodeWidget;
	    } else {
	        hasAccountId = true;

	        // load the popup widget / code
	        if (!sqh_config.user_id || !sqh_config.first_name) {
	            console.error('The user_id, email, first_name must be set');
	            return;
	        }

	        if (!sqh_config.last_name) {
	            (0, _log3.default)("No last name set. Defaulting to empty");
	            sqh_config.last_name = "";
	        }

	        if (typeof sqh_config.email === 'undefined') {
	            sqh_config.email = consts.IGNORE_OPTIONAL_WIDGET_PARAM;
	        }

	        if (typeof sqh_config.payment_provider_id === 'undefined') {
	            sqh_config.payment_provider_id = consts.IGNORE_OPTIONAL_WIDGET_PARAM;
	        } else if (sqh_config.payment_provider_id === null) {
	            (0, _log3.default)("Payment provider id provided, but is null. Default to special value");
	            sqh_config.payment_provider_id = consts.UNREGISTERED_PAYMENTPROVIDER_PARAM;
	        }

	        if (typeof sqh_config.checksum === 'undefined') {
	            sqh_config.checksum = consts.IGNORE_OPTIONAL_WIDGET_PARAM;
	        }

	        if (typeof sqh_config.jwt === 'undefined') {
	            sqh_config.jwt = consts.IGNORE_OPTIONAL_WIDGET_PARAM;
	        }

	        if (sqh_config.checksum == consts.IGNORE_OPTIONAL_WIDGET_PARAM && sqh_config.jwt == consts.IGNORE_OPTIONAL_WIDGET_PARAM) {
	            // If we don't have a signed request, error for any secure params that are set. Right now this is just user_image
	            if (sqh_config.user_image && sqh_config.user_image.len > 0) {
	                console.error("User images will not be accepted without signed requests.");
	            }
	        }

	        if (!sqh_config.checksum && !sqh_config.jwt) {
	            if (!sqh_config.checksum) {
	                sqh_config.checksum = "";
	            }
	            if (!sqh_config.jwt) {
	                sqh_config.jwt = "";
	            }
	            console.error("Checksum or JWT not set properly for signed widget request.");
	        }

	        formatEmptyParam(sqh_config, 'user_image', "No user profile image set. Defaulting to gravatar");
	        formatEmptyParam(sqh_config, 'fb_share_image', "No fb share image set. Defaulting to no image");
	        formatEmptyParam(sqh_config, 'account_status', "No account_status set. Defaulting to no account_status");
	        formatEmptyParam(sqh_config, 'referral_code', "No referral_code set. Defaulting to no referral_code");
	        formatEmptyParam(sqh_config, 'user_referral_code', "No user_referral_code set. Defaulting to no user_referral_code");
	        formatEmptyParam(sqh_config, 'locale', "No locale set. Defaulting to no locale");

	        sqh_config.mode = sqh_config.mode || sqh_config.mode === 0 ? sqh_config.mode : DEFAULT_MODE;

	        switch (sqh_config.mode) {
	            case consts.NO_CONTENT_MODE:
	                widgetToEmbed = noContentWidget;
	                break;
	            case consts.EMBED_MODE:
	                widgetToEmbed = embeddedWidget;
	                break;
	            case consts.POPUP_MODE:
	                widgetToEmbed = popupWidget;
	                break;
	            case consts.DEMO_MODE:
	                widgetToEmbed = popupWidget;
	                break;
	            case consts.DEMO_EMBED_MODE:
	                widgetToEmbed = embeddedWidget;
	                break;
	            default:
	                console.error('Unsupported mode: \'' + sqh_config.mode + '\'. Please initialize with one of the following modes: \'NOCONTENT\', \'EMBED\', or \'POPUP\'');
	        }
	    }

	    if (widgetToEmbed) {

	        if (widgetToEmbed === embeddedWidget && $('#squatchembed').length <= 0) {
	            // Embedded widget was requested, but not embed div found.
	            // Falling back to No Content Mode
	            sqh_config.mode = consts.NO_CONTENT_MODE;
	            widgetToEmbed = noContentWidget;
	        }

	        $.ajaxSetup({
	            cache: true
	        });

	        $.getScript(hostSrc + consts.EASYXDM_PATH, function () {
	            (0, _log3.default)("easyXDM loaded");

	            widgetToEmbed.create(sqh_config, $, hostSrc, onWidgetLoaded);
	        }).fail(_onScriptFailure2.default);
	    } else {
	        (0, _log3.default)('No widget being embedded. Probably because of a lack of configuration.');
	    }
	}

	/**
	 * Called when the Squatch library is fully set up, with appropriate widget/RPC mechanism through EasyXDM fully loaded.
	 */
	function onWidgetLoaded(hasInitError, theData) {
	    // do no further processing on error
	    if (typeof hasInitError !== 'undefined' && hasInitError) {
	        return;
	    }

	    // The data returned by the RPC
	    data = theData;

	    // Empties the enqueued methods in _sqh
	    var next = window._sqh.shift();
	    while (next) {
	        execute(next);
	        next = window._sqh.shift();
	    }

	    // Overrides _sqh array's push method so that it will directly call
	    // `execute`
	    window._sqh.push = function () {
	        for (var i = 0; i < arguments.length; i++) {
	            execute(arguments[i]);
	        }
	        // TODO: Don't actually push to underlying array otherwise it will
	        // keep growing infinitely
	        return Array.prototype.push.apply(this, arguments);
	    };
	}

	/**
	 * Autofills the current user's in-progress referral code. (i.e. This is
	 * their friend's code)
	 * 
	 */
	function autofill(args) {
	    if (typeof args == 'string') {
	        if (data.code) {
	            $(args).val(data.code);
	        } else {
	            // No in progress referral
	        }
	    } else if (typeof args == 'function') {
	        args(data.code);
	    } else {
	        console.error('The "autofill" method should be called with either a jQuery selector or a callback. Unknown type ' + (typeof args === 'undefined' ? 'undefined' : _typeof(args)));
	    }
	}

	/**
	 * Gets the reward value for current user's account
	 * 
	 */
	function getReward(fn) {
	    // deprecated legacy for ghost or anyone else who started implementing this
	    if (typeof fn == 'function') {
	        if (hasAccountId) {
	            fn(getLegacyAggregateRewardLookup());
	        } else {
	            console.error('Unsupported reward lookup widget push, you need to push with an account Id to use this feature');
	        }
	    } else {
	        console.error('Unsupported widget reward lookup push, invalid params.');
	    }
	}

	function getLegacyAggregateRewardLookup() {
	    var discountReward = {};
	    if (data.rewardBalance) {
	        for (var i = 0; i < data.rewardBalance.length; i++) {
	            if (data.rewardBalance[i].type == 'PCT_DISCOUNT') {
	                discountReward = data.rewardBalance[i];
	            }
	        }
	    } else {
	        console.warn("Reward balance could not be found, it may not be implemented in your widget theme.");
	    }
	    if (typeof discountReward.type != 'undefined') {
	        return {
	            'type': 'PCT_DISCOUNT',
	            'details': {
	                'discountPercentage': discountReward.totalDiscountPercent,
	                'referrerDiscountPercent': discountReward.referrerDiscountPercent,
	                'referredDiscountPercent': discountReward.referredDiscountPercent
	            }
	        };
	    } else {
	        return {
	            'type': 'PCT_DISCOUNT',
	            'details': {
	                'discountPercentage': 0,
	                'referrerDiscountPercent': 0,
	                'referredDiscountPercent': 0
	            }
	        };
	    }
	}

	function getRewardBalanceForType(type) {
	    var rewards = [];
	    if (data.rewardBalance) {
	        for (var i = 0; i < data.rewardBalance.length; i++) {
	            if (data.rewardBalance[i].type == type) {
	                rewards.push(data.rewardBalance[i]);
	            }
	        }
	    } else {
	        console.warn("Reward balance could not be found, it may not be implemented in your widget theme.");
	    }
	    return rewards;
	}

	/**
	 * Gets the reward list for current user's account (optionally filter by type)
	 * 
	 */
	function getRewardBalance(type, fn) {
	    if (hasAccountId) {
	        if (typeof type == 'string') {
	            if (typeof fn == 'function') {
	                fn(getRewardBalanceForType(type));
	            } else {
	                console.error('Unsupported widget reward type lookup push, invalid params.');
	            }
	        } else {
	            if (typeof type == 'function') {
	                type(data.rewardBalance);
	            } else {
	                console.error('Unsupported widget reward lookup push, invalid params.');
	            }
	        }
	    } else {
	        console.error('Unsupported reward lookup widget push, you need to push with an account Id to use this feature');
	    }
	}

	/**
	 * Gets the feature rewards filtered by featureType
	 * 
	 */
	function getRewardFeatureBalance(featureType, fn) {
	    if (hasAccountId) {
	        if (typeof featureType == 'string' && typeof fn == 'function') {
	            var featureRewardBalances = getRewardBalanceForType('FEATURE');
	            var rewards = [];
	            for (var i = 0; i < featureRewardBalances.length; i++) {
	                if (featureRewardBalances[i].featureType == featureType) {
	                    rewards.push(featureRewardBalances[i]);
	                }
	            }
	            fn(rewards);
	        } else {
	            console.error('Unsupported widget reward type lookup push, invalid params.');
	        }
	    } else {
	        console.error('Unsupported reward lookup widget push, you need to push with an account Id to use this feature');
	    }
	}

	function onLoad() {
	    // TODO: LV: This could probably be done so that we don't rely on `_sqh` being present at page load
	    if (typeof _sqh === 'undefined') {
	        console.error('_sqh must be defined and initialized to use this widget.\n         To initialize the popup widget call: \n         _sqh.push([\'init\',\n            {tenant_alias: \'$yourTenantAlias\', \n            account_id: \'$viewingCustomerAccountId\',\n            email: \'$viewingCustomerEmail\', \n            user_id : \'$viewingUserId\', \n            first_name: \'$viewingCustomerFirstName\', \n            last_name: \'$viewingCustomerLastName\'\n         ]}]);');
	    } else {
	        (0, _getScriptPath2.default)(consts.SQUATCHJS_SCRIPT_NAME_REGEX, function (srcUrl) {

	            if (!srcUrl) {
	                console.error("Could not find properly formatted squatch.js DOM scripts");
	                return;
	            }
	            hostSrc = srcUrl;
	            (0, _polyfillJquery2.default)(srcUrl + consts.JQUERY_PATH, function (jq) {
	                // Entry point to all the magic.
	                main(jq);
	            });
	        });
	    }
	}

	// Kicks off everything
	onLoad();
	var version = exports.version = "v1.0.0";

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = getScriptPath;

	var _log2 = __webpack_require__(3);

	var _log3 = _interopRequireDefault(_log2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Waits for the DOM script element to load, so we can parse the Source URL and get the CDN/Host URL
	 * 
	 * Then in other functions that CDN domain be used to load other scripts
	 * 
	 * e.g.
	 *      SRC Url: https://d2rcp9ak152ke1.cloudfront.net/assets/javascripts/squatch.min.js
	 *      Returns to callback: https://d2rcp9ak152ke1.cloudfront.net
	 */
	function getScriptPath(scriptRegex, callback) {
	    var iteration = arguments.length <= 2 || arguments[2] === undefined ? 10 : arguments[2];


	    // Seems like overkill? It's not.
	    // It seems like this other approach might work, but it doesn't when the script is loaded asynchronously: http://stackoverflow.com/questions/2976651/javascript-how-do-i-get-the-url-of-script-being-called

	    //  Try to find the src this script was loaded under and if it can't be found
	    //  iteratively wait and try again for the provided iteration count

	    var scripts = document.getElementsByTagName('script');
	    var len = scripts.length;

	    var embedSrc = null;

	    while (len--) {
	        var src = scripts[len].src;
	        if (src && src.match(scriptRegex)) {
	            embedSrc = src;
	            break;
	        }
	    }

	    if (embedSrc || iteration <= 0) {
	        var hostSrc = null;
	        if (embedSrc) {
	            // Extract the host part of the Squatch.js url
	            (0, _log3.default)(hostSrc);
	            hostSrc = embedSrc.substr(0, embedSrc.lastIndexOf('/') + 1);
	            // embedSrc.match(new RegExp('https?://[^/]*'))[0];
	        }
	        callback(hostSrc);
	    } else {
	        (0, _log3.default)("squatch js not finished loading try again.");

	        setTimeout(function () {
	            getScriptPath(scriptRegex, callback, --iteration);
	        }, 50);
	    }
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = _log;
	/**
	 * Logging to help with debugging
	 */
	var debug = true;

	function _log() {
	    debug && window.console && console.log.apply(console, arguments);
	}

	if (!(window.console && console.log)) {
	    console = {
	        log: function log() {},
	        debug: function debug() {},
	        info: function info() {},
	        warn: function warn() {},
	        error: function error() {}
	    };
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = polyfillJquery;

	var _loadScript = __webpack_require__(5);

	var _loadScript2 = _interopRequireDefault(_loadScript);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var JQUERY_VERSIONS = new RegExp('[1]\.[7-9](\.[0-9])?');

	/**
	 * Load JQuery if it's not already loaded, or if it's version is insufficient for our purposes
	 * 
	 * @param {string} hostSrc The domain including protocol host of jQuery
	 * @param {Function} callback Async callback that will get either `window.jQuery`, or our own loaded version.
	 */
	function polyfillJquery(jQueryUrl, callback) {
	    var re = arguments.length <= 2 || arguments[2] === undefined ? JQUERY_VERSIONS : arguments[2];


	    /** ****** Load jQuery if not present ******** */
	    if (window.jQuery === undefined || !re.test(window.jQuery.fn.jquery)) {
	        (0, _loadScript2.default)(jQueryUrl, function () {
	            // Restore $ and window.jQuery to their previous values and store
	            // the new jQuery in our local jQuery variable
	            var newJQuery = window.jQuery.noConflict(true);

	            callback(newJQuery);
	        });
	    } else {
	        // The jQuery version on the window is the one we want to use
	        callback(window.jQuery);
	    }
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = loadScript;
	/**
	 * Loads a Script by appending it to the <head>
	 */
	function loadScript(scriptUrl, scriptLoadHandler) {
	    var script_tag = document.createElement('script');
	    script_tag.setAttribute('type', 'text/javascript');
	    script_tag.setAttribute('src', scriptUrl);
	    if (script_tag.readyState) {
	        script_tag.onreadystatechange = function () {
	            // For old
	            // versions of
	            // IE
	            if (this.readyState == 'complete' || this.readyState == 'loaded') {
	                scriptLoadHandler();
	            }
	        };
	    } else {
	        script_tag.onload = scriptLoadHandler;
	    }
	    // Try to find the head, otherwise default to the documentElement
	    (document.getElementsByTagName('head')[0] || document.documentElement).appendChild(script_tag);
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = onScriptFailure;
	/**
	 * Called when one of our required dependencies fails to load (such as
	 * jQuery, easyXDM, ...)
	 */
	function onScriptFailure() {
	    if (arguments[0].readyState == 0) {
	        // script failed to load
	        console.error('Failed to load script');
	    } else {
	        // script loaded but failed to parse
	        console.error('Failed to parse script: ' + arguments[2].toString());
	    }
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * 
	 * JS API Calls
	 * 
	 */
	var JS_API_INIT_CALL = exports.JS_API_INIT_CALL = 'init';
	var JS_API_AUTOFILL_CALL = exports.JS_API_AUTOFILL_CALL = 'autofill';
	var JS_API_GET_REWARD_BALANCES_CALL = exports.JS_API_GET_REWARD_BALANCES_CALL = 'getRewardBalance';
	var JS_API_GET_FEATURE_REWARD_BALANCES_CALL = exports.JS_API_GET_FEATURE_REWARD_BALANCES_CALL = 'getRewardFeatureBalance';
	var JS_API_GET_REWARD_CALL = exports.JS_API_GET_REWARD_CALL = 'getReward';
	var JS_API_OPEN_CALL = exports.JS_API_OPEN_CALL = 'open';
	var JS_API_CLOSE_CALL = exports.JS_API_CLOSE_CALL = 'close';
	var JS_API_SUBSCRIBE_CALL = exports.JS_API_SUBSCRIBE_CALL = 'subscribe';

	/*
	*
	* Widget Modes
	*
	*/
	var NO_CONTENT_MODE = exports.NO_CONTENT_MODE = 'NOCONTENT';
	var EMBED_MODE = exports.EMBED_MODE = 'EMBED';
	var POPUP_MODE = exports.POPUP_MODE = 'POPUP';
	var DEMO_MODE = exports.DEMO_MODE = 'DEMO';
	var DEMO_EMBED_MODE = exports.DEMO_EMBED_MODE = 'DEMO_EMBED';

	/**
	 * 
	 * Parameters
	 * 
	 */
	var DEFAULT_AUTO_OPEN = exports.DEFAULT_AUTO_OPEN = 'squatch_open';
	var IGNORE_OPTIONAL_WIDGET_PARAM = exports.IGNORE_OPTIONAL_WIDGET_PARAM = '_IGNORE_';
	var UNREGISTERED_PAYMENTPROVIDER_PARAM = exports.UNREGISTERED_PAYMENTPROVIDER_PARAM = 'UNREGISTERED';

	var SQUATCHJS_SCRIPT_NAME_REGEX = exports.SQUATCHJS_SCRIPT_NAME_REGEX = /squatch(\.min)?\.js(\?.*)*$/;

	// export const JQUERY_PATH = '/assets/javascripts/jquery-1.9.0.min.js';
	// export const JQUERY_REVEAL_PATH = '/assets/javascripts-min/reveal.js';
	// export const JQUERY_REVEAL_CSS_PATH = '/assets/css/widget/external/reveal.min.css';
	// export const EASYXDM_PATH = '/assets/javascripts/easyXDM.min.js';

	var JQUERY_PATH = exports.JQUERY_PATH = '/external/jquery-1.9.0.min.js';
	var JQUERY_REVEAL_PATH = exports.JQUERY_REVEAL_PATH = '/external/reveal.js';
	var JQUERY_REVEAL_CSS_PATH = exports.JQUERY_REVEAL_CSS_PATH = '/external/reveal.css';
	var EASYXDM_PATH = exports.EASYXDM_PATH = '/external/easyXDM.min.js';

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.setup = setup;
	exports.subscribe = subscribe;

	var _log2 = __webpack_require__(3);

	var _log3 = _interopRequireDefault(_log2);

	var _consts = __webpack_require__(7);

	var _widgetUrls = __webpack_require__(9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Warning: `subscriptions` is stateful. It will accumulate event listeners.
	 * 
	 * TODO: Look at using native DOM event listener pattern instead of this object thing.
	 */
	var subscriptions = {};

	/**
	 * Setup the iframe/RPC. The ready function will be called when frame is
	 * loaded, close function when the close button is pressed, and the pageType
	 * will mark the page as a class (ie to differentiate embed/popup views)
	 */
	function setup(sqh_config, opts) {
	    var framediv = opts.framediv;
	    var callback = opts.callback;
	    var closeFnc = opts.closeFnc;
	    var pageType = opts.pageType; // destructuring: it's awesome, google it ;)

	    var remote = (0, _widgetUrls.getFrameUrl)(sqh_config, pageType);
	    var resizeEmbedToContent = true;

	    function resizeIframe(width, height) {
	        var iframe = framediv.getElementsByTagName('iframe')[0];
	        iframe.style.height = height + "px";
	        iframe.style.width = (sqh_config.mode == _consts.EMBED_MODE || sqh_config.mode == _consts.DEMO_EMBED_MODE) && !resizeEmbedToContent ? '100%' : width + "px";
	    }

	    // handle incoming messages from the iframe popup
	    var rpc = new window.easyXDM.Rpc({
	        remote: remote,
	        container: framediv,
	        props: {
	            allowtransparency: "true",
	            scrolling: "no",
	            marginwidth: "0",
	            marginheight: "0",
	            frameborder: "no"
	        }
	    }, {
	        local: {
	            init: function init(height, width, codeIn, rewardBalanceIn, resizeEmbedToContentIn) {
	                (0, _log3.default)("got init message");
	                // true if embed mode should resize to the content of the frame - otherwise have the iframe expand to the entire area of its wrapper
	                resizeEmbedToContent = resizeEmbedToContentIn;
	                resizeIframe(width, height);
	                // Caches our stateful data for faster use later
	                var data = {
	                    code: codeIn,
	                    rewardBalance: rewardBalanceIn
	                };
	                callback(false, data);
	            },
	            resize: function resize(height, width) {
	                (0, _log3.default)("got resize message");
	                resizeIframe(width, height);
	                window.dispatchEvent(new window.Event('resize.modal')); // Triggers modal resize. Previously used JQuery -- $(window).trigger('resize.modal');
	            },
	            publish: function publish(eventName, payload) {
	                (0, _log3.default)("got publish message");
	                if (subscriptions[eventName]) {
	                    // publish the event of type eventName to all available subscribers
	                    for (var i = 0; i < subscriptions[eventName].length; i++) {
	                        subscriptions[eventName][i](payload);
	                    }
	                }
	            },
	            close: function close() {
	                (0, _log3.default)("got close message");
	                closeFnc();
	            },
	            error: function error(errorMessage, height, width) {
	                console.error(errorMessage);
	                resizeEmbedToContent = false;
	                resizeIframe(width, height);
	                callback(true);
	            }
	        },
	        remote: {
	            openedWidget: {},
	            closedWidget: {}
	        }
	    });

	    return rpc;
	}

	/**
	 * Subscribes the provided callback (fn) to widget events of the type 'eventName'
	 * 
	 */
	function subscribe(eventName, fn) {
	    if (!subscriptions[eventName]) {
	        subscriptions[eventName] = [];
	    }
	    subscriptions[eventName].push(fn); // push the provided callback to be called when the widget publishes 'eventName'
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.getTenantHost = getTenantHost;
	exports.getFrameUrl = getFrameUrl;

	var _consts = __webpack_require__(7);

	/**
	 * Get the tenant host url
	 * 
	 */
	function getTenantHost(sqh_config) {
	    var domain = typeof sqh_config.host === 'undefined' ? 'app.referralsaasquatch.com' : sqh_config.host;
	    return window.location.protocol + '//' + domain + '/a/' + sqh_config.tenant_alias + '/';
	}

	/**
	 * 
	 * Builds a Widget URL based on the params in `sqh_config`
	 * 
	 * @param {Object} sqh_config an object containing the details for the user to set up
	 * @param {string} pageType the page type
	 * 
	 */
	function getFrameUrl(sqh_config, pageType) {
	    var paymentProviderId = void 0;
	    var systemId = void 0;

	    //Check for the legacy case (aka: account_id field is actually the 'paymentProviderId'
	    if (sqh_config.payment_provider_id == _consts.IGNORE_OPTIONAL_WIDGET_PARAM) {
	        paymentProviderId = sqh_config.account_id;
	        systemId = _consts.IGNORE_OPTIONAL_WIDGET_PARAM;
	    } else if (sqh_config.payment_provider_id == _consts.UNREGISTERED_PAYMENTPROVIDER_PARAM) {
	        //Unregistered case, where the payment_provider_id is explicitly set to null, and there is a systemId. 
	        paymentProviderId = _consts.IGNORE_OPTIONAL_WIDGET_PARAM;
	        systemId = sqh_config.account_id;
	    } else {
	        //This case is NOT allowed!
	        paymentProviderId = sqh_config.payment_provider_id;
	        systemId = sqh_config.account_id === null ? "" : sqh_config.account_id;
	    }

	    var systemAndPaymentProviderAppendString = void 0;

	    if (systemId != _consts.IGNORE_OPTIONAL_WIDGET_PARAM) {
	        systemAndPaymentProviderAppendString = 'systemId=' + encodeURIComponent(systemId) + (paymentProviderId != _consts.IGNORE_OPTIONAL_WIDGET_PARAM ? '&paymentProviderId=' + encodeURIComponent(paymentProviderId) : '');
	    } else {
	        systemAndPaymentProviderAppendString = paymentProviderId != _consts.IGNORE_OPTIONAL_WIDGET_PARAM ? 'paymentProviderId=' + encodeURIComponent(paymentProviderId) : '';
	    }

	    return getTenantHost(sqh_config) + 'widgets/squatchwidget?' + systemAndPaymentProviderAppendString + '&userId=' + encodeURIComponent(sqh_config.user_id) + (sqh_config.email != _consts.IGNORE_OPTIONAL_WIDGET_PARAM ? '&email=' + encodeURIComponent(sqh_config.email) : '') + '&firstName=' + encodeURIComponent(sqh_config.first_name) + '&lastName=' + encodeURIComponent(sqh_config.last_name) + (sqh_config.user_image != _consts.IGNORE_OPTIONAL_WIDGET_PARAM ? '&userImage=' + encodeURIComponent(sqh_config.user_image) : '') + (sqh_config.checksum != _consts.IGNORE_OPTIONAL_WIDGET_PARAM ? '&paramChecksum=' + encodeURIComponent(sqh_config.checksum) : '') + (sqh_config.jwt != _consts.IGNORE_OPTIONAL_WIDGET_PARAM ? '&paramJwt=' + encodeURIComponent(sqh_config.jwt) : '') + (sqh_config.locale != _consts.IGNORE_OPTIONAL_WIDGET_PARAM ? '&locale=' + encodeURIComponent(sqh_config.locale) : '') + (sqh_config.fb_share_image != _consts.IGNORE_OPTIONAL_WIDGET_PARAM ? '&fbShareImage=' + encodeURIComponent(sqh_config.fb_share_image) : '') + (sqh_config.account_status != _consts.IGNORE_OPTIONAL_WIDGET_PARAM ? '&accountStatus=' + encodeURIComponent(sqh_config.account_status) : '') + (sqh_config.referral_code != _consts.IGNORE_OPTIONAL_WIDGET_PARAM ? '&referralCode=' + encodeURIComponent(sqh_config.referral_code) : '') + (sqh_config.user_referral_code != _consts.IGNORE_OPTIONAL_WIDGET_PARAM ? '&userReferralCode=' + encodeURIComponent(sqh_config.user_referral_code) : '') + '&pageType=' + pageType + '&mode=' + sqh_config.mode;
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.create = create;
	exports.open = open;
	exports.close = close;

	var _log2 = __webpack_require__(3);

	var _log3 = _interopRequireDefault(_log2);

	var _onScriptFailure = __webpack_require__(6);

	var _onScriptFailure2 = _interopRequireDefault(_onScriptFailure);

	var _rpc = __webpack_require__(8);

	var rpc = _interopRequireWildcard(_rpc);

	var _reveal = __webpack_require__(11);

	var _reveal2 = _interopRequireDefault(_reveal);

	var _consts = __webpack_require__(7);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Beware: These variables are stateful
	 */
	var modalWrapper = null;

	/**
	 * Called to load popup widget
	 * 
	 */
	function create(sqh_config, $, hostSrc, callback) {

	    (0, _log3.default)("loading popup widget");

	    // Load JQuery.reveal
	    (0, _reveal2.default)($);

	    (0, _log3.default)("reveal loaded");

	    // setup the popup container for reveal
	    var framediv = document.createElement('div');
	    framediv.setAttribute('id', 'squatchModal');
	    framediv.setAttribute('class', 'reveal-modal');

	    $('<div></div>').attr('id', 'squatchModalWrapper').append(framediv).appendTo('body');

	    modalWrapper = $('#squatchModalWrapper');

	    var rpcOpts = {
	        framediv: framediv,
	        callback: callback,
	        closeFnc: function closeFnc() {
	            $('#squatchModalWrapper').trigger('squatch:close');
	        },
	        pageType: "modalPopup"
	    };
	    var irpc = rpc.setup(sqh_config, rpcOpts);

	    // handle the popup closing (via clicking close or outside
	    // of the frame)
	    $('#squatchModalWrapper').on('reveal:close', '#squatchModal', function () {
	        irpc.closedWidget();
	    });

	    // reveal the iframe popup
	    $('body').on('click', '.squatchpop', function (e) {
	        e.preventDefault();
	        // prevent race condition of page not being ready yet
	        $('#squatchModalWrapper').trigger('squatch:open');
	    });

	    // listen for events to close the modal widget
	    modalWrapper.on('squatch:close', function (e) {
	        $('#squatchModal').trigger('reveal:close');
	    });

	    // listen for events to open the modal widget
	    modalWrapper.on('squatch:open', function (e) {
	        irpc.openedWidget(sqh_config.mode, sqh_config.user_id, sqh_config.account_id);
	        $('#squatchModal').reveal();
	    });

	    checkForAutoOpen(sqh_config, $);
	}

	/**
	 * Open the squatch popup widget if it has been loaded
	 */
	function open() {
	    if (!modalWrapper) {
	        console.error("The squatch widget must be loaded in popup mode to be opened");
	        return;
	    }
	    // Previously used JQuery to dispatch event: $('#squatchModalWrapper').trigger('squatch:open');
	    modalWrapper.trigger('squatch:open');
	}

	/**
	 * Close the squatch popup widget if it has been loaded
	 */
	function close() {
	    if (!modalWrapper) {
	        console.error("The squatch widget must be loaded in popup mode to be closed");
	        return;
	    }
	    // Previously used JQuery to dispatch event: $('#squatchModalWrapper').trigger('squatch:close');
	    modalWrapper.trigger('squatch:close');
	}

	/**
	 * Check whether the popup should be automatically shown when the paged is
	 * loaded
	 * 
	 */
	function checkForAutoOpen(sqh_config, $) {
	    var hasAutoPopped = false;
	    var autoShowPopupParam = !sqh_config.auto_open_param ? _consts.DEFAULT_AUTO_OPEN : sqh_config.auto_open_param;

	    var query = window.location.search.substring(1);
	    var vars = query.split("&");
	    for (var i = 0; i < vars.length; i++) {
	        if (vars[i] === autoShowPopupParam) {
	            (function () {
	                var autoOpenInterval = setInterval(function () {
	                    $(document).ready(function () {
	                        open(); // Opens the popup
	                        hasAutoPopped = true;
	                    });
	                    if (hasAutoPopped) {
	                        clearInterval(autoOpenInterval);
	                    }
	                }, 1000);
	            })();
	        }
	    }
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = setup;

	var _reveal = __webpack_require__(12);

	var _reveal2 = _interopRequireDefault(_reveal);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function setup($) {

	  /*---------------------------
	   Defaults for Reveal
	  ----------------------------*/

	  /*---------------------------
	   Listener for data-reveal-id attributes
	  ----------------------------*/

	  $(document).ready(function () {

	    // LV: Injects the stylesheets
	    _reveal2.default.use(); // = style.ref();

	    // LV: Commented out this part, as we don't use it.
	    // $('a[data-reveal-id]').on('click', function(e) {
	    //   e.preventDefault();
	    //   var modalLocation = $(this).attr('data-reveal-id');
	    //   $('#' + modalLocation).reveal($(this).data());
	    // });
	  });

	  /*---------------------------
	   Extend and Execute
	  ----------------------------*/

	  $.fn.reveal = function (opts) {

	    var defaults = {
	      animationspeed: 200, // how fast animations are
	      closeonbackgroundclick: true, //if you click background will modal close?
	      dismissmodalclass: 'close-reveal-modal' //the class of a button or element that will close an open modal
	    };

	    //Extend dem' options
	    var options = $.extend({}, defaults, opts);

	    return this.each(function () {

	      /*---------------------------
	       Global Variables
	      ----------------------------*/
	      var modal = $(this),
	          locked = false,
	          modalBG = $('.reveal-modal-bg');

	      /*---------------------------
	       Create Modal BG
	      ----------------------------*/
	      if (modalBG.length == 0) {
	        modalBG = $('<div class="reveal-modal-bg" />').insertAfter(modal);
	      }

	      /*---------------------------
	       Open & Close Animations
	      ----------------------------*/

	      //Entrance Animations
	      modal.bind('reveal:open', function () {
	        modalBG.unbind('click.modalEvent');
	        $('.' + options.dismissmodalclass).unbind('click.modalEvent');
	        if (!locked) {
	          lockModal();
	          modal.css({
	            'opacity': 0,
	            'visibility': 'visible'
	          });
	          centerModal(-40);
	          modalBG.fadeIn(options.animationspeed / 2, "linear");
	          modal.animate(centeredCss(0), {
	            duration: options.animationspeed,
	            speed: "linear",
	            callback: unlockModal()
	          }).animate({
	            "opacity": 1
	          }, {
	            duration: options.animationspeed * 3 / 4,
	            speed: "linear",
	            queue: false
	          });
	          $(window).bind('resize.modal', centerModal);
	        }
	        modal.unbind('reveal:open');
	      });

	      //Closing Animation
	      modal.bind('reveal:close', function () {
	        if (!locked) {
	          lockModal();
	          modal.css({
	            'visibility': 'hidden',
	            'marginTop': "-40px",
	            'top': "-2000px",
	            'opacity': '0'
	          }); /* use top: -2000px to keep iframe out of frame when not in use (see issue400) */
	          modalBG.css({
	            'display': 'none'
	          });
	          unlockModal();
	          $(window).unbind('resize.modal');
	        }
	        modal.unbind('reveal:close');
	      });

	      /*---------------------------
	       Open and add Closing Listeners
	      ----------------------------*/
	      //Open Modal Immediately
	      modal.trigger('reveal:open');

	      // LV: Our close button is embedded in the iframe, we don't use this functionality
	      //Close Modal Listeners
	      // var closeButton = $('.' + options.dismissmodalclass).bind('click.modalEvent', function() {
	      //   modal.trigger('reveal:close');
	      // });

	      if (options.closeonbackgroundclick) {
	        modalBG.css({
	          "cursor": "pointer"
	        });
	        modalBG.bind('click.modalEvent', function () {
	          modal.trigger('reveal:close');
	        });
	      }
	      $('body').keyup(function (e) {
	        if (e.which === 27) {
	          modal.trigger('reveal:close');
	        } // 27 is the keycode for the Escape key
	      });

	      /*---------------------------
	       Animations Locks
	      ----------------------------*/
	      function unlockModal() {
	        locked = false;
	      }

	      function lockModal() {
	        locked = true;
	      }

	      function centeredCss(topMarg) {
	        return {
	          'top': ($(window).height() - modal.outerHeight()) / 2 + 'px',
	          'left': ($(window).width() - modal.outerWidth()) / 2 + 'px',
	          'marginTop': topMarg + "px"
	        };
	      }

	      function centerModal(topMarg) {
	        modal.css(centeredCss(topMarg));
	      }
	    }); //each call
	  }; //orbit plugin call
	} /*
	   * jQuery Reveal Plugin 1.0
	   * www.ZURB.com
	   * Copyright 2010, ZURB
	   * Copyright 2013, Yupiq Solutions - Modifications to support additional animation features
	   * Free to use under the MIT license.
	   * http://www.opensource.org/licenses/mit-license.php
	   */

	// LV: See Webpack style-loader for how this CSS magic is loaded
	// https://github.com/webpack/style-loader#reference-counted-api

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var refs = 0;
	var dispose;
	var content = __webpack_require__(13);
	if(typeof content === 'string') content = [[module.id, content, '']];
	exports.use = exports.ref = function() {
		if(!(refs++)) {
			exports.locals = content.locals;
			dispose = __webpack_require__(15)(content, {});
		}
		return exports;
	};
	exports.unuse = exports.unref = function() {
		if(!(--refs)) {
			dispose();
			dispose = null;
		}
	};
	if(false) {
		var lastRefs = module.hot.data && module.hot.data.refs || 0;
		if(lastRefs) {
			exports.ref();
			if(!content.locals) {
				refs = lastRefs;
			}
		}
		if(!content.locals) {
			module.hot.accept();
		}
		module.hot.dispose(function(data) {
			data.refs = content.locals ? 0 : refs;
			if(dispose) {
				dispose();
			}
		});
	}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(14)();
	// imports


	// module
	exports.push([module.id, "/*\t--------------------------------------------------\nReveal Modals\n-------------------------------------------------- */\n\t\n.reveal-modal-bg { \n\tposition: fixed;\n\theight: 100%;\n\twidth: 100%;\n\tbackground: #000;\n\tbackground: rgba(0,0,0,.6);\n\tz-index: 100;\n\tdisplay: none;\n\ttop: 0;\n\tleft: 0; \n}\n\n.reveal-modal {\n\tvisibility: hidden;\n\topacity: 0;\n\tposition: fixed;\n\tz-index: 101;\n\ttop: -2000px; /* keep the iframe off screen when not visible (see issue400) */\n}\n\t\n.reveal-modal iframe {\n\toverflow: hidden;\n}\n\n/*.reveal-modal.small \t\t{ width: 200px; margin-left: -140px;}*/\n/*.reveal-modal.medium \t\t{ width: 400px; margin-left: -240px;}*/\n/*.reveal-modal.large \t\t{ width: 600px; margin-left: -340px;}*/\n/*.reveal-modal.xlarge \t\t{ width: 800px; margin-left: -440px;}*/\n\n/*.reveal-modal .close-reveal-modal {*/\n/*\tfont-size: 22px;*/\n/*\tline-height: .5;*/\n/*\tposition: absolute;*/\n/*\ttop: 8px;*/\n/*\tright: 11px;*/\n/*\tcolor: #aaa;*/\n/*\ttext-shadow: 0 -1px 1px rbga(0,0,0,.6);*/\n/*\tfont-weight: bold;*/\n/*\tcursor: pointer;*/\n/*\t} */\n/*\n\t\nNOTES\n\nClose button entity is &#215;\n\nExample markup\n\n<div id=\"myModal\" class=\"reveal-modal\">\n\t<h2>Awesome. I have it.</h2>\n\t<p class=\"lead\">Your couch.  I it's mine.</p>\n\t<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ultrices aliquet placerat. Duis pulvinar orci et nisi euismod vitae tempus lorem consectetur. Duis at magna quis turpis mattis venenatis eget id diam. </p>\n\t<a class=\"close-reveal-modal\">&#215;</a>\n</div>\n\n*/", ""]);

	// exports


/***/ },
/* 14 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.create = create;

	var _log2 = __webpack_require__(3);

	var _log3 = _interopRequireDefault(_log2);

	var _widgetUrls = __webpack_require__(9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Called to load widget that grabs fillable code from cookie
	 * 
	 */
	function create(sqh_config, $, hostSrc, callback) {

	    (0, _log3.default)("loading cookie code widget");

	    var frameUrl = (0, _widgetUrls.getTenantHost)(sqh_config) + 'widgets/squatchcookie';

	    // handle incoming messages from the iframe popup
	    var rpc = new window.easyXDM.Rpc({
	        remote: frameUrl
	    }, {
	        local: {
	            init: function init(codeIn) {
	                (0, _log3.default)("got init message");

	                // Caches our stateful data for faster use later
	                var data = {
	                    code: codeIn
	                };
	                callback(false, data);
	            }
	        }
	    });

	    return rpc;
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.create = undefined;

	var _log2 = __webpack_require__(3);

	var _log3 = _interopRequireDefault(_log2);

	var _consts = __webpack_require__(7);

	var _rpc = __webpack_require__(8);

	var rpc = _interopRequireWildcard(_rpc);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Called to load embed widget
	 * 
	 */
	function create(sqh_config, $, hostSrc, _callback) {

	    (0, _log3.default)("loading embed widget");
	    // LV: This div layout is nuts, but it is unchanged for legacy support. Our outer HTML structure is kind of like a standard interface.
	    var framediv = document.createElement('div');
	    $('<div></div>').hide().attr('id', 'squatchEmbedWrapper').append(framediv).insertAfter($("#squatchembed"));

	    var rpcOpts = {
	        framediv: framediv,
	        callback: function callback(hasInitError, data) {
	            // don't show response immediately so there's time for the page to be
	            // resized appropriately
	            setTimeout(function () {
	                $("#squatchembed").hide();
	                $("#squatchEmbedWrapper").show();
	                _callback(hasInitError, data);
	            }, 500);
	        },
	        closeFnc: function closeFnc() {},
	        pageType: "embeddedWidget"
	    };

	    var irpc = rpc.setup(sqh_config, rpcOpts);

	    // record as a widget open if the the widget was successfully
	    // embeded
	    // if the div was not embedded (i.e. squatchEmbedWrapper not set)
	    // then this will be ignored
	    irpc.openedWidget(sqh_config.mode, sqh_config.user_id, sqh_config.account_id);
	    return irpc;
	}
	exports.create = create;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.create = create;

	var _log2 = __webpack_require__(3);

	var _log3 = _interopRequireDefault(_log2);

	var _widgetUrls = __webpack_require__(9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Creates a No Content widget
	 */
	function create(sqh_config, $, hostSrc, callback) {

	    var frameUrl = (0, _widgetUrls.getFrameUrl)(sqh_config, "");

	    // setup the popup container for reveal
	    var nocontentdiv = document.createElement('div');

	    $('<div></div>').hide().append(nocontentdiv).appendTo('body');

	    // handle incoming messages from the iframe popup
	    var rpc = new window.easyXDM.Rpc({
	        remote: frameUrl,
	        container: nocontentdiv,
	        props: {
	            allowtransparency: "true",
	            scrolling: "no",
	            marginwidth: "0",
	            marginheight: "0",
	            frameborder: "no"
	        }
	    }, {
	        local: {
	            init: function init(codeIn, rewardIn) {
	                (0, _log3.default)("got init message");

	                // Caches our stateful data for faster use later
	                var data = {
	                    code: codeIn,
	                    reward: rewardIn
	                };
	                callback(false, data);
	            },
	            error: function error(errorMessage) {
	                console.error(errorMessage);
	            }
	        }
	    });

	    return rpc;
	}

/***/ }
/******/ ])
});
;