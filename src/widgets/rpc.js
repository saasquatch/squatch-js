import _log from '../_log';
import {EMBED_MODE, DEMO_EMBED_MODE} from '../consts';

import {getFrameUrl} from './widgetUrls';

/**
 * Warning: `subscriptions` is stateful. It will accumulate event listeners.
 * 
 * TODO: Look at using native DOM event listener pattern instead of this object thing.
 */
const subscriptions = {};

/**
 * Setup the iframe/RPC. The ready function will be called when frame is
 * loaded, close function when the close button is pressed, and the pageType
 * will mark the page as a class (ie to differentiate embed/popup views)
 */
export function setup(sqh_config, opts) {
    
    let {framediv, callback, closeFnc, pageType} = opts; // destructuring: it's awesome, google it ;)
    
    const remote = getFrameUrl(sqh_config, pageType);
    let resizeEmbedToContent = true;

    function resizeIframe(width, height){
        let iframe = framediv.getElementsByTagName('iframe')[0];
        iframe.style.height = height + "px";
        iframe.style.width = ((sqh_config.mode == EMBED_MODE || sqh_config.mode == DEMO_EMBED_MODE) && !resizeEmbedToContent) ? '100%' : width + "px";
    }

    // handle incoming messages from the iframe popup
    const rpc = new window.easyXDM.Rpc({
        remote,
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
            init(height, width, codeIn, rewardBalanceIn, resizeEmbedToContentIn) {
                _log("got init message");
                // true if embed mode should resize to the content of the frame - otherwise have the iframe expand to the entire area of its wrapper
                resizeEmbedToContent = resizeEmbedToContentIn;
                resizeIframe(width, height);
                // Caches our stateful data for faster use later
                let data = {
                    code: codeIn,
                    rewardBalance: rewardBalanceIn
                };
                callback(false, data);
            },
            resize(height, width) {
                _log("got resize message");
                resizeIframe(width, height);
                window.dispatchEvent(new window.Event('resize.modal')); // Triggers modal resize. Previously used JQuery -- $(window).trigger('resize.modal');
            },
            publish(eventName, payload) {
                _log("got publish message");
                if (subscriptions[eventName]) {
                    // publish the event of type eventName to all available subscribers
                    for (let i = 0; i < subscriptions[eventName].length; i++) {
                        subscriptions[eventName][i](payload);
                    }
                }
            },
            close() {
                _log("got close message");
                closeFnc();
            },
            error(errorMessage, height, width) {
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
export function subscribe(eventName, fn) {
    if (!subscriptions[eventName]) {
        subscriptions[eventName] = [];
    }
    subscriptions[eventName].push(fn); // push the provided callback to be called when the widget publishes 'eventName'
}
