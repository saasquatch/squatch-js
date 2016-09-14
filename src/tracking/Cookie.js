const encode = encodeURIComponent;
const decode = decodeURIComponent;

/**
 * Gets a cookie or sets a cookie depending on what arguments you use.
 *
 * @param {string} name the name of the cookie
 * @param {string} [value] sets the value of the cookie
 * @param {Object} [options] options on the value of the cookie
 * @param {string} [options.path] the cookie path
 * @param {string} [options.domain] the cookie domain
 * @param {Date}   [options.expires] the cookie expiry
 * @param {boolean} [options.secure=false] if the cookie is secure
 *
 * @returns {Object} The cookie value
 *
 * @example <caption>Set a cookie</caption>
 * cookie('myCookie', 12, {domain:'google.com'});
 *
 * @example <caption>Get a cookie</caption>
 * var cookieValue = cookie('myCookie');
 *
 */
export default function cookie(name, value, options) {
  if (arguments.length < 2) return get(name);
  set(name, value, options);
}

function set(name, value, options = {}) {
  let str = `${encode(name)}=${encode(value)}`;

  if (value == null) options.maxage = -1;

  if (options.maxage) {
    options.expires = new Date(+new Date() + options.maxage);
  }

  if (options.path) str += '; path=' + options.path;
  if (options.domain) str += '; domain=' + options.domain;
  if (options.expires) str += '; expires=' + options.expires.toUTCString();
  if (options.secure) str += '; secure';

  document.cookie = str;
}

function get(name) {
  let cookies = parse(document.cookie);
  return name ? cookies[name] : cookies;
}

function parse(cookie) {
  let result = {},
    pairs = cookie.split(/ *; */);

  if (pairs.length <= 1) return result;

  for (let pair of pairs) {
    pair = pair.split('=');
    result[decode(pair[0])] = decode(pair[1]);
  }

  return result;
}
