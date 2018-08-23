import * as superagent from "superagent";
import { JWT } from "..";

export function doGet(url, jwt = "") {
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
    "Content-Type": "application/json"
  };
  if (jwt) headers["X-SaaSquatch-User-Token"] = jwt;

  return superagent
    .post(url)
    .send(data)
    .set(headers)
    .then(
      ({ text }) => JSON.parse(text),
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

export function doPut(url: string, data: any, jwt?: JWT) {
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
      ({ text }) => JSON.parse(text),
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
