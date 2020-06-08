import {
  When,
  Then,
  Before,
  After,
  setWorldConstructor,
  Given,
} from "cucumber";
import { promisify } from "util";

import { assert } from "chai";
import jsGlobal from "jsdom-global";
import jsdom from "jsdom";
import { Cookie, MemoryCookieStore } from "tough-cookie";

class World {
  cookies = new MemoryCookieStore();
  url?: string;
  jsdom?: () => void;
}
setWorldConstructor(World);

const domain = "https://example.com";

Before(function (this: World) {});

After(function (this: World) {
  this.jsdom && this.jsdom();
});

Given("a {string} cookie exists with value {string}", async function (
  this: World,
  cookieName: string,
  cookieValue: string
) {
  const cookie = new Cookie({
    key: cookieName,
    value: cookieValue,
  });
  await promisify(this.cookies.putCookie).bind(this.cookies)(cookie);
});
Given("the url is {string}", function (this: World, url: string) {
  this.url = url;
});

When("Squatch.js loads", async function (this: World) {
  this.jsdom = jsGlobal(`<html></html>`, {
    cookieJar: new jsdom.CookieJar(this.cookies),
    url: this.url,
  });
  // @ts-ignore
  window.squatch = "foo";
  const onLoad = await import("../../src/onLoad");
  onLoad();
});
Then("it always reads the _saasquatch parameter", function (this: World) {
  // Write code here that turns the phrase above into concrete actions
  //   return "pending";
  // @ts-ignore

  assert.equal(window.squatch, "foo");
});

Then("the {string} cookie is set to {string}", async function (
  this: World,
  cookieName: string,
  cookieValue: string
) {
  const cookies = await promisify(this.cookies.getAllCookies).bind(
    this.cookies
  )();

  const cookie = cookies.find((c) => c.key === cookieName);
  assert.exists(cookie, "Didn't find at least one cookie");
  assert.equal(cookie.value, cookieValue, "Invalid cookie value set");
});
