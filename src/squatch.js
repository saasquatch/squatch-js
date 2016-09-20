/**
 * Squatch.js is the Referral SaaSquatch javascript SDK and a one-stop shop to integrate a referral program into your website or web app.
 * It can show referral widgets on any website, track users, generate unique referral short links and referral codes, and more.
 *
 * @module squatch
 */
import { OpenApi } from './api/OpenApi';
import cookie from './tracking/Cookie';
import { each } from './utils/each';
import { domready } from './utils/domready';
import elementResizeDetectorMaker from 'element-resize-detector';

export { OpenApi } from './api/OpenApi';
export { default as cookie } from './tracking/Cookie';

/**
 * Initializes a static `squatch` global. This sets up:
 *
 *  - `api` a static instance of the {@link OpenApi}
 *
 * @param {Object} config Configuration details
 * @param {string} config.tenantAlias The tenant alias connects to your account. Note: There are both *live* and *test* tenant aliases.
 * @returns {void}
 * @example
 * squatch.init({tenantAlias:'test_basbtabstq51v'});
 */
export function init(config) {
  api = new OpenApi({
    tenantAlias: config.tenantAlias
  });

  // TODO:
  // 1. Check if config.user was provided
  // 2. If it is, Upsert user. Else, check store to see if user info is available
  // 3. If no user info is available, create new cookie user

  api.createCookieUser().then(function(response) {
    let user = response;

    let embed = document.getElementById('squatchembed');
    let frame = document.createElement('iframe');

    let erd = elementResizeDetectorMaker({ strategy: "scroll" });

    frame.width = '100%';
    frame.id = 'widget';
    frame.style = 'border: 0;';
    document.getElementById('squatchembed').appendChild(frame);
    frame.contentWindow.document.open();
    frame.contentWindow.document.write(user);
    frame.contentWindow.document.close();

    domready(frame.contentWindow.document, function() {
      frame.height = frame.contentWindow.document.body.scrollHeight + 'px';

      // Adjust frame height when size of body changes
      erd.listenTo(frame.contentWindow.document.body, function(element) {
        let height = element.offsetHeight;
        frame.height = height;
      })
    })

  }).catch(function(ex) {
    console.log(ex);
  });

}

/**
 * Static instance of the {@link OpenApi}. Make sure you call {@link #init init} first
 *
 * @type {OpenApi}
 * @example
 * squatch.init({tenantAlias:'test_basbtabstq51v'});
 * squatch.api.createUser({id:'123', accountId:'abc', firstName:'Tom'});
 */
export let api = null;


export function autofill() {
  let opts = {};
  return cookie('name', 'value', opts);
}

export function ready(fn) {
  fn();
}


if (window) onLoad();

function onLoad() {
  var loaded = window['squatch'] || null,
    cached = window['_squatch'] || null;

  if (loaded && cached) {
    var _ready = cached.ready;

    loaded["init"] = init;
    loaded["ready"] = ready;
    loaded["autofill"] = autofill;

    each(_ready, function(cb, i){
      cb();
    });

    window["_" + 'squatch'] = undefined;
    try {
      delete window['_' + 'squatch']
    } catch(e) {}
  }
}
