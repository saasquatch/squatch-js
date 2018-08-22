//@ts-check
import superagent from "superagent";

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
      error => {
        const json = JSON.parse(error.response.text);
        return Promise.reject(json);
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
    .then(response => response.text);
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
      response => JSON.parse(response.text),
      error => {
        let json;

        try {
          json = JSON.parse(error.response.text);
        } catch (e) {
          return Promise.reject(error || e);
        }

        return Promise.reject(json);
      }
    );
}
