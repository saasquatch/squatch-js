import debug from "debug";
import Cookies from "js-cookie";
//@ts-ignore
import URLSearchParams from "@ungap/url-search-params";

/** @hidden */
const _log = debug("squatch-js");

const isObject = (item: any) => typeof item === "object" && !Array.isArray(item);

const deepMerge = <A = Object, B = Object>(target: Object, source: Object): A & B => {
  const isDeep = (prop: string) => isObject(source[prop]) && target.hasOwnProperty(prop) && isObject(target[prop]);
  const replaced = Object.getOwnPropertyNames(source)
    .map((prop) => ({ [prop]: isDeep(prop) ? deepMerge(target[prop], source[prop]) : source[prop] }))
    .reduce((a, b) => ({ ...a, ...b }), {});

  return {
    ...(target as Object),
    ...(replaced as Object),
  } as A & B;
};

function b64decode(input) {
  return atob(input.replace(/_/g, "/").replace(/-/g, "+"));
}

function b64encode(input) {
  return btoa(input).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

// https://stackoverflow.com/a/11319865
function getTopDomain() {
  var i,
    h,
    weird_cookie = "weird_get_top_level_domain=cookie",
    hostname = document.location.hostname.split(".");
  for (i = hostname.length - 1; i >= 0; i--) {
    h = hostname.slice(i).join(".");
    document.cookie = weird_cookie + ";domain=." + h + ";";
    if (document.cookie.indexOf(weird_cookie) > -1) {
      // We were able to store a cookie! This must be it
      document.cookie = weird_cookie.split("=")[0] + "=;domain=." + h + ";expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      return h;
    }
  }
}

export function _pushCookie() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const refParam = urlParams.get("_saasquatch") || "";

  // do nothing if no params
  if (refParam) {
    let paramsJSON = "",
      existingCookie = "",
      reEncodedCookie = "";

    try {
      paramsJSON = JSON.parse(b64decode(refParam));
    } catch (error) {
      _log("Unable to decode params", error);
    }

    try {
      const existingCookie = JSON.parse(b64decode(Cookies.get("_saasquatch")));
      _log("existing cookie", existingCookie);
    } catch (error) {
      _log("Unable to retrieve cookie", error);
    }

    // don't merge if there's no existing object
    try {
      const domain = getTopDomain();
      _log("domain retrieved:", domain);
      if (existingCookie) {
        const newCookie = deepMerge(existingCookie, paramsJSON);
        reEncodedCookie = b64encode(JSON.stringify(newCookie));
        _log("cookie to store:", newCookie);
      } else {
        reEncodedCookie = b64encode(JSON.stringify(paramsJSON));
        _log("cookie to store:", paramsJSON);
      }
      Cookies.set("_saasquatch", reEncodedCookie, {
        expires: 365,
        secure: document.location.protocol === "https:" ? true : false,
        sameSite: "lax",
        domain,
        path: "/",
      });
    } catch (error) {
      _log("Unable to set cookie", error);
    }
  }
}
