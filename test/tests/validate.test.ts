import { validateSchema } from "webpack";
import {
  isObject,
  validateConfig,
  validateLocale,
  validatePasswordlessConfig,
  validateWidgetConfig,
} from "../../src/utils/validate";
import { DEFAULT_DOMAIN, DEFAULT_NPM_CDN } from "../../src/globals";

describe("validateConfig handling missing properties", () => {
  it("errors if no object is passed in", () => {
    expect(() => validateConfig()).toThrowError();
  });

  describe("when window.squatchConfig is set", () => {
    beforeAll(() => {
      window.squatchTenant = "TEST_TENANTALIAS";
      window.squatchConfig = {
        domain: "TEST_DOMAIN",
        npmCdn: "TEST_NPM_CDN",
        debug: true,
      };
    });

    it("defaults tenantAlias to window.squatchTenant", () => {
      const result = validateConfig({});
      expect(result.tenantAlias).toBe(window.squatchTenant);
    });
    it("defaults domain to window.squatchConfig.domain", () => {
      const result = validateConfig({});
      expect(result.domain).toBe(window.squatchConfig.domain);
    });
    it("defaults debug to window.squatchConfig.debug", () => {
      const result = validateConfig({});
      expect(result.debug).toBe(window.squatchConfig.debug);
    });

    afterAll(() => {
      // @ts-ignore
      delete window.squatchTenant;
      // @ts-ignore
      delete window.squatchConfig;
    });
  });

  describe("when window.squatchConfig is not set", () => {
    it("errors with no tenantAlias", () => {
      expect(() => validateConfig({})).toThrowError();
      expect(() => validateConfig({ tenantAlias: "" })).toThrowError();
    });

    const input = { tenantAlias: "test" };
    it(`defaults domain to ${DEFAULT_DOMAIN}`, () => {
      const result = validateConfig(input);
      expect(result.domain).toBe(DEFAULT_DOMAIN);
    });
    it(`defaults npmCdn to ${DEFAULT_NPM_CDN}`, () => {
      const result = validateConfig(input);
      expect(result.npmCdn).toBe(DEFAULT_NPM_CDN);
    });
    it("defaults debug to false", () => {
      const result = validateConfig(input);
      expect(result.debug).toBe(false);
    });
  });
});

test("isObject", () => {
  expect(isObject("string")).toBe(false);
  expect(isObject(33)).toBe(false);
  expect(isObject(["a"])).toBe(false);
  expect(isObject([{}])).toBe(false);
  expect(isObject(false)).toBe(false);
  expect(isObject(undefined)).toBe(false);
  expect(isObject(null)).toBe(false);

  expect(isObject({})).toBe(true);
});

test("validateLocale", () => {
  expect(validateLocale()).toBe(undefined);
  expect(validateLocale("")).toBe(undefined);
  expect(validateLocale("en-US")).toBe(undefined);
  expect(validateLocale("US-en")).toBe(undefined);
  expect(validateLocale("eeee_US")).toBe(undefined);
  expect(validateLocale("ee_USA")).toBe(undefined);
  expect(validateLocale("ee_US0000")).toBe(undefined);
  expect(validateLocale("ee_USA0000")).toBe(undefined);

  expect(validateLocale("en_US")).toBe("en_US");
  expect(validateLocale("en_000")).toBe("en_000");
});

test("validateWidgetConfig", () => {
  // @ts-ignore
  expect(() => validateWidgetConfig()).toThrowError();

  expect(() => validateWidgetConfig({})).toThrowError();
  expect(() => validateWidgetConfig({ notUser: "asdf" })).toThrowError();

  const user = { user: "anything" };
  expect(validateWidgetConfig(user)).toBe(user);
});

test("validatePasswordlessConfig", () => {
  // @ts-ignore
  expect(() => validatePasswordlessConfig()).toThrowError();
  expect(() => validatePasswordlessConfig("")).toThrowError();

  expect(() => validatePasswordlessConfig({})).not.toThrowError();

  const obj = { a: "anything" };
  expect(validatePasswordlessConfig(obj)).toBe(obj);
});
