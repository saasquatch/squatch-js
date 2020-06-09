import * as superagent from "superagent";
import { JWT } from "../types";
import Cookies from "js-cookie";

export function doGet(url, jwt = "") {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Cookie": "_saasquatch=" + Cookies.get('_saasquatch')
  };

  if (jwt) headers["X-SaaSquatch-User-Token"] = jwt;

  const request = superagent.get(url).withCredentials().set(headers);

  return thenableSuperagent(request).then(
    (response) => {
      if (
        //@ts-ignore -- superagent types might just be outdated?
        response.headers["content-type"] &&
        //@ts-ignore -- superagent types might just be outdated?
        includes(
          response.headers["content-type"].toLowerCase(),
          "application/json"
        )
      ) {
        return JSON.parse(response.text);
      }
      return response.text;
    },
    ({ response }) => {
      const json = JSON.parse(response.text);
      throw json;
    }
  );
}
/**
 * @hidden
 *
 * @param url The requested url
 * @param data Stringified json object
 *
 * @returns {Promise} superagent promise
 */
export function doPost(url: string, data: any, jwt?: JWT) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (jwt) headers["X-SaaSquatch-User-Token"] = jwt;

  const request = superagent.post(url).send(data).set(headers);

  return thenableSuperagent(request).then(
    ({ text }) => (text ? JSON.parse(text) : text),
    (error) => {
      let json;

      try {
        json = JSON.parse(error.response.text);
      } catch (e) {
        const out = error || e;
        throw out;
      }
      throw json;
    }
  );
}

export function doPut(url: string, data: any, jwt?: JWT) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-SaaSquatch-Referrer": window ? window.location.href : "",
  };

  if (jwt) headers["X-SaaSquatch-User-Token"] = jwt;

  const request = superagent.put(url).withCredentials().send(data).set(headers);

  return thenableSuperagent(request).then(
    ({ text }) => (text ? JSON.parse(text) : text),
    (error) => {
      let json;

      try {
        json = JSON.parse(error.response.text);
      } catch (e) {
        const out = error || e;
        throw out;
      }
      throw json;
    }
  );
}

/**
 * Avoids using superagent's built in `then` method because that relies on a global promise object being valid.
 *
 * Instead, thanks to babel the promise used in this function should be our custom sandboxed polyfill
 */
function thenableSuperagent(request: superagent.Request): Promise<any> {
  return new Promise((innerResolve, innerReject) => {
    request.on("error", innerReject);
    request.end((err, res) => {
      if (err) innerReject(err);
      else innerResolve(res);
    });
  });
}
function includes(string: string, search: string, start?: number) {
  "use strict";
  if (typeof start !== "number") {
    start = 0;
  }

  if (start + search.length > string.length) {
    return false;
  } else {
    return string.indexOf(search, start) !== -1;
  }
}
