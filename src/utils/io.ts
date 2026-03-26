import { JWT } from "../types";
import { getToken } from "./validate";

/**
 * Parses an error response body and returns a throwable error object.
 * If the response is valid JSON with apiErrorCode, returns the parsed object.
 * Otherwise, returns an object with the raw message.
 */
function parseErrorResponse(responseText: string): {
  apiErrorCode?: string;
  rsCode?: string;
  message: string;
} {
  console.log("[DEBUG] parseErrorResponse - raw responseText:", responseText);
  try {
    const parsed = JSON.parse(responseText);
    console.log("[DEBUG] parseErrorResponse - parsed JSON:", parsed);
    if (parsed && typeof parsed === "object") {
      console.log(
        "[DEBUG] parseErrorResponse - returning parsed object with apiErrorCode:",
        parsed.apiErrorCode,
      );
      return parsed;
    }
  } catch (e) {
    console.log("[DEBUG] parseErrorResponse - JSON parse failed:", e);
  }
  return { message: responseText };
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
    console.log("[DEBUG] doGet - Adding token to headers:", token);
  } else {
    console.log(
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
    console.log("[DEBUG] doPost - Adding token to headers:", token);
    headers["X-SaaSquatch-User-Token"] = token;
  } else {
    console.log(
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
