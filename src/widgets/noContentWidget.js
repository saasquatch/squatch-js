import _log from '../_log';
import {getFrameUrl} from './widgetUrls';

/**
 * Creates a No Content widget
 * @private
 */
export function create(sqh_config, $, hostSrc, callback)  {

    const frameUrl = getFrameUrl(sqh_config, "");

    // setup the popup container for reveal
    const nocontentdiv = document.createElement('div');

    $('<div></div>').hide().append(nocontentdiv).appendTo('body');

    // handle incoming messages from the iframe popup
    const rpc = new window.easyXDM.Rpc({
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
            init(codeIn, rewardIn) {
                _log("got init message");

                // Caches our stateful data for faster use later
                let data = {
                    code: codeIn,
                    reward: rewardIn
                };
                callback(false, data);
            },
            error(errorMessage) {
                console.error(errorMessage);
            }
        }
    });
    
    return rpc;
}
