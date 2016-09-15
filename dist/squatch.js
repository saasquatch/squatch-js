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
	                                                                                                                                                                                                                                                  * _sqh = _sqh || []; _sqh.push(['init', { tenant_alias: 'example', account_id:
	                                                                                                                                                                                                                                                  * 'cust_123example', // A stripe or recurly ID user_id: '54321', email:
	                                                                                                                                                                                                                                                  * 'bob@example.com', first_name: 'Bob', last_name: 'Testerson', mode : 'POPUP'
	                                                                                                                                                                                                                                                  * }]);
	                                                                                                                                                                                                                                                  * 
	                                                                                                                                                                                                                                                  * For non-authenticated apps you will only be able to use the cookie loader and
	                                                                                                                                                                                                                                                  * should only pass in your tenant_alias.
	                                                                                                                                                                                                                                                  * 
	                                                                                                                                                                                                                                                  * For authenticated apps:
	                                                                                                                                                                                                                                                  * 
	                                                                                                                                                                                                                                                  * Accepts 3 Integer Modes for authenticated apps: NOCONTENT - No content mode :
	                                                                                                                                                                                                                                                  * This mode simply performs a lightweight data push to look for and synchronize
	                                                                                                                                                                                                                                                  * referral status changes. It also returns the referral code if the current
	                                                                                                                                                                                                                                                  * user has been referred. EMBED - Embed mode : This mode allows you to embed
	                                                                                                                                                                                                                                                  * the widget on your page and also supports code loading. POPUP - Popup mode :
	                                                                                                                                                                                                                                                  * This mode allows you to load a popup window that will be triggered when your
	                                                                                                                                                                                                                                                  * customers click on a button of your choosing. This mode is selected by
	                                                                                                                                                                                                                                                  * default if no other mode is selected.
	                                                                                                                                                                                                                                                  */

	var _awaitScriptLoad = __webpack_require__(2);

	var _awaitScriptLoad2 = _interopRequireDefault(_awaitScriptLoad);

	var _polyfillJquery = __webpack_require__(5);

	var _polyfillJquery2 = _interopRequireDefault(_polyfillJquery);

	var _onScriptFailure = __webpack_require__(6);

	var _onScriptFailure2 = _interopRequireDefault(_onScriptFailure);

	var _log2 = __webpack_require__(3);

	var _log3 = _interopRequireDefault(_log2);

	var _consts = __webpack_require__(4);

	var consts = _interopRequireWildcard(_consts);

	var _rpc = __webpack_require__(7);

	var rpc = _interopRequireWildcard(_rpc);

	var _popupWidget = __webpack_require__(9);

	var popupWidget = _interopRequireWildcard(_popupWidget);

	var _cookieCodeWidget = __webpack_require__(10);

	var cookieCodeWidget = _interopRequireWildcard(_cookieCodeWidget);

	var _embeddedWidget = __webpack_require__(11);

	var embeddedWidget = _interopRequireWildcard(_embeddedWidget);

	var _noContentWidget = __webpack_require__(12);

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
	        window.squatchQuery = $jQuery; // NOTE: very important -- the `squatchQuery` is used directly in our modified version of jquery.reveal
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

	        if (typeof sqh_config.user_image === 'undefined') {
	            sqh_config.user_image = consts.IGNORE_OPTIONAL_WIDGET_PARAM;
	        } else if (!sqh_config.user_image) {
	            (0, _log3.default)("No user profile image set. Defaulting to gravatar");
	            sqh_config.user_image = "";
	        }

	        if (typeof sqh_config.fb_share_image === 'undefined') {
	            sqh_config.fb_share_image = consts.IGNORE_OPTIONAL_WIDGET_PARAM;
	        } else if (!sqh_config.fb_share_image) {
	            (0, _log3.default)("No fb share image set. Defaulting to no image");
	            sqh_config.fb_share_image = "";
	        }

	        if (typeof sqh_config.account_status === 'undefined') {
	            sqh_config.account_status = consts.IGNORE_OPTIONAL_WIDGET_PARAM;
	        } else if (!sqh_config.account_status) {
	            (0, _log3.default)("No account_status set. Defaulting to no account_status");
	            sqh_config.account_status = "";
	        }

	        if (typeof sqh_config.referral_code === 'undefined') {
	            sqh_config.referral_code = consts.IGNORE_OPTIONAL_WIDGET_PARAM;
	        } else if (!sqh_config.referral_code) {
	            (0, _log3.default)("No referral_code set. Defaulting to no referral_code");
	            sqh_config.referral_code = "";
	        }

	        if (typeof sqh_config.user_referral_code === 'undefined') {
	            sqh_config.user_referral_code = consts.IGNORE_OPTIONAL_WIDGET_PARAM;
	        } else if (!sqh_config.user_referral_code) {
	            (0, _log3.default)("No user_referral_code set. Defaulting to no user_referral_code");
	            sqh_config.user_referral_code = "";
	        }

	        if (typeof sqh_config.locale === 'undefined') {
	            sqh_config.locale = consts.IGNORE_OPTIONAL_WIDGET_PARAM;
	        } else if (!sqh_config.locale) {
	            (0, _log3.default)("No locale set. Defaulting to no locale");
	            sqh_config.locale = "";
	        }

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
	        (0, _awaitScriptLoad2.default)(10, function (srcUrl) {

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
	var version = "v1.0.0";

	exports.default = version;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = awaitScriptLoad;

	var _log2 = __webpack_require__(3);

	var _log3 = _interopRequireDefault(_log2);

	var _consts = __webpack_require__(4);

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
	function awaitScriptLoad(iteration, callback) {

	    // TODO: LV: Is this just overkill? Seems like this other approach might work: http://stackoverflow.com/questions/2976651/javascript-how-do-i-get-the-url-of-script-being-called

	    var scriptEls = document.getElementsByTagName('script');
	    var thisScriptEl = scriptEls[scriptEls.length - 1];
	    var scriptPath = thisScriptEl.src;
	    var scriptFolder = scriptPath.substr(0, scriptPath.lastIndexOf('/') + 1);

	    callback(scriptFolder);
	    //  Try to find the src this script was loaded under and if it can't be found
	    //  iteratively wait and try again for the provided iteration count

	    // const scripts = document.getElementsByTagName('script');
	    // let len = scripts.length;

	    // let embedSrc = null;

	    // while (len--) {
	    //     let src = scripts[len].src;
	    //     if (src && src.match(SQUATCHJS_SCRIPT_NAME_REGEX)) {
	    //         embedSrc = src;
	    //         break;
	    //     }
	    // }

	    // if (embedSrc || iteration <= 0) {
	    //     let hostSrc = null;
	    //     if(embedSrc){
	    //         // Extract the host part of the Squatch.js url
	    //         _log(hostSrc);
	    //         hostSrc = embedSrc.match(new RegExp('https?://[^/]*'))[0];
	    //     }
	    //     callback(hostSrc);
	    // }
	    // else {
	    //     _log("squatch js not finished loading try again.");

	    //     setTimeout(function() {
	    //         awaitScriptLoad(--iteration, callback);
	    //     }, 50);
	    // }
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
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = polyfillJquery;

	/**
	 * Load JQuery if it's not already loaded, or if it's version is insufficient for our purposes
	 * 
	 * @param {string} hostSrc The domain including protocol host of jQuery
	 * @param {Function} callback Async callback that will get either `window.jQuery`, or our own loaded version.
	 */
	function polyfillJquery(jQueryUrl, callback) {

	    /** ****** Called once jQuery has loaded ***** */
	    var scriptLoadHandler = function scriptLoadHandler() {
	        // Restore $ and window.jQuery to their previous values and store
	        // the
	        // new jQuery in our local jQuery variable
	        var squatchQuery = window.jQuery.noConflict(true);
	        // Call our main function
	        callback(squatchQuery);
	    };

	    /** ****** Load jQuery if not present ******** */
	    var re = new RegExp('[1]\.[7-9](\.[0-9])?');
	    if (window.jQuery === undefined || !re.test(window.jQuery.fn.jquery)) {
	        var script_tag = document.createElement('script');
	        script_tag.setAttribute('type', 'text/javascript');
	        script_tag.setAttribute('src', jQueryUrl);
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
	    } else {
	        // The jQuery version on the window is the one we want to use
	        callback(window.jQuery);
	    }
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
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.setup = setup;
	exports.subscribe = subscribe;

	var _log2 = __webpack_require__(3);

	var _log3 = _interopRequireDefault(_log2);

	var _consts = __webpack_require__(4);

	var _widgetUrls = __webpack_require__(8);

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

	    var frameUrl = (0, _widgetUrls.getFrameUrl)(sqh_config, pageType);
	    var resizeEmbedToContent = true;

	    // handle incoming messages from the iframe popup
	    var rpc = new window.easyXDM.Rpc({
	        remote: frameUrl,
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

	                framediv.getElementsByTagName('iframe')[0].style.height = height + "px";
	                framediv.getElementsByTagName('iframe')[0].style.width = (sqh_config.mode == _consts.EMBED_MODE || sqh_config.mode == _consts.DEMO_EMBED_MODE) && !resizeEmbedToContent ? '100%' : width + "px";

	                // Caches our stateful data for faster use later
	                var data = {
	                    code: codeIn,
	                    rewardBalance: rewardBalanceIn
	                };
	                callback(false, data);
	            },
	            resize: function resize(height, width) {
	                (0, _log3.default)("got resize message");
	                framediv.getElementsByTagName('iframe')[0].style.height = height + "px";
	                framediv.getElementsByTagName('iframe')[0].style.width = (sqh_config.mode == _consts.EMBED_MODE || sqh_config.mode == _consts.DEMO_EMBED_MODE) && !resizeEmbedToContent ? '100%' : width + "px";

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
	                framediv.getElementsByTagName('iframe')[0].style.height = sqh_config.mode == _consts.EMBED_MODE || sqh_config.mode == _consts.DEMO_EMBED_MODE ? '100%' : height + "px";
	                framediv.getElementsByTagName('iframe')[0].style.width = sqh_config.mode == _consts.EMBED_MODE || sqh_config.mode == _consts.DEMO_EMBED_MODE ? '100%' : width + "px";
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.getTenantHost = getTenantHost;
	exports.getFrameUrl = getFrameUrl;

	var _consts = __webpack_require__(4);

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
/* 9 */
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

	var _rpc = __webpack_require__(7);

	var rpc = _interopRequireWildcard(_rpc);

	var _consts = __webpack_require__(4);

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

	    /** ***** Load CSS ****** */
	    var css_link = $("<link>", {
	        rel: "stylesheet",
	        type: "text/css",
	        href: hostSrc + _consts.JQUERY_REVEAL_CSS_PATH
	    });
	    css_link.appendTo('head');

	    $.getScript(hostSrc + _consts.JQUERY_REVEAL_PATH, function () {
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
	    }).fail(_onScriptFailure2.default);
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
	    modalWrapper.dispatchEvent(new window.Event('squatch:open'));
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
	    modalWrapper.dispatchEvent(new window.Event('squatch:close'));
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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.create = create;

	var _log2 = __webpack_require__(3);

	var _log3 = _interopRequireDefault(_log2);

	var _widgetUrls = __webpack_require__(8);

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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.create = undefined;

	var _log2 = __webpack_require__(3);

	var _log3 = _interopRequireDefault(_log2);

	var _consts = __webpack_require__(4);

	var _rpc = __webpack_require__(7);

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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.create = create;

	var _log2 = __webpack_require__(3);

	var _log3 = _interopRequireDefault(_log2);

	var _widgetUrls = __webpack_require__(8);

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