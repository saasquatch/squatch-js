/**
 * Tests for branch coverage of DeclarativeWidget.ts not covered by behavioural specs
 */

import { DEFAULT_DOMAIN } from "../../src/globals";
import DeclarativeWidget from "../../src/widgets/declarative/DeclarativeWidget";
import PopupWidget from "../../src/widgets/PopupWidget";
jest.mock("../../src/widgets/PopupWidget");

class Test extends DeclarativeWidget {}
describe("DeclarativeWidget", () => {
  beforeEach(() => {
    // @ts-ignore
    window.squatchToken = null;
    // @ts-ignore
    window.squatchTenant = "DEFAULT_TENANT";
    // @ts-ignore
    window.squatchConfig = null;
  });

  test.each([
    { domain: null, windowDomain: null },
    { domain: "www.example.com", windowDomain: null },
    { domain: null, windowDomain: "www.example.com" },
    { domain: "www.example.com", windowDomain: "www.example.com" },
  ])("_setupApis", (args) => {
    if (args.windowDomain) {
      // @ts-ignore
      window.squatchConfig = {
        domain: args.windowDomain,
      };
    }

    const widget = new Test();
    if (args.domain)
      widget["_setupApis"]({ tenantAlias: "asdf", domain: args.domain });
    else widget["_setupApis"]();

    if (args.domain) expect(widget.widgetApi.domain).toBe(args.domain);
    else if (args.windowDomain)
      expect(widget.widgetApi.domain).toBe(args.windowDomain);
    else expect(widget.widgetApi.domain).toBe(DEFAULT_DOMAIN);

    if (args.domain) expect(widget.analyticsApi.domain).toBe(args.domain);
    else if (args.windowDomain)
      expect(widget.analyticsApi.domain).toBe(args.windowDomain);
    else expect(widget.analyticsApi.domain).toBe(DEFAULT_DOMAIN);
  });
  describe("_setWidget", () => {
    test.each([{ domain: null }, { domain: "www.example.com" }])(
      "domain",
      (args) => {
        if (args.domain) {
          // @ts-ignore
          window.squatchConfig = {
            domain: args.domain,
          };
        }
        // @ts-ignore
        else window.squatchConfig = null;

        const widget = new Test();
        const result = widget["_setWidget"]({ template: "asdf", widgetConfig: undefined as any }, { type: "passwordless" });

        expect(PopupWidget).toHaveBeenCalled();
        expect(result).toBeInstanceOf(PopupWidget);
        // @ts-ignore
        const widgetArgs = PopupWidget.mock.calls[0][0];
        if (args.domain) expect(widgetArgs["domain"]).toBe(args.domain);
        else expect(widgetArgs["domain"]).toBe(DEFAULT_DOMAIN);
      }
    );
    test.each([{ container: ".selector" }, { container: null }])(
      "container",
      (args) => {
        const widget = new Test();
        widget.container = args.container;
        const result = widget["_setWidget"]({ template: "asdf", widgetConfig: undefined as any }, { type: "passwordless" });

        expect(PopupWidget).toHaveBeenCalled();
        expect(result).toBeInstanceOf(PopupWidget);
        // @ts-ignore
        const widgetArgs = PopupWidget.mock.calls[0][0];
        if (args.container)
          expect(widgetArgs["context"]["container"]).toBe(args.container);
        else expect(widgetArgs["context"]["container"]).toBe(undefined);

        expect(widgetArgs["container"]).toBe(widget);
      }
    );
  });
  describe("renderUserUpsertVariant", () => {
    test("no user information in token", async () => {
      const widget = new Test();
      const mockSetErrorWidget = jest.spyOn(widget, "setErrorWidget");
      widget.token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbnYiOnsidGVuYW50QWxpYXMiOiJ0ZXN0X2E4YjQxam90ZjhhMXYiLCJkb21haW4iOiJodHRwczovL3N0YWdpbmcucmVmZXJyYWxzYWFzcXVhdGNoLmNvbSJ9fQ";

      await widget["renderUserUpsertVariant"]();
      expect(mockSetErrorWidget).toHaveBeenCalled();
    });
  });

  describe("setErrorWidget", () => {
    test.each([{ domain: null }, { domain: "www.example.com" }])(
      "domain",
      (args) => {
        if (args.domain)
          window.squatchConfig = {
            domain: args.domain,
          };
        // @ts-ignore
        else window.squatchConfig = null;

        const widget = new Test();
        const result = widget["setErrorWidget"](new Error("asdf"));

        expect(PopupWidget).toHaveBeenCalled();
        expect(result).toBeInstanceOf(PopupWidget);
        // @ts-ignore
        const widgetArgs = PopupWidget.mock.calls[0][0];
        if (args.domain) expect(widgetArgs["domain"]).toBe(args.domain);
        else expect(widgetArgs["domain"]).toBe(DEFAULT_DOMAIN);
      }
    );
    test.each([{ container: ".selector" }, { container: null }])(
      "container",
      (args) => {
        const widget = new Test();
        widget.container = args.container;
        const result = widget["setErrorWidget"](new Error("asdf"));

        expect(PopupWidget).toHaveBeenCalled();
        expect(result).toBeInstanceOf(PopupWidget);
        // @ts-ignore
        const widgetArgs = PopupWidget.mock.calls[0][0];
        if (args.container)
          expect(widgetArgs["context"]["container"]).toBe(args.container);
        else expect(widgetArgs["context"]["container"]).toBe(undefined);

        expect(widgetArgs["container"]).toBe(widget);
      }
    );
    test("error widget on dom", () => {
      const widget = new Test();
      const child = document.createElement("div");
      widget.appendChild(child);
      const result = widget["setErrorWidget"](new Error("asdf"));

      expect(PopupWidget).toHaveBeenCalled();
      expect(result).toBeInstanceOf(PopupWidget);
      // @ts-ignore
      expect(PopupWidget.mock.calls[0][1]).toBeNull();
    });
  });

  test("open", () => {
    const widget = new Test();
    // @ts-ignore
    widget.widgetInstance = null;

    expect(() => widget.open()).toThrow();
  });
  test("close", () => {
    const widget = new Test();
    // @ts-ignore
    widget.widgetInstance = null;

    expect(() => widget.close()).toThrow();
  });

  describe("getWidgetType", () => {
    test.each([
      { widgetType: "w/websiteReferralWidget", expected: "instant-access" },
      { widgetType: "w/friendWidget", expected: "instant-access" },
      { widgetType: "w/referral-widget", expected: "verified-access" },
      { widgetType: "w/some-other-widget", expected: "verified-access" },
      { widgetType: undefined, expected: "verified-access" },
    ])("returns correct skeleton type for $widgetType", (args) => {
      const widget = new Test();
      const result = widget["getWidgetType"](args.widgetType);
      expect(result).toBe(args.expected);
    });
  });

  describe("connectedCallback", () => {
    test("sets loaded to true", async () => {
      const widget = new Test();
      widget.type = "EMBED";

      const mockRenderWidget = jest
        .spyOn(widget, "renderWidget")
        .mockImplementation(async () => {});

      await widget.connectedCallback();
      expect(widget.loaded).toBe(true);
    });

    test("creates and removes loading skeleton for embed", async () => {
      const widget = new Test();
      widget.type = "EMBED";
      widget.setAttribute("widget", "w/test-widget");

      let skeletonExisted = false;
      const mockRenderWidget = jest
        .spyOn(widget, "renderWidget")
        .mockImplementation(async () => {
          // During render, skeleton should exist
          const root = widget.shadowRoot;
          const skeleton = root?.getElementById("loading-skeleton");
          skeletonExisted = skeleton !== null;
        });

      await widget.connectedCallback();

      expect(skeletonExisted).toBe(true);

      // After render, skeleton should be removed
      const root = widget.shadowRoot;
      const skeleton = root?.getElementById("loading-skeleton");
      expect(skeleton).toBeNull();
    });

    test("calls open when open attribute is set", async () => {
      const widget = new Test();
      widget.type = "EMBED";
      widget.setAttribute("widget", "w/test-widget");
      widget.setAttribute("open", "");

      const mockRenderWidget = jest
        .spyOn(widget, "renderWidget")
        .mockImplementation(async () => {});

      const mockOpen = jest
        .spyOn(widget, "open")
        .mockImplementation(() => {});

      await widget.connectedCallback();
      expect(mockOpen).toHaveBeenCalled();
    });

    test("does not call open when open attribute is not set", async () => {
      const widget = new Test();
      widget.type = "EMBED";
      widget.setAttribute("widget", "w/test-widget");

      const mockRenderWidget = jest
        .spyOn(widget, "renderWidget")
        .mockImplementation(async () => {});

      const mockOpen = jest
        .spyOn(widget, "open")
        .mockImplementation(() => {});

      await widget.connectedCallback();
      expect(mockOpen).not.toHaveBeenCalled();
    });
  });

  describe("attributeChangedCallback", () => {
    test("does nothing when values are the same", () => {
      const widget = new Test();
      widget.loaded = true;

      const mockConnected = jest
        .spyOn(widget, "connectedCallback")
        .mockImplementation(async () => {});

      widget.attributeChangedCallback("widget", "old", "old");
      expect(mockConnected).not.toHaveBeenCalled();
    });

    test("does nothing when not loaded", () => {
      const widget = new Test();
      widget.loaded = false;

      const mockConnected = jest
        .spyOn(widget, "connectedCallback")
        .mockImplementation(async () => {});

      widget.attributeChangedCallback("widget", "old", "new");
      expect(mockConnected).not.toHaveBeenCalled();
    });

    test("calls connectedCallback when widget attribute changes", () => {
      const widget = new Test();
      widget.loaded = true;

      const mockConnected = jest
        .spyOn(widget, "connectedCallback")
        .mockImplementation(async () => {});

      widget.attributeChangedCallback("widget", "old", "new");
      expect(mockConnected).toHaveBeenCalled();
    });

    test("calls connectedCallback when locale attribute changes", () => {
      const widget = new Test();
      widget.loaded = true;

      const mockConnected = jest
        .spyOn(widget, "connectedCallback")
        .mockImplementation(async () => {});

      widget.attributeChangedCallback("locale", "en_CA", "en_US");
      expect(mockConnected).toHaveBeenCalled();
    });
  });

  describe("observedAttributes", () => {
    test("includes widget and locale", () => {
      expect(Test.observedAttributes).toEqual(["widget", "locale"]);
    });
  });
});
