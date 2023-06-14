import debug from "debug";
const _log = debug("squatch-js:decodeJwt");

export function decodeJwt(tokenStr: string) {
  try {
    const base64Url = tokenStr.split(".")[1];
    if (base64Url === undefined) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonStr = Buffer.from(base64, "base64").toString();
    return JSON.parse(jsonStr);
  } catch (e) {
    _log(e);
    return;
  }
}
