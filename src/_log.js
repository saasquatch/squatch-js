/*
 * Logging to help with debugging
 */
export let debug = false;

/**
 * Logs to console when debug is enabled.
 * 
 * @private
 */
export default function _log() {
    debug && window.console && console.log.apply(console, arguments);
}

if (!(window.console && console.log)) {
    console = {
        log() {},
        debug() {},
        info() {},
        warn() {},
        error() {}
    };
}