import fetchPonyfill from "fetch-ponyfill";
import { JWT } from "../types";

const { fetch } = fetchPonyfill();

export async function doGet(url: string, jwt = "") {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (jwt) headers["X-SaaSquatch-User-Token"] = jwt;

  try {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers,
    });

    const text = await response.text();

    if (response.status < 200 || response.status > 299) {
      throw new Error(text);
    }

    if (response.headers.get("Content-Type") === "application/json") {
      return JSON.parse(text);
    }

    return text;
  } catch (e) {
    let json: any;
    try {
      json = JSON.parse(e.message);
    } catch (e) {
      throw e.message;
    }
    throw json;
  }
}

export async function doPost(url: string, data: any, jwt?: JWT) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (jwt) headers["X-SaaSquatch-User-Token"] = jwt;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: data,
    });

    const text = await response.text();

    if (response.status < 200 || response.status > 299) {
      throw new Error(text);
    }

    if (response.headers.get("Content-Type") === "application/json") {
      return JSON.parse(text);
    }

    return text;
  } catch (e) {
    let json: any;
    try {
      json = JSON.parse(e.message);
    } catch (e) {
      throw e.message;
    }
    throw json;
  }
}

export async function doPut(url: string, data: any, jwt?: JWT) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-SaaSquatch-Referrer": window ? window.location.href : "",
  };

  if (jwt) headers["X-SaaSquatch-User-Token"] = jwt;

  try {
    const response = await fetch(url, {
      method: "PUT",
      credentials: "include",
      headers,
      body: data,
    });

    const text = await response.text();

    if (response.status < 200 || response.status > 299) {
      throw new Error(text);
    }

    if (response.headers.get("Content-Type") === "application/json") {
      return JSON.parse(text);
    }

    return text;
  } catch (e) {
    let json: any;
    try {
      json = JSON.parse(e.message);
    } catch (e) {
      throw e.message;
    }
    throw json;
  }
}
