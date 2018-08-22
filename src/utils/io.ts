//@ts-check
import superagent from "superagent";
import * as PPromise from "./Promise"

export function doRequest(url, jwt = "") {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json"
  };

  if (jwt) headers["X-SaaSquatch-User-Token"] = jwt;

  return superagent
    .get(url)
    .withCredentials()
    .set(headers)
    .then(
      response => {
        if (
          //@ts-ignore -- superagent types might just be outdated?
          response.headers["content-type"] &&
          //@ts-ignore -- superagent types might just be outdated?
          response.headers["content-type"]
            .toLowerCase()
            .includes("application/json")
        ) {
          return JSON.parse(response.text);
        }
        return response.text;
      },
      ({response}) => {
        const json = JSON.parse(response.text);
        throw json;
      }
    );
}
/**
 * @private
 *
 * @param {string} url The requested url
 * @param {string} data Stringified json object
 *
 * @returns {Promise} superagent promise
 */
export function doPost(url, data) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json"
  };

  return superagent
    .post(url)
    .send(data)
    .set(headers)
    .then(({text}) => text);
}

export function doPut(url, data, jwt) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-SaaSquatch-Referrer": window ? window.location.href : ""
  };

  if (jwt) headers["X-SaaSquatch-User-Token"] = jwt;

  return superagent
    .put(url)
    .withCredentials()
    .send(data)
    .set(headers)
    .then(
      ({text}) => JSON.parse(text),
      error => {
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
