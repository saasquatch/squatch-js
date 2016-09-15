/**
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

import awaitScriptLoad from './util/awaitScriptLoad';
import polyfillJquery from './util/polyfillJquery';
import onScriptFailure from './util/onScriptFailure';

import * as consts from './consts';

import * as rpc from './widgets/rpc';

import * as popupWidget from './widgets/popupWidget';
import * as cookieCodeWidget from './widgets/cookieCodeWidget';
import * as embeddedWidget from './widgets/embeddedWidget';
import * as noContentWidget from './widgets/noContentWidget';

// Widget Configs
const DEFAULT_MODE = consts.POPUP_MODE;

// set via loadJQueryAndBegin (identifies the host we're loading under)
let hostSrc = null;

/**
 * State variables
 */
let initCalled = false;

let hasAccountId = false;
let data = null;
let $ = null;

/**
 * Logging to help with debugging
 */
const debug = false;

const _log = function() {
    debug && window.console && console.log.apply(console, arguments);
};

if (!(window.console && console.log)) {
    console = {
        log() {},
        debug() {},
        info() {},
        warn() {},
        error() {}
    };
}


/**
 * Synchronously calls methods from the async API
 * 
 * @param fnToDo -
 *            an associative array such as ['init', sqhConfig]
 */
function execute(fnToDo) {
    let method;

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
            console.error("Unknown method call `" + method +
                "`. Valid options are [init,autofill,getReward,getRewardBalance]");
            break;
    }
}

/**
 * Called when the library is loaded. The library will not be fully ready
 * until 'init' is called with appropriate configuration variables
 * 
 * @param .j -
 *            a version of jQuery compatible with the jQuery.reveal plugin
 */
function main($j) {
    $j(document).ready(
        function($jQuery) {
            $ = $jQuery;

            // first look for any subscriptions prior to init (these should be added first so there's no potential to miss subscribed events immediately after init)
            for (let i = 0; i < window._sqh.length; i++) {
                let current = window._sqh[i];
                if (current[0] == consts.JS_API_SUBSCRIBE_CALL) {
                    execute(current);
                    window._sqh.splice(i, 1);
                }
            }

            // now initialize the widget frame
            let initIdx = -1;
            for (let i = 0; i < window._sqh.length; i++) {
                let current = window._sqh[i];
                if (current[0] == consts.JS_API_INIT_CALL) {
                    execute(current);
                    // Removes from the queue
                    initIdx = i;
                    break;
                }
            }
            if (initIdx > -1) {
                window._sqh.splice(initIdx, 1);
            }
            else {
                console.error('Could not find "init" in the _sqh queue when squatch.js was loaded.');
            }
        });
}

/**
 * Called when the Squatch library is fully set up.
 * 
 */
function onReady(hasInitError, theData) {
    // do no further processing on error
    if (typeof hasInitError !== 'undefined' && hasInitError) {
        return;
    }
    
    // The data returned by the RPC
    data = theData;
    
    // Empties the enqueued methods in _sqh
    let next = window._sqh.shift();
    while (next) {
        execute(next);
        next = window._sqh.shift();
    }

    // Overrides _sqh array's push method so that it will directly call
    // `execute`
    window._sqh.push = function() {
        for (let i = 0; i < arguments.length; i++) {
            execute(arguments[i]);
        }
        // TODO: Don't actually push to underlying array otherwise it will
        // keep growing infinitely
        return Array.prototype.push.apply(this, arguments);
    };
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
        _log('Should not call init more than once');
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

    let embeddedToEmbed;

    if (typeof sqh_config.account_id === 'undefined') {
        // load the code from the cookie code filler
        embeddedToEmbed = cookieCodeWidget;
    } else {
        hasAccountId = true;

        // load the popup widget / code
        if ((!sqh_config.user_id) || (!sqh_config.first_name)) {
            console.error('The user_id, email, first_name must be set');
            return;
        }

        if (!sqh_config.last_name) {
            _log("No last name set. Defaulting to empty");
            sqh_config.last_name = "";
        }

        if (typeof sqh_config.email === 'undefined') {
            sqh_config.email = consts.IGNORE_OPTIONAL_WIDGET_PARAM;
        }

        if (typeof sqh_config.payment_provider_id === 'undefined') {
            sqh_config.payment_provider_id = consts.IGNORE_OPTIONAL_WIDGET_PARAM;
        }
        else if (sqh_config.payment_provider_id === null) {
            _log("Payment provider id provided, but is null. Default to special value");
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
        }
        else if (!sqh_config.user_image) {
            _log("No user profile image set. Defaulting to gravatar");
            sqh_config.user_image = "";
        }

        if (typeof sqh_config.fb_share_image === 'undefined') {
            sqh_config.fb_share_image = consts.IGNORE_OPTIONAL_WIDGET_PARAM;
        }
        else if (!sqh_config.fb_share_image) {
            _log("No fb share image set. Defaulting to no image");
            sqh_config.fb_share_image = "";
        }

        if (typeof sqh_config.account_status === 'undefined') {
            sqh_config.account_status = consts.IGNORE_OPTIONAL_WIDGET_PARAM;
        }
        else if (!sqh_config.account_status) {
            _log("No account_status set. Defaulting to no account_status");
            sqh_config.account_status = "";
        }

        if (typeof sqh_config.referral_code === 'undefined') {
            sqh_config.referral_code = consts.IGNORE_OPTIONAL_WIDGET_PARAM;
        }
        else if (!sqh_config.referral_code) {
            _log("No referral_code set. Defaulting to no referral_code");
            sqh_config.referral_code = "";
        }

        if (typeof sqh_config.user_referral_code === 'undefined') {
            sqh_config.user_referral_code = consts.IGNORE_OPTIONAL_WIDGET_PARAM;
        }
        else if (!sqh_config.user_referral_code) {
            _log("No user_referral_code set. Defaulting to no user_referral_code");
            sqh_config.user_referral_code = "";
        }

        if (typeof sqh_config.locale === 'undefined') {
            sqh_config.locale = consts.IGNORE_OPTIONAL_WIDGET_PARAM;
        }
        else if (!sqh_config.locale) {
            _log("No locale set. Defaulting to no locale");
            sqh_config.locale = "";
        }

        sqh_config.mode = (sqh_config.mode || sqh_config.mode === 0) ? sqh_config.mode : DEFAULT_MODE;

        switch (sqh_config.mode) {
            case consts.NO_CONTENT_MODE:
                embeddedToEmbed = noContentWidget;
                break;
            case consts.EMBED_MODE:
                embeddedToEmbed = embeddedWidget;
                break;
            case consts.POPUP_MODE:
                embeddedToEmbed = popupWidget;
                break;
            case consts.DEMO_MODE:
                embeddedToEmbed = popupWidget;
                break;
            case consts.DEMO_EMBED_MODE:
                embeddedToEmbed = embeddedWidget;
                break;
            default:
                console.error(`Unsupported mode: '${sqh_config.mode}'. Please initialize with one of the following modes: 'NOCONTENT', 'EMBED', or 'POPUP'`);
        }

    }

    if (embeddedToEmbed) {
        
        if(embeddedToEmbed === embeddedWidget && $('#squatchembed').length <= 0){
            // Embedded widget was requested, but not embed div found.
            // Falling back to No Content Mode
            sqh_config.mode = consts.NO_CONTENT_MODE;
            embeddedToEmbed = noContentWidget;
        }
        
        $.ajaxSetup({
            cache: true
        });

        $.getScript(hostSrc + "/assets/javascripts/easyXDM.min.js",
            function() {
                _log("easyXDM loaded");

                embeddedToEmbed.create(sqh_config, $, hostSrc, onReady);

            }).fail(onScriptFailure);
    }

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
        }
        else {
            // No in progress referral
        }
    }
    else if (typeof args == 'function') {
        args(data.code);
    }
    else {
        console.error('The "autofill" method should be called with either a jQuery selector or a callback. Unknown type ' + (typeof args));
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
        }
        else {
            console.error('Unsupported reward lookup widget push, you need to push with an account Id to use this feature');
        }
    }
    else {
        console.error('Unsupported widget reward lookup push, invalid params.');
    }
}

function getLegacyAggregateRewardLookup() {
    let discountReward = {};
    if (data.rewardBalance) {
        for (let i = 0; i < data.rewardBalance.length; i++) {
            if (data.rewardBalance[i].type == 'PCT_DISCOUNT') {
                discountReward = data.rewardBalance[i];
            }
        }
    }
    else {
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
    }
    else {
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
    const rewards = [];
    if (data.rewardBalance) {
        for (let i = 0; i < data.rewardBalance.length; i++) {
            if (data.rewardBalance[i].type == type) {
                rewards.push(data.rewardBalance[i]);
            }
        }
    }
    else {
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
            }
            else {
                console.error('Unsupported widget reward type lookup push, invalid params.');
            }
        }
        else {
            if (typeof type == 'function') {
                type(data.rewardBalance);
            }
            else {
                console.error('Unsupported widget reward lookup push, invalid params.');
            }
        }
    }
    else {
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
            const featureRewardBalances = getRewardBalanceForType('FEATURE');
            const rewards = [];
            for (let i = 0; i < featureRewardBalances.length; i++) {
                if (featureRewardBalances[i].featureType == featureType) {
                    rewards.push(featureRewardBalances[i]);
                }
            }
            fn(rewards);
        }
        else {
            console.error('Unsupported widget reward type lookup push, invalid params.');
        }
    }
    else {
        console.error('Unsupported reward lookup widget push, you need to push with an account Id to use this feature');
    }
}


function onLoad() {
    // TODO: LV: This could probably be done so that we don't rely on `_sqh` being present at page load
    if ((typeof _sqh === 'undefined')) {
        console.error("_sqh must be defined and initialized to use this widget.\n" +
            "To initialize the popup widget call: _sqh.push(['init', {tenant_alias: '$yourTenantAlias', account_id: '$viewingCustomerAccountId', " +
            "email: '$viewingCustomerEmail', user_id : '$viewingUserId', first_name: '$viewingCustomerFirstName', last_name: '$viewingCustomerLastName'" +
            "]}]);");
    } else {
        awaitScriptLoad(10, (srcUrl) => {

            if (!srcUrl) {
                console.error("Could not find properly formatted squatch.js DOM scripts");
                return;
            }
            hostSrc = srcUrl;
            polyfillJquery(srcUrl + '/assets/javascripts/jquery-1.9.0.min.js', (jq) => {
                // Entry point to all the magic.
                main(jq);
            });
        });
    }
}


// Kicks off everything
onLoad();
const version = "v1.0.0";

export default version;