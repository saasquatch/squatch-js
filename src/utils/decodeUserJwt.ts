import { debug } from "debug";
import { User } from "../types";
import { b64decode } from "./cookieUtils";
const _log = debug("squatch-js:decodeJwt");

export function decodeUserJwt(tokenStr: string): User | null {
  try {
    const base64Url = tokenStr.split(".")[1];
    if (base64Url === undefined) return null;
    const jsonStr = b64decode(base64Url);
    return JSON.parse(jsonStr)?.user;
  } catch (e) {
    _log(e);
    return null;
  }
}
