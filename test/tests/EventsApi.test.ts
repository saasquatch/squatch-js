import EventsApi from "../../src/api/EventsApi";
import { JWT } from "../../src/types";
import * as utils from "../../src/utils/io";
import { DEFAULT_DOMAIN } from "../../src/utils/validate";

describe("methods", () => {
  describe("track", () => {
    test.each([
      {
        params: {
          accountId: "asdf",
          events: [],
          userId: "asdf",
        },
        options: {},
      },
      {
        params: {
          accountId: "asdf",
          events: [{ key: "purchase" }],
          userId: "asdf",
        },
        options: { asdf: {} },
      },
      {
        params: {
          accountId: "asdf",
          events: [{ key: "purchase" }],
          userId: "asdf",
        },
        options: { jwt: "SOME_JWT" },
      },
      {
        params: {
          accountId: "asdf",
          // CA: Notice here the event object is invalid but can still be sent
          events: [{ name: "purchase" }],
          userId: "asdf",
        },
        options: {},
      },
    ])("passing cases", async (args) => {
      const postReturn = { success: "yes" };
      const mockPost = jest
        .spyOn(utils, "doPost")
        .mockImplementation(async () => postReturn);

      const api = new EventsApi({ tenantAlias: "tenant_alias" });
      expect(api.domain).toBe(DEFAULT_DOMAIN);
      expect(api.tenantAlias).toBe("tenant_alias");

      // @ts-ignore
      const result = await api.track(args.params, args.options);

      expect(result).toBe(postReturn);
      const url =
        DEFAULT_DOMAIN +
        "/api/v1/tenant_alias/open/account/asdf/user/asdf/events";
      expect(mockPost).toHaveBeenCalledWith(
        url,
        JSON.stringify(args.params),
        args.options?.jwt || undefined
      );
    });
    test.each([
      {
        params: {
          events: [],
          userId: "asdf",
        },
        options: {},
      },
      {
        params: {
          accountId: "asdf",
          userId: "asdf",
        },
        options: {},
      },
      {
        params: {
          accountId: "asdf",
          events: {},
          userId: "asdf",
        },
        options: {},
      },
      {
        params: {
          accountId: "asdf",
          events: [],
        },
        options: {},
      },
      {
        params: {
          accountId: "asdf",
          events: [{ key: "purchase" }],
          userId: "asdf",
        },
        options: undefined,
      },
      {
        params: undefined,
        options: { jwt: "SOME_JWT" },
      },
    ])("failing cases", async (args) => {
      const mockPost = jest
        .spyOn(utils, "doPost")
        .mockImplementation(async () => new Promise((res) => res({})));

      const api = new EventsApi({ tenantAlias: "tenant_alias" });
      expect(api.domain).toBe(DEFAULT_DOMAIN);
      expect(api.tenantAlias).toBe("tenant_alias");

      const body = {};

      await expect(
        // @ts-ignore
        async () => await api.track(args.params, args.options)
      ).rejects.toThrowError();
      expect(mockPost).toHaveBeenCalledTimes(0);
    });
  });
});
