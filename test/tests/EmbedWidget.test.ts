import { DEFAULT_DOMAIN, DEFAULT_NPM_CDN } from "../../src/globals";
import { EmbedWidget, WidgetApi } from "../../src/squatch";
import Widget from "../../src/widgets/Widget";

declare global {
  var mockDebug: jest.Mock<any, any>;
}

jest.mock("debug", () => {
  // @ts-ignore
  global.mockDebug = jest.fn();
  // @ts-ignore
  return { ...jest.requireActual("debug"), debug: () => global.mockDebug };
});

describe("methods", () => {
  let widget!: EmbedWidget;
  const widgetConfig = () => ({
    api: new WidgetApi({ tenantAlias: "TENANTALIAS" }),
    content: "<sqh-global-container>CONTENT</sqh-global-container>",
    context: {
      type: "upsert" as const,
      user: { accountId: "asdf", id: "asdf" },
    },
    domain: DEFAULT_DOMAIN,
    npmCdn: DEFAULT_NPM_CDN,
    type: "w/widget-type",
  });

  beforeEach(() => {
    jest.useFakeTimers();
    document.body.innerHTML = "";
    // @ts-ignore
    window.squatchTenant = null;

    const config = widgetConfig();
    widget = new EmbedWidget(config);
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  describe("load", () => {
    test("brandingConfig", async () => {
      const div = document.createElement("div");
      div.id = "test";
      document.body.appendChild(div);

      const config = widgetConfig();
      const widget = new EmbedWidget({
        ...config,
        context: {
          ...config.context,
          widgetConfig: {
            values: {
              brandingConfig: {
                widgetSize: {
                  embeddedWidgets: {
                    minWidth: { value: 100, unit: "%" },
                    maxWidth: { value: 600, unit: "px" },
                  },
                },
              },
            },
          },
        },
      });

      const mockElement = jest
        .spyOn(widget, "_findElement")
        .mockImplementation(() => {
          return document.querySelector("#test") as HTMLElement;
        });
      await widget.load();

      jest.runAllTimers();
      await Promise.resolve();

      expect(mockElement).toHaveBeenCalled();
      expect(div.style.minWidth).toBe("100%");
      expect(div.style.maxWidth).toBe("600px");
    });
    test.each([
      { hasChild: false, hasContainer: false },
      { hasChild: false, hasContainer: true },
      { hasChild: true, hasContainer: false },
      { hasChild: true, hasContainer: true },
    ])("successful load", async (args) => {
      const div = document.createElement("div");
      div.id = "test";
      if (args.hasChild) div.appendChild(document.createElement("span"));
      document.body.appendChild(div);

      const mockElement = jest
        .spyOn(widget, "_findElement")
        .mockImplementation(() => {
          return document.querySelector("#test") as HTMLElement;
        });

      const mockLoadEvent = jest.spyOn(Widget.prototype as any, "_loadEvent");

      widget.container = args.hasContainer ? ".container" : null;
      if (!args.hasContainer && args.hasChild) {
        await expect(widget.load).rejects.toThrow();
        return;
      } else {
        await widget.load();
      }

      jest.runAllTimers(); // domready settimeout
      await Promise.resolve();

      expect(mockElement).toHaveBeenCalled();

      const iframe = document?.querySelector("iframe") as HTMLIFrameElement;
      expect(iframe).toBeInstanceOf(HTMLIFrameElement);
      if (args.hasChild) expect(div?.firstChild).toBe(iframe);
      else
        expect(iframe?.contentDocument?.body.innerHTML).toContain(
          `resize-observer-polyfill@1.5.x`
        );
      expect(iframe?.contentDocument?.body.innerHTML).toContain(widget.content);

      expect(mockLoadEvent).toHaveBeenCalledTimes(args.hasContainer ? 0 : 1);
    });
    test("no contentWindow", async () => {
      const mockElement = jest
        .spyOn(widget, "_findElement")
        .mockImplementation(() => document.createElement("div"));

      await expect(async () => await widget.load()).rejects.toThrowError(
        "Frame needs a content window"
      );

      expect(mockElement).toHaveBeenCalledTimes(1);
    });
    test("text child", async () => {
      const div = document.createElement("div");
      div.id = "test";
      div.innerText = "TEXT";
      document.body.appendChild(div);

      const mockElement = jest
        .spyOn(widget, "_findElement")
        .mockImplementation(() => {
          return document.querySelector("#test") as HTMLElement;
        });

      const mockLoadEvent = jest.spyOn(Widget.prototype as any, "_loadEvent");

      widget.container = null;
      await widget.load();

      jest.runAllTimers(); // domready settimeout
      await Promise.resolve();

      expect(mockElement).toHaveBeenCalled();

      const iframe = document?.querySelector("iframe") as HTMLIFrameElement;
      expect(iframe).toBeInstanceOf(HTMLIFrameElement);
      expect(div?.lastChild).toBe(iframe);

      expect(iframe?.contentDocument?.body.innerHTML).toContain(
        `resize-observer-polyfill@1.5.x`
      );
      expect(iframe?.contentDocument?.body.innerHTML).toContain(widget.content);

      expect(mockLoadEvent).toHaveBeenCalledTimes(1);
    });
    test("manual container", async () => {
      const div = document.createElement("div");
      div.id = "test";
      document.body.appendChild(div);

      const config = widgetConfig();
      const widget = new EmbedWidget(config, "#test");

      const mockElement = jest
        .spyOn(widget, "_findElement")
        .mockImplementation(() => {
          return document.querySelector("#test") as HTMLElement;
        });

      const mockLoadEvent = jest.spyOn(Widget.prototype as any, "_loadEvent");

      await widget.load();

      jest.runAllTimers(); // domready settimeout
      await Promise.resolve();

      expect(mockElement).toHaveBeenCalled();

      const iframes = document.body?.querySelectorAll("iframe");
      expect(iframes?.length).toBe(1);
      const iframe = iframes?.[0];
      expect(iframe).toBeInstanceOf(HTMLIFrameElement);
      expect(div.lastChild).toBe(iframe);

      expect(iframe?.contentDocument?.body.innerHTML).toContain(
        `resize-observer-polyfill@1.5.x`
      );
      expect(iframe?.contentDocument?.body.innerHTML).toContain(widget.content);

      expect(mockLoadEvent).toHaveBeenCalledTimes(0);
    });
    test.each([{ replace: true }, { replace: false }])(
      "shadowRoot",
      async (args) => {
        const div = document.createElement("div");
        div.id = "test";
        div.attachShadow({ mode: "open" });
        if (args.replace && div.shadowRoot) {
          div.shadowRoot.innerHTML = `<iframe src="about:blank"></iframe>`;
        }
        document.body.appendChild(div);

        const mockElement = jest
          .spyOn(widget, "_findElement")
          .mockImplementation(() => {
            return document.querySelector("#test") as HTMLElement;
          });

        const mockLoadEvent = jest.spyOn(Widget.prototype as any, "_loadEvent");

        widget.container = "#test"; // Arbitrary due to mocked findElement
        await widget.load();

        jest.runAllTimers(); // domready settimeout
        await Promise.resolve();

        expect(mockElement).toHaveBeenCalled();

        const iframes = div.shadowRoot?.querySelectorAll("iframe");
        expect(iframes?.length).toBe(1);
        const iframe = iframes?.[0];
        expect(iframe).toBeInstanceOf(HTMLIFrameElement);
        expect(div?.shadowRoot?.lastChild).toBe(iframe);

        expect(iframe?.contentDocument?.body.innerHTML).toContain(
          `resize-observer-polyfill@1.5.x`
        );
        expect(iframe?.contentDocument?.body.innerHTML).toContain(
          widget.content
        );

        expect(mockLoadEvent).toHaveBeenCalledTimes(0);
      }
    );
    test.each([
      { container: null, result: true },
      { container: ".div", result: false },
      { container: document.createElement("div"), result: false },
      { container: document.createElement("squatch-embed"), result: true },
      { container: document.createElement("impact-embed"), result: true },
    ])("_shouldFireLoadEvent", async (args) => {
      widget.container = args.container;
      const result = widget["_shouldFireLoadEvent"]();
      expect(result).toBe(args.result);
    });
  });
  describe("open", () => {
    test.each([
      {
        context: { type: "upsert" as const, user: { accountId: "a", id: "a" } },
      },
      { context: { type: "passwordless" as const } },
    ])("success", (args) => {
      const div = document.createElement("div");
      div.id = "test";
      document.body.appendChild(div);

      const iframe = document.createElement("iframe");
      iframe.src = "about:blank";
      document.body.appendChild(iframe);

      iframe.contentDocument?.open();
      iframe.contentDocument?.write(
        `<html><head><script>window.widgetIdent = "widgetIdent";</script></head><body></body></html>`
      );
      iframe.contentDocument?.close();

      const mockElement = jest
        .spyOn(widget, "_findElement")
        .mockImplementation(() => document.body.querySelector("#test")!);

      const mockFindFrame = jest
        .spyOn(widget, "_findFrame")
        .mockImplementation(() => document.body.querySelector("iframe")!);

      const mockLoadEvent = jest
        .spyOn(Widget.prototype as any, "_loadEvent")
        .mockImplementation(() => {});

      widget.context = args.context;
      widget.open();

      expect(mockFindFrame).toHaveBeenCalledTimes(1);
      expect(mockElement).toHaveBeenCalledTimes(1);

      expect(div.style.visibility).toBe("unset");
      expect(div.style.height).toBe("auto");
      expect(div.style["overflow-y"]).toBe("auto");

      if (args.context.user) {
        expect(mockLoadEvent).toHaveBeenCalledTimes(1);
        expect(mockLoadEvent).toHaveBeenCalledWith("widgetIdent");
      } else expect(mockLoadEvent).toHaveBeenCalledTimes(0);
    });
    test("no frame", () => {
      const mockFindFrame = jest
        .spyOn(widget, "_findFrame")
        .mockImplementation(() => null);

      const mockElement = jest
        .spyOn(widget, "_findElement")
        .mockImplementation(() => document.body.querySelector("#test")!);

      widget.open();

      expect(mockElement).not.toHaveBeenCalled();
      // @ts-ignore
      expect(global.mockDebug).toHaveBeenCalledWith(
        "no target element to open"
      );
      expect(mockFindFrame).toHaveBeenCalled();
    });
    test("broken frame", () => {
      const mockFindFrame = jest
        .spyOn(widget, "_findFrame")
        .mockImplementation(() => document.createElement("iframe"));

      const mockElement = jest
        .spyOn(widget, "_findElement")
        .mockImplementation(() => document.body.querySelector("#test")!);

      widget.open();

      expect(mockElement).not.toHaveBeenCalled();
      // @ts-ignore
      expect(global.mockDebug).toHaveBeenCalledWith(
        "Frame needs a content window"
      );
      expect(mockFindFrame).toHaveBeenCalled();
    });
  });
  describe("close", () => {
    test("success", () => {
      const iframe = document.createElement("iframe");
      iframe.src = "about:blank";
      document.body.appendChild(iframe);

      const div = document.createElement("div");
      div.id = "test";
      document.body.appendChild(div);

      const mockElement = jest
        .spyOn(widget, "_findElement")
        .mockImplementation(() => document.querySelector("#test")!);

      const mockFindFrame = jest
        .spyOn(widget, "_findFrame")
        .mockImplementation(() => document.querySelector("iframe"));

      widget.close();

      expect(mockFindFrame).toHaveBeenCalled();
      expect(mockElement).toHaveBeenCalled();

      expect(div.style.visibility).toBe("hidden");
      expect(div.style.height).toBe("0px");
      expect(div.style["overflow-y"]).toBe("hidden");

      // @ts-ignore
      expect(global.mockDebug).toHaveBeenCalledWith("Embed widget closed");
    });
    test("no frame", () => {
      const mockFindFrame = jest
        .spyOn(widget, "_findFrame")
        .mockImplementation(() => null);

      const mockElement = jest
        .spyOn(widget, "_findElement")
        .mockImplementation(() => document.body.querySelector("#test")!);

      widget.close();

      expect(mockFindFrame).toHaveBeenCalled();
      // @ts-ignore
      expect(global.mockDebug).toHaveBeenCalledWith(
        "no target element to close"
      );
      expect(mockElement).not.toHaveBeenCalled();
    });
  });
  test("error", () => {
    const mockError = jest.spyOn(Widget.prototype as any, "_error");

    widget["_error"]("201");
    expect(mockError).toHaveBeenCalledWith("201", "embed", "");

    widget["_error"]("201", "asdf", "asdf");
    expect(mockError).toHaveBeenCalledWith("201", "asdf", "asdf");
  });
});
