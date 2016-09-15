import _log from '../_log';
import {SQUATCHJS_SCRIPT_NAME_REGEX} from '../consts';

/**
 * Waits for the DOM script element to load, so we can parse the Source URL and get the CDN/Host URL
 * 
 * Then in other functions that CDN domain be used to load other scripts
 * 
 * e.g.
 *      SRC Url: https://d2rcp9ak152ke1.cloudfront.net/assets/javascripts/squatch.min.js
 *      Returns to callback: https://d2rcp9ak152ke1.cloudfront.net
 */
export default function awaitScriptLoad(iteration, callback) {

    // TODO: LV: Is this just overkill? Seems like this other approach might work: http://stackoverflow.com/questions/2976651/javascript-how-do-i-get-the-url-of-script-being-called

    var scriptEls = document.getElementsByTagName( 'script' );
    var thisScriptEl = scriptEls[scriptEls.length - 1];
    var scriptPath = thisScriptEl.src;
    var scriptFolder = scriptPath.substr(0, scriptPath.lastIndexOf( '/' )+1 );
    
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