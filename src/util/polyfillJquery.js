import loadScript from './loadScript';

const JQUERY_VERSIONS = new RegExp('[1]\.[7-9](\.[0-9])?');

/**
 * Load JQuery if it's not already loaded, or if it's version is insufficient for our purposes
 * 
 * @param {string} hostSrc The domain including protocol host of jQuery
 * @param {Function} callback Async callback that will get either `window.jQuery`, or our own loaded version.
 * @returns {void}
 * 
 * @private
 */
export default function polyfillJquery(jQueryUrl, callback, re=JQUERY_VERSIONS) {

    // Load jQuery if not present, or a sufficient version is not found
    if (window.jQuery === undefined || !re.test(window.jQuery.fn.jquery)) {
        loadScript(jQueryUrl, () => {
            // Restore $ and window.jQuery to their previous values and store
            // the new jQuery in our local jQuery variable
            let newJQuery = window.jQuery.noConflict(true);

            callback(newJQuery);
        });
    } else {
        // The jQuery version on the window is the one we want to use
        callback(window.jQuery);
    }

}
