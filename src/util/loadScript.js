/**
 * Loads a Script by appending it to the <head>
 */
export default function loadScript(scriptUrl, scriptLoadHandler){
    const script_tag = document.createElement('script');
    script_tag.setAttribute('type', 'text/javascript');
    script_tag.setAttribute('src', scriptUrl);
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