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
  firefox,
  webkit,
  ChromiumBrowser,
  ChromiumBrowserContext,
  Cookie,
} from "playwright";

import { assert } from "chai";

class World {
  url?: string;
  browser: ChromiumBrowser;
  context: ChromiumBrowserContext;
}
setWorldConstructor(World);

Before(async function (this: World) {
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
  type AddCookie = typeof this.context.addCookies;
  type Cookies = Parameters<AddCookie>[0];

  const cookies: Cookies = [
    {
      name: cookieName,
      value: cookieValue,
    },
  ];
  this.context.addCookies(cookies);
});
Given("the url is {string}", function (this: World, url: string) {
  this.url = url;
});

When("Squatch.js loads", async function (this: World) {
  const page = await this.browser.newPage();
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
  const cookies = await this.context.cookies(this.url);

  const filtered = cookies.filter((c) => c.name == cookieName);
  assert.equal(
    filtered.length,
    1,
    "Should find exactly one cookie based on name"
  );

  const cookie = filtered[0];
  assert.exists(cookie, "Didn't find at least one cookie");
  assert.equal(cookie.value, cookieValue, "Invalid cookie value set");
});
