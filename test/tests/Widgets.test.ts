import WidgetApi from "../../src/api/WidgetApi";
import Widgets from "../../src/widgets/Widgets";
import PopupWidget from "../../src/widgets/PopupWidget";
import EmbedWidget from "../../src/widgets/EmbedWidget";
jest.mock("../../src/widgets/PopupWidget");
jest.mock("../../src/widgets/EmbedWidget");

test("initialisation", () => {
  const config = {
    tenantAlias: "tenantAlias",
    domain: "https://staging.referralsaasquatch.com",
    npmCdn: "http://www.example.com",
  };
  const widgets = new Widgets(config);

  expect(widgets.tenantAlias).toBe(config.tenantAlias);
  expect(widgets.domain).toBe(config.domain);
  expect(widgets.npmCdn).toBe(config.npmCdn);
  expect(widgets.api).toBeInstanceOf(WidgetApi);
  expect(widgets.api.tenantAlias).toBe(config.tenantAlias);
});
describe("methods", () => {
  let widgets!: Widgets;
  beforeEach(() => {
    const config = {
      tenantAlias: "DEFAULT_TENANTALIAS",
      domain: "DEFAULT_DOMAIN",
      npmCdn: "DEFAULT_NPMCDN",
    };
    widgets = new Widgets(config);
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("upsertUser", () => {
    const config = {
      user: {
        id: "userid",
        accountId: "accountId",
      },
      engagementMedium: "POPUP" as const,
      container: "#squatchpop",
      trigger: "#squatchpop",
    };
    beforeEach(() => {
      jest.clearAllMocks();
    });
    test("resolves", async () => {
      const upsertReturn = { template: "asdf", user: config.user };

      const mockRenderWidget = jest
        .spyOn(Widgets.prototype as any, "_renderWidget")
        .mockImplementation(() => ({}));
      const mockUpsert = jest
        .spyOn(widgets.api, "upsertUser")
        .mockImplementation(
          async () => new Promise((res) => res(upsertReturn))
        );

      const result = await widgets.upsertUser(config);
      expect(mockUpsert).toBeCalledWith(config);
      expect(mockRenderWidget).toBeCalledWith(upsertReturn, config, {
        type: "upsert",
        user: config.user,
        engagementMedium: config.engagementMedium,
        container: config.container,
        trigger: config.trigger,
      });
      expect(result.widget).toStrictEqual({});
      expect(result.user).toBe(upsertReturn.user);
    });
    test("upsert rejects", async () => {
      const mockRenderErrorWidget = jest
        .spyOn(Widgets.prototype as any, "_renderErrorWidget")
        .mockImplementation(() => ({}));
      const mockUpsert = jest
        .spyOn(widgets.api, "upsertUser")
        .mockImplementation(
          async () => new Promise((res, rej) => rej({ apiErrorCode: "400" }))
        );

      await expect(
        async () => await widgets.upsertUser(config)
      ).rejects.toThrow();
      expect(mockUpsert).toBeCalledWith(config);
      expect(mockRenderErrorWidget).toBeCalledWith(
        {
          apiErrorCode: "400",
        },
        config.engagementMedium
      );
    });
  });
  describe("render", () => {
    test("resolves, user information", async () => {
      const config = {
        engagementMedium: "POPUP" as const,
        user: {
          id: "asdf",
          accountId: "asdf",
        },
      };
      const mockResponse = { template: "asdf", user: config.user };
      const mockRender = jest
        .spyOn(widgets.api, "render")
        .mockImplementation(
          async () => new Promise((res) => res(mockResponse))
        );
      const mockRenderWidget = jest
        .spyOn(Widgets.prototype as any, "_renderWidget")
        .mockImplementation(() => ({ content: "asdf" }));

      const response = await widgets.render(config);
      expect(response).toBeDefined();
      expect(mockRender).toBeCalledWith(config);
      expect(mockRenderWidget).toBeCalledWith(mockResponse, config, {
        type: "passwordless",
        engagementMedium: config.engagementMedium,
      });
      expect(response!.widget).toStrictEqual({ content: "asdf" });
      expect(response!.user).toBe(mockResponse.user);
    });
    test("resolves, no user information", async () => {
      const config = {
        engagementMedium: "POPUP" as const,
      };
      const mockResponse = { template: "asdf", user: null };
      const mockRender = jest
        .spyOn(widgets.api, "render")
        .mockImplementation(
          async () => new Promise((res) => res(mockResponse))
        );
      const mockRenderWidget = jest
        .spyOn(Widgets.prototype as any, "_renderWidget")
        .mockImplementation(() => ({ content: "asdf" }));

      const response = await widgets.render(config);
      expect(response).toBeDefined();
      expect(mockRender).toBeCalledWith(config);
      expect(mockRenderWidget).toBeCalledWith(mockResponse, config, {
        type: "passwordless",
        engagementMedium: config.engagementMedium,
      });
      expect(response!.widget).toStrictEqual({ content: "asdf" });
      expect(response!.user).toBe(null);
    });
    test("rejects", async () => {
      const config = {
        engagementMedium: "POPUP" as const,
      };
      const mockRenderErrorWidget = jest
        .spyOn(Widgets.prototype as any, "_renderErrorWidget")
        .mockImplementation(() => ({}));
      const mockRender = jest
        .spyOn(widgets.api, "render")
        .mockImplementation(
          async () => new Promise((res, rej) => rej({ apiErrorCode: "400" }))
        );

      await expect(async () => await widgets.render(config)).rejects.toThrow();
      expect(mockRender).toBeCalledWith(config);
      expect(mockRenderErrorWidget).toBeCalledWith(
        {
          apiErrorCode: "400",
        },
        config.engagementMedium
      );
    });
  });
  describe("autofill", () => {
    test("invalid param", async () => {
      // @ts-ignore
      await expect(async () => await widgets.autofill(123)).rejects.toThrow();
    });
    describe("callback param", () => {
      test("resolve", async () => {
        const mockReturn = {
          codes: ["asdf"],
          encodedCookie: "asdf",
        };
        const mockAutofill = jest
          .spyOn(widgets.api, "squatchReferralCookie")
          .mockImplementation(
            async () => new Promise((res) => res(mockReturn))
          );

        const cb = jest.fn((params) => console.log(params));
        await widgets.autofill(cb);
        expect(mockAutofill).toBeCalled();
        expect(cb.mock.calls).toHaveLength(1);
      });
      test("reject", async () => {
        const mockAutofill = jest
          .spyOn(widgets.api, "squatchReferralCookie")
          .mockImplementation(
            async () => new Promise((res, rej) => rej("Error"))
          );
        const cb = jest.fn((params) => console.log(params));
        await expect(async () => await widgets.autofill(cb)).rejects.toThrow();
        expect(mockAutofill).toBeCalled();
        expect(cb.mock.calls).toHaveLength(0);
      });
    });
    describe("string selector", () => {
      test("No elements", async () => {
        await expect(
          async () => await widgets.autofill(".asdf")
        ).rejects.toThrow();
      });
      test("Elements exist, resolves", async () => {
        const mockResponse = {
          codes: ["asdf", "not-asdf"],
          encodedCookie: "asdf",
        };
        const mockCookie = jest
          .spyOn(widgets.api, "squatchReferralCookie")
          .mockImplementation(
            async () => new Promise((res) => res(mockResponse))
          );

        const input = document.createElement("input");
        input.className = "asdf";
        document.body.appendChild(input);

        await widgets.autofill(".asdf");

        expect(mockCookie).toBeCalled();
        expect(input.value).toBe("asdf");
      });
      test("Elements exist, rejects", async () => {
        const mockCookie = jest
          .spyOn(widgets.api, "squatchReferralCookie")
          .mockImplementation(
            async () => new Promise((res, rej) => rej("Error"))
          );

        const input = document.createElement("input");
        input.className = "asdf";
        document.body.appendChild(input);

        await expect(
          async () => await widgets.autofill(".asdf")
        ).rejects.toThrow();

        expect(mockCookie).toBeCalled();
        expect(input.value).toBe("");
      });
    });
  });
  describe("_renderWidget", () => {
    const defaultConfig = {
      widgetType: "w/widget-type",
    };
    const defaultContext = {
      type: "upsert" as const,
    };
    const defaultResponse = {
      template: "<p>asdf</p>",
    };
    test("No response", async () => {
      // @ts-ignore
      await expect(
        async () => await widgets["_renderWidget"](null, {}, defaultContext)
      ).rejects.toThrow();
    });
    test("basic render, default widget", async () => {
      widgets["_renderWidget"](defaultResponse, defaultConfig, defaultContext);

      expect(PopupWidget).toHaveBeenCalledTimes(1);
      // @ts-ignore
      const instance = PopupWidget.mock.instances[0];
      const mockLoad = instance.load;
      expect(mockLoad).toBeCalled();
    });
    test.each([
      { engagementMedium: "EMBED" as const, displayOnLoad: true },
      { engagementMedium: "EMBED" as const, displayOnLoad: false },
      { engagementMedium: "POPUP" as const, displayOnLoad: true },
      { engagementMedium: "POPUP" as const, displayOnLoad: false },
    ])("basic render, embed widget", (args) => {
      widgets["_renderWidget"](
        defaultResponse,
        { ...args, ...defaultConfig },
        defaultContext
      );

      if (args.engagementMedium === "EMBED") {
        expect(EmbedWidget).toHaveBeenCalledTimes(1);
        // @ts-ignore
        const instance = EmbedWidget.mock.instances[0];
        const mockLoad = instance.load;
        expect(mockLoad).toBeCalled();
      } else if (args.engagementMedium === "POPUP") {
        expect(PopupWidget).toHaveBeenCalledTimes(1);
        // @ts-ignore
        const instance = PopupWidget.mock.instances[0];
        const mockLoad = instance.load;
        const mockOpen = instance.open;
        expect(mockLoad).toBeCalled();
        if (args.displayOnLoad) expect(mockOpen).toBeCalled();
      } else {
        fail();
      }
    });
  });
  test("_renderPopupWidget", () => {});
  test("_renderEmbedWidget", () => {});
  test("_renderErrorWidget", () => {});
  test("_matchesUrl", () => {});
});
