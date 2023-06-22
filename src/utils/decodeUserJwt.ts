import debug from "debug";
import { User } from "../types";
const _log = debug("squatch-js:decodeJwt");

export function decodeUserJwt(tokenStr: string): User | null {
  try {
    const base64Url = tokenStr.split(".")[1];
    if (base64Url === undefined) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonStr = Buffer.from(base64, "base64").toString();
    return JSON.parse(jsonStr)?.user;
  } catch (e) {
    _log(e);
    return null;
  }
}
