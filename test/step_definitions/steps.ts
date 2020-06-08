import {
  When,
  Then,
  Before,
  After,
  setWorldConstructor,
  Given,
} from "cucumber";

import { assert } from "chai";
import jsGlobal from "jsdom-global";
import jsdom from "jsdom";
import { Cookie, MemoryCookieStore } from "tough-cookie";
import Cookies from "js-cookie";

class World {
  cookies = new MemoryCookieStore();
  url?: string;
  jsdom?: () => void;
}
setWorldConstructor(World);

const domain = "https://example.com";

Before(function (this: World) {
  this.jsdom = jsGlobal(`<html></html>`, {
    cookieJar: new jsdom.CookieJar(this.cookies),
    url: this.url,
  });
});

After(function (this: World) {
  this.jsdom && this.jsdom();
});

Given("a {string} cookie exists with value {string}", async function (
  this: World,
  cookieName: string,
  cookieValue: string
) {
  Cookies.set(cookieName, cookieValue);
});
Given("the url is {string}", function (this: World, url: string) {
  // TODO: Figure out how to implement with jsdom-global
});

When("Squatch.js loads", async function (this: World) {
  // @ts-ignore
  window.squatch = "foo";
  assert.exists(document.cookie, "Cookie should exist on load");
  // @ts-ignore
  //   document.cookie = "";
  const onLoad = await import("../../src/onLoad");
  onLoad.default();
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
  const cookie = Cookies.get(cookieName);

  assert.exists(cookie, "Didn't find at least one cookie");
  assert.equal(cookie.value, cookieValue, "Invalid cookie value set");
});
