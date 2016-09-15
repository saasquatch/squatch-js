import _log from '../_log';
import onScriptFailure from '../util/onScriptFailure';
import * as rpc from './rpc';

import {
    DEFAULT_AUTO_OPEN,
    JQUERY_REVEAL_PATH,
    JQUERY_REVEAL_CSS_PATH
}
from '../consts';

/**
 * Beware: These variables are stateful
 */
let modalWrapper = null;

/**
 * Called to load popup widget
 * 
 */
export function create(sqh_config, $, hostSrc, callback) {

    _log("loading popup widget");

    /** ***** Load CSS ****** */
    const css_link = $("<link>", {
        rel: "stylesheet",
        type: "text/css",
        href: hostSrc + JQUERY_REVEAL_CSS_PATH
    });
    css_link.appendTo('head');

    $.getScript(
        hostSrc + JQUERY_REVEAL_PATH,
        function() {
            _log("reveal loaded");

            // setup the popup container for reveal
            const framediv = document.createElement('div');
            framediv.setAttribute('id', 'squatchModal');
            framediv.setAttribute('class', 'reveal-modal');

            $('<div></div>').attr('id', 'squatchModalWrapper').append(framediv).appendTo('body');

            modalWrapper = $('#squatchModalWrapper');

            const rpcOpts = {
                framediv,
                callback,
                closeFnc: function() {
                    $('#squatchModalWrapper').trigger('squatch:close');
                },
                pageType: "modalPopup"
            };
            const irpc = rpc.setup(sqh_config, rpcOpts);

            // handle the popup closing (via clicking close or outside
            // of the frame)
            $('#squatchModalWrapper').on('reveal:close',
                '#squatchModal',
                function() {
                    irpc.closedWidget();
                });

            // reveal the iframe popup
            $('body').on('click', '.squatchpop', function(e) {
                e.preventDefault();
                // prevent race condition of page not being ready yet
                $('#squatchModalWrapper').trigger('squatch:open');
            });

            // listen for events to close the modal widget
            modalWrapper.on('squatch:close', (e) => {
                $('#squatchModal').trigger('reveal:close');
            });

            // listen for events to open the modal widget
            modalWrapper.on('squatch:open', (e) => {
                irpc.openedWidget(sqh_config.mode, sqh_config.user_id, sqh_config.account_id);
                $('#squatchModal').reveal();
            });

            checkForAutoOpen(sqh_config, $);

        }).fail(onScriptFailure);
}

/**
 * Open the squatch popup widget if it has been loaded
 */
export function open() {
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
export function close() {
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
    let hasAutoPopped = false;
    const autoShowPopupParam = (!sqh_config.auto_open_param) ? DEFAULT_AUTO_OPEN :
        sqh_config.auto_open_param;

    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        if (vars[i] === autoShowPopupParam) {
            const autoOpenInterval = setInterval(function() {
                $(document).ready(function() {
                    open(); // Opens the popup
                    hasAutoPopped = true;
                });
                if (hasAutoPopped) {
                    clearInterval(autoOpenInterval);
                }
            }, 1000);
        }
    }
}