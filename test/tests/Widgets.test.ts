import WidgetApi from "../../src/api/WidgetApi";
import Widgets from "../../src/widgets/Widgets";
import PopupWidget from "../../src/widgets/PopupWidget";
import EmbedWidget from "../../src/widgets/EmbedWidget";
import { EngagementMedium } from "../../src/types";
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
test.each([
  { r: "example.com", href: "https://www.example.com", valid: true },
  { r: "example.com.au", href: "https://www.example.com", valid: false },
  { r: "^www.example.com", href: "https://www.example.com", valid: false },
])("_matchesUrl static method", ({ r, href, valid }) => {
  window.location.href = href;
  const response = Widgets["_matchesUrl"](r);
  expect(response).toBe(valid);
});
describe("methods", () => {
  let widgets!: Widgets;
  let mockMatchUrl = jest.fn();
  beforeEach(() => {
    const config = {
      tenantAlias: "DEFAULT_TENANTALIAS",
      domain: "DEFAULT_DOMAIN",
      npmCdn: "DEFAULT_NPMCDN",
    };
    Widgets["_matchesUrl"] = mockMatchUrl;
    widgets = new Widgets(config);
  });
  // afterEach(() => {
  //   jest.clearAllMocks();
  // });
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
        .mockImplementation(() => ({ template: "asdf" }));
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
      expect(result.widget).toStrictEqual({ template: "asdf" });
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
    test.each([{ displayOnLoad: true }, { displayOnLoad: false }])(
      "basic render, default widget",
      (args) => {
        const widget = widgets["_renderWidget"](
          defaultResponse,
          { ...defaultConfig, ...args },
          defaultContext
        );

        expect(widget).toBeInstanceOf(PopupWidget);

        expect(PopupWidget).toHaveBeenCalledTimes(1);
        // @ts-ignore
        const instance = PopupWidget.mock.instances[0];
        const mockLoad = instance.load;
        expect(mockLoad).toBeCalled();

        const mockOpen = instance.open;
        if (args.displayOnLoad) expect(mockOpen).toBeCalled();
        else expect(mockOpen).not.toBeCalled();
      }
    );
    test.each([
      { engagementMedium: "EMBED" as const, displayOnLoad: true },
      { engagementMedium: "EMBED" as const, displayOnLoad: false },
      { engagementMedium: "POPUP" as const, displayOnLoad: true },
      { engagementMedium: "POPUP" as const, displayOnLoad: false },
    ])("basic render cases", (args) => {
      const widget = widgets["_renderWidget"](
        defaultResponse,
        { ...defaultConfig, ...args },
        defaultContext
      );

      if (args.engagementMedium === "EMBED") {
        expect(widget).toBeInstanceOf(EmbedWidget);
        expect(EmbedWidget).toHaveBeenCalledTimes(1);
        // @ts-ignore
        const instance = EmbedWidget.mock.instances[0];
        const mockLoad = instance.load;
        expect(mockLoad).toBeCalled();
      } else if (args.engagementMedium === "POPUP") {
        expect(widget).toBeInstanceOf(PopupWidget);
        expect(PopupWidget).toHaveBeenCalledTimes(1);
        // @ts-ignore
        const instance = PopupWidget.mock.instances[0];
        const mockLoad = instance.load;
        const mockOpen = instance.open;
        expect(mockLoad).toBeCalled();
        if (args.displayOnLoad) expect(mockOpen).toBeCalled();
        else expect(mockOpen).not.toBeCalled();
      } else {
        fail();
      }
    });

    describe("jsOptions", () => {
      test.each([{ widgetType: undefined }, { widgetType: "w/widget-type" }])(
        "defaultWidgetType",
        (args) => {
          const response = {
            jsOptions: {
              widget: { defaultWidgetType: "w/default-widget-type" },
            },
          };
          const widget = widgets["_renderWidget"](
            {
              ...defaultResponse,
              ...response,
            },
            { ...defaultConfig, widgetType: args.widgetType },
            defaultContext
          );
          expect(widget).toBeInstanceOf(PopupWidget);
          expect(PopupWidget).toHaveBeenCalledTimes(1);
          if (args.widgetType) {
            // @ts-ignore
            expect(PopupWidget.mock.calls[0][0].type).toBe(args.widgetType);
          } else {
            // @ts-ignore
            expect(PopupWidget.mock.calls[0][0].type).toBe(
              response.jsOptions.widget.defaultWidgetType
            );
          }
          // @ts-ignore
          const instance = PopupWidget.mock.instances[0];
          const mockLoad = instance.load;
          expect(mockLoad).toBeCalled();
        }
      );
      test.each([
        {
          _matchesUrl: false,
          response: {},
          widgetUrlMappings: [
            {
              url: "www.example.com",
              widgetType: "w/widget-type",
              displayOnLoad: true,
            },
          ],
          shouldDisplayOnLoad: false,
          engagementMedium: "POPUP",
        },
        {
          _matchesUrl: true,
          response: {},
          widgetUrlMappings: [
            { url: "www.example.com", widgetType: "CONVERSION_WIDGET" },
          ],
          shouldDisplayOnLoad: false,
          engagementMedium: "POPUP",
        },
        {
          _matchesUrl: true,
          response: {
            user: { referredBy: { code: "ASDF" } },
          },
          widgetUrlMappings: [
            {
              url: "www.example.com",
              widgetType: "CONVERSION_WIDGET",
              displayOnLoad: true,
            },
          ],
          shouldDisplayOnLoad: true,
          engagementMedium: "POPUP",
        },
        {
          _matchesUrl: true,
          response: {
            user: { referredBy: { code: "ASDF" } },
          },
          widgetUrlMappings: [
            {
              url: "www.example.com",
              widgetType: "CONVERSION_WIDGET",
              displayOnLoad: true,
            },
          ],
          shouldDisplayOnLoad: true,
          engagementMedium: undefined,
        },
      ])("widgetUrlMappings", (args) => {
        mockMatchUrl.mockReturnValue(args._matchesUrl);

        const widget = widgets["_renderWidget"](
          {
            ...defaultResponse,
            ...args.response,
            jsOptions: { widgetUrlMappings: args.widgetUrlMappings },
          },
          {
            ...defaultConfig,
            engagementMedium: args.engagementMedium as EngagementMedium,
            displayOnLoad: false,
          },
          defaultContext
        );
        expect(mockMatchUrl).toHaveBeenCalled();
        expect(mockMatchUrl).toHaveReturnedWith(args._matchesUrl);

        expect(widget).toBeInstanceOf(PopupWidget);
        // @ts-ignore
        expect(PopupWidget).toHaveBeenCalledTimes(1);
        if (args.shouldDisplayOnLoad) {
          // @ts-ignore
          const instance = PopupWidget.mock.instances[0];
          const mockOpen = instance.open;
          expect(mockOpen).toHaveBeenCalledTimes(1);
        }
      });
      test.each([
        {
          _matchesUrl: false,
          response: {},
          fuelTankAutofillUrls: [{ url: "asdf", formSelector: "asdf" }],
          shouldSucceed: false,
        },
        {
          _matchesUrl: true,
          response: {},
          fuelTankAutofillUrls: [{ url: "asdf", formSelector: "asdf" }],
          shouldSucceed: false,
        },
        {
          _matchesUrl: true,
          response: { user: { referredBy: { code: "asdf" } } },
          fuelTankAutofillUrls: [{ url: "asdf", formSelector: "asdfasfdasdf" }],
          shouldSucceed: false,
        },
        {
          _matchesUrl: true,
          response: {
            user: {
              referredBy: {
                code: "asdf",
              },
            },
          },
          fuelTankAutofillUrls: [{ url: "asdf", formSelector: "#id" }],
          shouldSucceed: true,
        },
        {
          _matchesUrl: true,
          response: {
            user: {
              referredBy: {
                code: "asdf",
                referredReward: { fuelTankCode: "ASDF" },
              },
            },
          },
          fuelTankAutofillUrls: [{ url: "asdf", formSelector: "#id" }],
          shouldSucceed: true,
        },
      ])("fuelTankAutofillUrls", (args) => {
        let input: HTMLInputElement | undefined;

        if (args.shouldSucceed) {
          if (args.fuelTankAutofillUrls?.[0].formSelector) {
            input = document.createElement("input");
            input.id = args.fuelTankAutofillUrls[0].formSelector.substring(1);
            document.body.appendChild(input);
          } else {
            throw new Error("Invalid case");
          }
        }

        mockMatchUrl.mockReturnValue(args._matchesUrl);

        const widget = widgets["_renderWidget"](
          {
            ...defaultResponse,
            ...args.response,
            jsOptions: { fuelTankAutofillUrls: args.fuelTankAutofillUrls },
          },

          defaultConfig,
          defaultContext
        );
        expect(mockMatchUrl).toHaveBeenCalled();
        expect(mockMatchUrl).toHaveReturnedWith(args._matchesUrl);
        expect(widget).toBeInstanceOf(PopupWidget);
        // @ts-ignore
        expect(PopupWidget).toHaveBeenCalledTimes(1);

        if (args.shouldSucceed) {
          expect(input).toBeInstanceOf(HTMLInputElement);
          args.fuelTankAutofillUrls.forEach(({ url, formSelector }) => {
            const elem = document.querySelector(formSelector);
            expect(elem).not.toBeNull();

            const value =
              args.response.user?.referredBy.referredReward?.fuelTankCode;

            if (value) expect((elem as HTMLInputElement).value).toBe(value);
            else expect((elem as HTMLInputElement).value).toBe("");
          });
        }
      });
    });
  });
  test("_renderPopupWidget", () => {});
  test("_renderEmbedWidget", () => {});
  describe("_renderErrorWidget", () => {
    test.each(["POPUP", "EMBED", "INVALID", undefined])(
      "basic",
      (engagementMedium) => {
        widgets["_renderErrorWidget"](
          { apiErrorCode: "400", rsCode: "400", message: "400" },
          engagementMedium as EngagementMedium
        );

        if (engagementMedium === "EMBED") {
          expect(EmbedWidget).toHaveBeenCalledTimes(1);
          // @ts-ignore
          expect(EmbedWidget.mock.calls[0][0].type).toBe("ERROR_WIDGET");
          // @ts-ignore
          expect(EmbedWidget.mock.calls[0][0].context?.type).toBe("error");
          // @ts-ignore
          expect(EmbedWidget.mock.calls[0][0].content).toBe("error");
          // @ts-ignore
          const instance = EmbedWidget.mock.instances[0];
          const mockLoad = instance.load;
          expect(mockLoad).toBeCalled();
        } else if (
          engagementMedium === "POPUP" ||
          engagementMedium === undefined
        ) {
          expect(PopupWidget).toHaveBeenCalledTimes(1);
          // @ts-ignore
          expect(PopupWidget.mock.calls[0][0].type).toBe("ERROR_WIDGET");
          // @ts-ignore
          expect(PopupWidget.mock.calls[0][0].context?.type).toBe("error");
          // @ts-ignore
          expect(PopupWidget.mock.calls[0][0].content).toBe("error");
          // @ts-ignore
          const instance = PopupWidget.mock.instances[0];
          const mockLoad = instance.load;
          expect(mockLoad).toBeCalled();
        } else {
          expect(EmbedWidget).not.toHaveBeenCalled();
          expect(PopupWidget).not.toHaveBeenCalled();
        }
      }
    );
  });
});
