import debug from "debug";
import { JWT } from "../types";

const _log = debug("squatch-js:io");

export async function doQuery(
  url: string,
  query: string,
  variables: Record<string, unknown>,
  token: string | undefined
) {
  const headers = {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "X-SaaSquatch-Referrer": window ? window.location.href : "",
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ query, variables }),
      headers,
    });
    if (!res.ok) throw new Error(await res.text());
    return JSON.parse(await res.json());
  } catch (e) {
    _log(e);
    throw e;
  }
}

export async function doGet<T>(url, jwt = ""): Promise<T> {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (jwt) headers["X-SaaSquatch-User-Token"] = jwt;

  try {
    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers,
    });
    if (!res.ok) throw new Error(await res.text());
    return JSON.parse(await res.json());
  } catch (e) {
    _log(e);
    throw e;
  }
}
export async function doPost(url: string, data: any, jwt?: JWT) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (jwt) headers["X-SaaSquatch-User-Token"] = jwt;

  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers,
    });
    if (!res.ok) throw new Error(await res.text());
    return JSON.parse(await res.json());
  } catch (e) {
    _log(e);
    throw e;
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
    const res = await fetch(url, {
      headers,
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return JSON.parse(await res.json());
  } catch (e) {
    _log(e);
    throw e;
  }
}
