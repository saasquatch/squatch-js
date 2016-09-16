import _log from '../_log';
import {getTenantHost} from './widgetUrls';

/**
 * Called to load widget that grabs fillable code from cookie
 * 
 * @private
 */
export function create(sqh_config, $, hostSrc, callback)  {

    _log("loading cookie code widget");

    const frameUrl = getTenantHost(sqh_config) + 'widgets/squatchcookie';

    // handle incoming messages from the iframe popup
    const rpc = new window.easyXDM.Rpc({
        remote: frameUrl
    }, {
        local: {
            init(codeIn) {
                _log("got init message");

                // Caches our stateful data for faster use later
                let data = {
                    code: codeIn
                };
                callback(false, data);
            }
        }
    });
    
    return rpc;
}

