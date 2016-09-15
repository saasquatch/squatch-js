/**
 * Called when one of our required dependencies fails to load (such as
 * jQuery, easyXDM, ...)
 */
export default function onScriptFailure() {
    if (arguments[0].readyState == 0) {
        // script failed to load
        console.error('Failed to load script');
    }else {
        // script loaded but failed to parse
        console.error('Failed to parse script: ' + arguments[2].toString());
    }
}