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
        const result = widget["_setWidget"]("asdf", { type: "passwordless" });

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
        const result = widget["_setWidget"]("asdf", { type: "passwordless" });

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
});
