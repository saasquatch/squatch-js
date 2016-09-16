import _log from '../_log';

/**
 * Waits for the DOM script element to load, so we can parse the Source URL and get the CDN/Host URL
 * 
 * Then in other functions that CDN domain be used to load other scripts
 * 
 * e.g.
 *      SRC Url: https://d2rcp9ak152ke1.cloudfront.net/assets/javascripts/squatch.min.js
 *      Returns to callback: https://d2rcp9ak152ke1.cloudfront.net
 * 
 * @private
 */
export default function getScriptPath(scriptRegex, callback, iteration = 10) {

    // Seems like overkill? It's not.
    // It seems like this other approach might work, but it doesn't when the script is loaded asynchronously: http://stackoverflow.com/questions/2976651/javascript-how-do-i-get-the-url-of-script-being-called

    //  Try to find the src this script was loaded under and if it can't be found
    //  iteratively wait and try again for the provided iteration count

    const scripts = document.getElementsByTagName('script');
    let len = scripts.length;

    let embedSrc = null;

    while (len--) {
        let src = scripts[len].src;
        if (src && src.match(scriptRegex)) {
            embedSrc = src;
            break;
        }
    }

    if (embedSrc || iteration <= 0) {
        let hostSrc = null;
        if(embedSrc){
            // Extract the host part of the Squatch.js url
            _log(hostSrc);
            hostSrc = embedSrc.substr(0, embedSrc.lastIndexOf( '/' )+1 );
            // embedSrc.match(new RegExp('https?://[^/]*'))[0];
        }
        callback(hostSrc);
    }
    else {
        _log("squatch js not finished loading try again.");

        setTimeout(function() {
            getScriptPath(scriptRegex, callback, --iteration);
        }, 50);
    }
}