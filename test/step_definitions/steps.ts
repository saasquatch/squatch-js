import {
  When,
  Then,
  Before,
  After,
  setWorldConstructor,
  Given,
} from "cucumber";

import {
  chromium,
  ChromiumBrowser,
  ChromiumBrowserContext,
  Cookie,
} from "playwright";

// Note: This library is intentionally different than the one used for hte brwoser.
import base64url from "base64-url";

import { assert } from "chai";

import { web } from "../spApp";

class World {
  url?: string;
  browser: ChromiumBrowser;
  context: ChromiumBrowserContext;
  domain: string;
  host = web;

  async cookieDoesNotExist(cookieName: string, domain: string = this.domain) {
    const cookies = await this.context.cookies("https://" + domain);
    const filtered = cookies.filter((c) => c.name == cookieName);
    assert.isEmpty(filtered, `Should not find any cookies on ${this.domain}`);
  }
  async cookieExists(
    cookieName: string,
    cookieValue: string,
    domain: string = this.domain
  ) {
    const cookies = await this.context.cookies("https://" + domain);
    const filtered = cookies.filter((c) => c.name == cookieName);
    assert.equal(
      filtered.length,
      1,
      `Should find exactly one cookie based on name in cookies ${JSON.stringify(
        cookies
      )}`
    );
    const cookie = filtered[0];
    assert.exists(
      cookie,
      `Didn't find at least one cookie in cookies ${JSON.stringify(cookies)}`
    );
    assert.equal(
      cookie.value,
      cookieValue,
      `Invalid cookie value set in cookie ${JSON.stringify(cookie)}`
    );
  }
}
setWorldConstructor(World);

Before(async function (this: World) {
  if (this.browser || this.context)
    throw new Error("Shouldn't overwrite browser context this way.");
  this.browser = await chromium.launch(); // Or 'firefox' or 'webkit'.
  this.context = await this.browser.newContext();
});

After(async function (this: World) {
  if (this.browser) await this.browser.close();
});

Given("I am using squatchjs", function () {
  // Nothing to do here except setup?
});
Given("it is being loaded on {word}", function (this: World, domain: string) {
  this.domain = domain;
});

Given("the url is {string}", function (this: World, url: string) {
  this.url = url;
});
When("squatchjs loads", load);
When("Squatch.js loads", load);

async function load(this: World) {
  // TODO: Need a page that will actually load Squatch.js
  const page = await this.context.newPage();
  await page.goto(this.url);
}

Then("it always reads the _saasquatch parameter", function (this: World) {
  // @ts-ignore
  assert.equal(window.squatch, "foo");
});

Then("the {string} cookie is set to {string}", async function (
  this: World,
  cookieName: string,
  cookieValue: string
) {
  await this.cookieExists(cookieName, cookieValue);
});

Then("the {word} cookie will not be set for {string}", async function (
  this: World,
  cookieName: string,
  domain: string
) {
  await this.cookieDoesNotExist(cookieName, domain);
});

Given("a {word} cookie exists on {string}", async function (
  this: World,
  cookieName: string,
  domain: string,
  jsoncontent: string
) {
  const cookie: Cookie = {
    name: cookieName,
    value: encode(jsoncontent),
    domain: "https://" + domain,
    path: "/",
    expires: new Date().getTime(),
    httpOnly: false,
    secure: false,
    sameSite: "Lax",
  };
  await this.context.addCookies([cookie]);

  // await this.cookieExists(cookieName, encode(jsoncontent), "https://" + domain);
});

Then("the {word} cookie will be set for {string} with value", async function (
  this: World,
  cookieName: string,
  domain: string,
  jsoncontent: string
) {
  await this.cookieExists(cookieName, encode(jsoncontent), domain);
});

function encode(value: string) {
  if (typeof value !== "string") throw new Error("Invalid value" + value);
  // Note: This library is intentionally different than the one used for the browser.
  return base64url.encode(value);
}
function decode(value: string) {
  // Note: This library is intentionally different than the one used for the browser.
  return base64url.decode(value);
}

Given("a new saasquatch url value", function (
  this: World,
  jsonContent: string
) {
  this.url = `https://example.com?_saasquatch=${encode(jsonContent)}`;
});
