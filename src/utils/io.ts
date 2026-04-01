import { JWT } from "../types";
import { debug } from "./logger";
import { getToken } from "./validate";

const _log = debug("squatch-js:io");

/**
 * Parses an error response body and returns a throwable Error with API details.
 */
function parseErrorResponse(responseText: string): Error & {
  apiErrorCode?: string;
  rsCode?: string;
  statusCode?: number;
} {
  let apiErrorCode: string | undefined;
  let rsCode: string | undefined;
  let statusCode: number | undefined;
  let message = responseText;

  try {
    const parsed = JSON.parse(responseText);
    if (parsed && typeof parsed === "object") {
      apiErrorCode = parsed.apiErrorCode;
      rsCode = parsed.rsCode;
      statusCode = parsed.statusCode;
      message = parsed.message || responseText;
    }
  } catch (e) {}

  const err = new Error(message);
  if (apiErrorCode) (err as any).apiErrorCode = apiErrorCode;
  if (rsCode) (err as any).rsCode = rsCode;
  if (statusCode !== undefined) (err as any).statusCode = statusCode;
  return err;
}

export async function doQuery(
  url: string,
  query: string,
  variables: Record<string, unknown>,
  jwt: string | undefined,
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
    if (!res.ok) throw parseErrorResponse(await res.text());
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
  if (token) {
    headers["X-SaaSquatch-User-Token"] = token;
  } else {
    _log(
      "[DEBUG] doGet - No token found, proceeding without authentication header.",
    );
  }

  try {
    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers,
    });
    const reply = await res.text();
    if (!res.ok) throw parseErrorResponse(reply);

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
  if (token) {
    headers["X-SaaSquatch-User-Token"] = token;
  } else {
    _log(
      "[DEBUG] doPost - No token found, proceeding without authentication header.",
    );
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      body: data,
      headers,
    });

    const reply = await res.text();
    if (!res.ok) throw parseErrorResponse(reply);

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
    if (!res.ok) throw parseErrorResponse(reply);

    return reply ? JSON.parse(reply) : reply;
  } catch (e) {
    throw e;
  }
}
