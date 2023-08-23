import { debug } from "debug";
import { JWT } from "../types";
import { getToken } from "./validate";

const _log = debug("squatch-js:io");

export async function doQuery(
  url: string,
  query: string,
  variables: Record<string, unknown>,
  jwt: string | undefined
) {
  const token = jwt || getToken();
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
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
    return await res.json();
  } catch (e) {
    throw e;
  }
}

export async function doGet<T>(url, jwt = ""): Promise<T> {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const token = jwt || getToken();
  if (token) headers["X-SaaSquatch-User-Token"] = token;

  try {
    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers,
    });
    const reply = await res.text();
    if (!res.ok) throw new Error(reply);

    return reply ? JSON.parse(reply) : reply;
  } catch (e) {
    throw e;
  }
}
export async function doPost(url: string, data: any, jwt?: JWT) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const token = jwt || getToken();
  if (token) headers["X-SaaSquatch-User-Token"] = token;

  try {
    const res = await fetch(url, {
      method: "POST",
      body: data,
      headers,
    });

    const reply = await res.text();
    if (!res.ok) throw new Error(reply);

    return reply ? JSON.parse(reply) : reply;
  } catch (e) {
    throw e;
  }
}

export async function doPut(url: string, data: any, jwt?: JWT) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-SaaSquatch-Referrer": window ? window.location.href : "",
  };

  const token = jwt || getToken();
  if (token) headers["X-SaaSquatch-User-Token"] = token;

  try {
    const res = await fetch(url, {
      headers,
      method: "PUT",
      credentials: "include",
      body: data,
    });
    const reply = await res.text();
    if (!res.ok) throw new Error(reply);

    return reply ? JSON.parse(reply) : reply;
  } catch (e) {
    throw e;
  }
}
