import { getQueryStringParams } from "./util";

const tenantAlias = "test_ahq6tdmfclzwx";
const domain = "https://staging.referralsaasquatch.com";
const script = "http://localhost:5000/squatch.min.js";


export const popup: Sandbox = {
  script,
  domain,
  tenantAlias,
  debug: true,
  initObj: {
    widgetType: "REFERRER_WIDGET",
    engagementMedium: "POPUP",
    user: {
      id: "abc_123",
      accountId: "abc_123",
      email: "john@example.com",
      firstName: "John",
      lastName: "Doe"
    },
    jwt:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiYWJjXzEyMyIsImFjY291bnRJZCI6ImFiY18xMjMiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJmaXJzdE5hbWUiOiJKb2huIiwibGFzdE5hbWUiOiJEb2UifX0.8UIafGkjo8pnqh_7BG57QXhTZNRnJ2IKTPzejWFL1iA"
  }
};

export const embed: Sandbox = {
  script,
  domain,
  tenantAlias,
  initObj: {
    widgetType: "REFERRER_WIDGET",
    engagementMedium: "EMBED",
    user: {
      id: "abc_123",
      accountId: "abc_123",
      email: "john@example.com",
      firstName: "John",
      lastName: "Doe"
    },
    jwt:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiYWJjXzEyMyIsImFjY291bnRJZCI6ImFiY18xMjMiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJmaXJzdE5hbWUiOiJKb2huIiwibGFzdE5hbWUiOiJEb2UifX0.8UIafGkjo8pnqh_7BG57QXhTZNRnJ2IKTPzejWFL1iA"
  }
};

export const embedNew: Sandbox = {
  ...embed,
  initObj: {
    ...embed.initObj,
    widgetType: "p/jorge3/w/referrerWidget",
  }
};

export const embedReferred: Sandbox = {
  ...embed,
  initObj: {
    ...embed.initObj,
    widgetType: "CONVERSION_WIDGET",
  }

};

export const popupReferred: Sandbox = {
  ...popup,
  initObj: {
    ...popup.initObj,
    widgetType: "CONVERSION_WIDGET",
  }
};

export const popupNew: Sandbox = {
  ...popup,
  initObj: {
    ...popup.initObj,
    widgetType: "p/jorge3/w/referrerWidget",
  }
};

export function fromURL() {
  let urlSandbox;
  try {
    urlSandbox = JSON.parse(
      window.atob(getQueryStringParams(window.location.search).sandbox)
    );
  } catch (e) {
    urlSandbox = {};
  }

  const sandbox = {
    ...popup,
    ...urlSandbox
  };
  return sandbox;
}

export function toURL(sandbox: Sandbox) {
  const param = window.btoa(JSON.stringify(sandbox));
  var url = window.location.href;
  if (url.indexOf("?") > 0) {
    url = url.substring(0, url.indexOf("?"));
  }
  url += `?sandbox=${encodeURIComponent(param)}`;
  window.location.replace(url);
}