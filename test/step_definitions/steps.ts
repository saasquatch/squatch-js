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
  // firefox,
  // webkit,
  ChromiumBrowser,
  ChromiumBrowserContext,
  Cookie,
  BrowserContext,
} from "playwright";

import { assert } from "chai";

class World {
  url?: string;
  browser: ChromiumBrowser;
  context: ChromiumBrowserContext;

  async cookieExists(cookieName: string, cookieValue: string) {
    const cookies = await this.context.cookies();
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

Given("a {string} cookie exists with value {string}", async function (
  this: World,
  cookieName: string,
  cookieValue: string
) {
  const cookie: Cookie = {
    name: cookieName,
    value: cookieValue,
    domain: "ssqt.io",
    path: "/",
    expires: new Date().getTime(),
    httpOnly: false,
    secure: false,
    sameSite: "Lax",
  };
  this.context.addCookies([cookie]);

  await this.cookieExists(cookieName, cookieValue);
});
Given("the url is {string}", function (this: World, url: string) {
  this.url = url;
});

When("Squatch.js loads", async function (this: World) {
  await this.cookieExists("_saasquatch", "GARBAGE");
  const page = await this.context.newPage();
  await page.goto(this.url);
});

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
