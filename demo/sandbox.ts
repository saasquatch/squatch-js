import { getQueryStringParams } from "./util";

export const tenantAlias = "test_aojsrf4r06zi0";
export const domain = "https://staging.referralsaasquatch.com";
export const script = "https://fast.ssqt.io/squatch-js@2";

export const user = {
  id: "5b980d34e4b0cabee07f2cb0",
  accountId: "AZJZSVG0LS1LB19R",
  email: "chesterscott.uexwltgh@mailosaur.io",
};
export const badJwtUser = {
  ...user,
  firstName: "Bad JWT",
};
export const noIds = {
  firstName: "No IDs",
};
export const noUserId = {
  accountId: "abc_123",
  firstName: "No UserID",
};
export const noAccountId = {
  id: "abc_123",
  firstName: "No AccountID",
};

export const users = [user, badJwtUser, noIds, noUserId, noAccountId, {}];

export const popup: Sandbox = {
  script,
  domain,
  tenantAlias,
  debug: true,
  initObj: {
    widgetType: "REFERRER_WIDGET",
    engagementMedium: "POPUP",
    user: user,
    jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWI5ODBkMzRlNGIwY2FiZWUwN2YyY2IwIiwiYWNjb3VudElkIjoiQVpKWlNWRzBMUzFMQjE5UiIsImVtYWlsIjoiY2hlc3RlcnNjb3R0LnVleHdsdGdoQG1haWxvc2F1ci5pbyJ9fQ.MkrO7-980M7NRJcOUcdqCO1JftqmynLMK8bTEB3WObo",
  },
};

export const embed: Sandbox = {
  script,
  domain,
  tenantAlias,
  initObj: {
    widgetType: "REFERRER_WIDGET",
    engagementMedium: "EMBED",
    user: {
      id: "5b980d34e4b0cabee07f2cb0",
      accountId: "AZJZSVG0LS1LB19R",
      email: "chesterscott.uexwltgh@mailosaur.io",
    },
    jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWI5ODBkMzRlNGIwY2FiZWUwN2YyY2IwIiwiYWNjb3VudElkIjoiQVpKWlNWRzBMUzFMQjE5UiIsImVtYWlsIjoiY2hlc3RlcnNjb3R0LnVleHdsdGdoQG1haWxvc2F1ci5pbyJ9fQ.MkrO7-980M7NRJcOUcdqCO1JftqmynLMK8bTEB3WObo",
  },
};

export const embedNew: Sandbox = {
  ...embed,
  initObj: {
    ...embed.initObj,
    widgetType: "p/tuesday-text/w/referrerWidget",
  },
};

export const embedReferred: Sandbox = {
  ...embed,
  initObj: {
    ...embed.initObj,
    widgetType: "CONVERSION_WIDGET",
  },
};

export const popupReferred: Sandbox = {
  ...popup,
  initObj: {
    ...popup.initObj,
    widgetType: "CONVERSION_WIDGET",
  },
};

export const popupNew: Sandbox = {
  ...popup,
  initObj: {
    ...popup.initObj,
    widgetType: "p/tuesday-test/w/referrerWidget",
  },
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
    ...urlSandbox,
  };
  return sandbox;
}

export function toURL(sandbox: Sandbox) {
  window.location.href = href(sandbox);
}

export function href(sandbox: Sandbox) {
  const urlParams = new URLSearchParams(window.location.search);
  const param = window.btoa(JSON.stringify(sandbox));
  var url = window.location.href;
  if (url.indexOf("?") > 0) {
    url = url.substring(0, url.indexOf("?"));
  }

  urlParams.delete("sandbox");

  url += `?sandbox=${encodeURIComponent(param)}&${urlParams.toString()}`;
  return url;
}
