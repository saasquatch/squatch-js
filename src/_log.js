/**
 * Logging to help with debugging
 */
const debug = false;

export default function _log() {
    debug && window.console && console.log.apply(console, arguments);
};

if (!(window.console && console.log)) {
    console = {
        log() {},
        debug() {},
        info() {},
        warn() {},
        error() {}
    };
}