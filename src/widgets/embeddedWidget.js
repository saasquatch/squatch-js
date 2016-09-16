import _log from '../_log';
import {NO_CONTENT_MODE} from '../consts';
import * as rpc from './rpc';

/**
 * Called to load embed widget
 * @private
 */
export function create(sqh_config, $, hostSrc, callback) {

    _log("loading embed widget");
    // LV: This div layout is nuts, but it is unchanged for legacy support. Our outer HTML structure is kind of like a standard interface.
    const framediv = document.createElement('div');
    $('<div></div>')
        .hide()
        .attr('id', 'squatchEmbedWrapper')
        .append(framediv)
        .insertAfter($("#squatchembed"));

    const rpcOpts = {
        framediv, 
        callback:function(hasInitError, data) {
            // don't show response immediately so there's time for the page to be
            // resized appropriately
            setTimeout(function() {
                $("#squatchembed").hide();
                $("#squatchEmbedWrapper").show();
                callback(hasInitError, data);
            }, 500);
        },
        closeFnc:function() {},
        pageType: "embeddedWidget"
    };

    const irpc = rpc.setup(sqh_config, rpcOpts);

    // record as a widget open if the the widget was successfully
    // embeded
    // if the div was not embedded (i.e. squatchEmbedWrapper not set)
    // then this will be ignored
    irpc.openedWidget(sqh_config.mode, sqh_config.user_id, sqh_config.account_id);
    return irpc;
    
}