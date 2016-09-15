
/**
 * Load JQuery if it's not already loaded, or if it's version is insufficient for our purposes
 * 
 * @param {string} hostSrc The domain including protocol host of jQuery
 * @param {Function} callback Async callback that will get either `window.jQuery`, or our own loaded version.
 */
export default function polyfillJquery(jQueryUrl, callback) {

    /** ****** Called once jQuery has loaded ***** */
    const scriptLoadHandler = function() {
        // Restore $ and window.jQuery to their previous values and store
        // the
        // new jQuery in our local jQuery variable
        let squatchQuery = window.jQuery.noConflict(true);
        // Call our main function
        callback(squatchQuery);
    };

    /** ****** Load jQuery if not present ******** */
    const re = new RegExp('[1]\.[7-9](\.[0-9])?');
    if (window.jQuery === undefined || !re.test(window.jQuery.fn.jquery)) {
        const script_tag = document.createElement('script');
        script_tag.setAttribute('type', 'text/javascript');
        script_tag.setAttribute('src', jQueryUrl);
        if (script_tag.readyState) {
            script_tag.onreadystatechange = function() { // For old
                // versions of
                // IE
                if (this.readyState == 'complete' ||
                    this.readyState == 'loaded') {
                    scriptLoadHandler();
                }
            };
        }
        else {
            script_tag.onload = scriptLoadHandler;
        }
        // Try to find the head, otherwise default to the documentElement
        (document.getElementsByTagName('head')[0] || document.documentElement).appendChild(script_tag);
    }
    else {
        // The jQuery version on the window is the one we want to use
        callback(window.jQuery);
    }

}
