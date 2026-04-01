import { type Mock } from "vitest";
import { DEFAULT_DOMAIN, DEFAULT_NPM_CDN } from "../../src/globals";
import { WidgetApi } from "../../src/squatch";
import PopupWidget from "../../src/widgets/PopupWidget";

beforeEach(() => {
  document.body.innerHTML = "";
  document.head.innerHTML = "";
});

declare global {
  var mockDebug: Mock;
}

vi.mock("../../src/utils/logger", () => {
  // @ts-ignore
  global.mockDebug = vi.fn();
  return {
    debug: () => global.mockDebug,
    enableDebug: vi.fn(),
    disableDebug: vi.fn(),
  };
});

test("constructor", () => {
  const widget1 = new PopupWidget({
    api: new WidgetApi({ tenantAlias: "tenantalias" }),
    content: "<p>CONTENT</p>",
    context: { type: "upsert" as const },
    domain: DEFAULT_DOMAIN,
    npmCdn: DEFAULT_NPM_CDN,
    type: "widgetType",
  });

  expect(widget1.id).toBe("squatchModal");
  expect(widget1.trigger).toBe(".squatchpop");
  expect(document.head.innerHTML).toContain(
    "::-webkit-scrollbar { display: none; }"
  );

  const widget2 = new PopupWidget(
    {
      api: new WidgetApi({ tenantAlias: "tenantalias" }),
      content: "<p>CONTENT</p>",
      context: { type: "upsert" as const },
      domain: DEFAULT_DOMAIN,
      npmCdn: DEFAULT_NPM_CDN,
      type: "widgetType",
    },
    ".trigger"
  );
  expect(widget2.id).toBe("squatchModal__1");
  expect(widget2.trigger).toBe(".trigger");

  const widget3 = new PopupWidget({
    api: new WidgetApi({ tenantAlias: "tenantalias" }),
    content: "<p>CONTENT</p>",
    context: { type: "upsert" as const },
    domain: DEFAULT_DOMAIN,
    npmCdn: DEFAULT_NPM_CDN,
    type: "widgetType",
    container: ".container",
  });
  expect(widget3.id).toBe("squatchModal");
  expect(widget3.container).toBe(".container");
});
describe("methods", () => {
  let widget!: PopupWidget;
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
    vi.useFakeTimers();
    document.body.innerHTML = "";
    // @ts-ignore
    window.squatchTenant = null;

    const config = widgetConfig();
    widget = new PopupWidget(config);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });
  describe("_initialiseCTA", () => {
    test("success", () => {
      const button = document.createElement("button");
      button.className = "trigger";
      document.body.appendChild(button);

      const mockOpen = vi.spyOn(widget, "open").mockImplementation(() => {});

      widget.trigger = ".trigger";
      widget._initialiseCTA();

      expect(button.onclick).toBeInstanceOf(Function);

      expect(mockOpen).not.toHaveBeenCalled();
      button.click();
      expect(mockOpen).toHaveBeenCalled();
    });
    test("failure", () => {
      const mockQuerySelector = vi.spyOn(document, "querySelector");
      widget.trigger = null;
      widget._initialiseCTA();
      expect(mockQuerySelector).not.toHaveBeenCalled();

      widget.trigger = ".trigger";
      widget._initialiseCTA();

      // @ts-ignore
      expect(global.mockDebug).toHaveBeenCalledWith(
        "No element found with trigger selector",
        ".trigger"
      );

      widget.trigger = "#####";
      widget._initialiseCTA();

      // @ts-ignore
      expect(global.mockDebug).toHaveBeenCalledWith(
        "Not a valid selector",
        "#####"
      );
    });
  });
  describe("_createPopupDialog", () => {
    test("default", () => {
      const dialog = widget._createPopupDialog();
      expect(dialog.id).toBe(widget.id);
      expect(dialog.style.width).toBe("100%");
      expect(dialog.style.maxWidth).toBe("500px");
      expect(dialog.style.getPropertyValue("border")).toContain("none");
      expect(dialog.style.padding).toBe("0px");

      const mockClose = vi
        .spyOn(dialog, "close")
        .mockImplementation(() => {});

      expect(mockClose).not.toHaveBeenCalled();
      dialog.click();
      expect(mockClose).toHaveBeenCalled();
    });
    test("brandingConfig", () => {
      const config = widgetConfig();
      const newWidget = new PopupWidget({
        ...config,
        context: {
          ...config.context,
          widgetConfig: {
            values: {
              brandingConfig: {
                widgetSize: {
                  popupWidgets: {
                    minWidth: { value: 100, unit: "px" },
                    maxWidth: { value: 100, unit: "%" },
                  },
                },
              },
            },
          },
        },
      });

      const dialog = newWidget._createPopupDialog(
        newWidget.context.widgetConfig?.values?.brandingConfig
      );
      expect(dialog.style.width).toBe("100%");
      expect(dialog.style.minWidth).toBe("100px");
      expect(dialog.style.maxWidth).toBe("100%");
    });
  });
  describe("load", () => {
    test("success", async () => {
      const mockCTA = vi
        .spyOn(widget, "_initialiseCTA")
        .mockImplementation(() => {});
      const createDialogSpy = vi.spyOn(widget, "_createPopupDialog");
      const mockSetupResize = vi
        .spyOn(PopupWidget.prototype as any, "_setupResizeHandler")
        .mockImplementation(() => {});

      await widget.load();
      expect(mockCTA).toHaveBeenCalled();
      expect(createDialogSpy).toHaveBeenCalled();

      const dialog = document.body.querySelector("dialog");
      expect(dialog).not.toBeNull();

      const iframe = dialog?.querySelector("iframe");
      expect(iframe).not.toBeNull();
      expect(iframe!.contentDocument!.body.innerHTML).toContain(widget.content);

      // @ts-ignore
      expect(global.mockDebug).toHaveBeenCalledWith(
        "Popup template loaded into iframe"
      );
      expect(mockSetupResize).toHaveBeenCalled();
    });
    test.each([
      { shadowRoot: true, replace: true },
      { shadowRoot: true, replace: false },
      { shadowRoot: false, replace: true },
      { shadowRoot: false, replace: false },
    ])("with container", async (args) => {
      const div = document.createElement("div");
      div.id = "test";
      if (args.shadowRoot) {
        div.attachShadow({ mode: "open" });
      }
      if (args.replace) {
        if (args.shadowRoot) div.shadowRoot!.innerHTML = "<dialog></dialog>";
        else div.innerHTML = "<dialog></dialog>";
      }
      document.body.appendChild(div);

      const mockCTA = vi
        .spyOn(widget, "_initialiseCTA")
        .mockImplementation(() => {});
      const mockFindElement = vi
        .spyOn(widget, "_findElement")
        .mockImplementation(() => document.querySelector("div#test")!);
      const createDialogSpy = vi.spyOn(widget, "_createPopupDialog");
      const mockSetupResize = vi
        .spyOn(PopupWidget.prototype as any, "_setupResizeHandler")
        .mockImplementation(() => {});

      widget.container = ".container";
      await widget.load();

      expect(mockCTA).toHaveBeenCalled();
      expect(mockFindElement).toHaveBeenCalled();
      expect(createDialogSpy).toHaveBeenCalled();

      const element = args.shadowRoot ? div.shadowRoot : div;

      const dialog = element!.querySelector("dialog");
      expect(dialog).not.toBeNull();
      if (args.shadowRoot) expect(div.shadowRoot!.lastChild).toBe(dialog);
      else expect(div.lastChild).toBe(dialog);

      const iframe = dialog?.querySelector("iframe");
      expect(iframe).not.toBeNull();
      expect(iframe!.contentDocument!.body.innerHTML).toContain(widget.content);
      expect(dialog?.lastChild).toBe(iframe);

      // @ts-ignore
      expect(global.mockDebug).toHaveBeenCalledWith(
        "Popup template loaded into iframe"
      );
      expect(mockSetupResize).toHaveBeenCalled();
    });
    test("broken iframe", async () => {
      const div = document.createElement("div");
      div.id = "test";

      const mockElement = vi
        .spyOn(widget, "_findElement")
        .mockImplementation(() => div);
      const mockCTA = vi
        .spyOn(widget, "_initialiseCTA")
        .mockImplementation(() => {});

      widget.container = ".container";
      await expect(async () => await widget.load()).rejects.toThrowError(
        "Frame needs a content window"
      );

      expect(mockCTA).toHaveBeenCalled();
      expect(mockElement).toHaveBeenCalled();

      const iframe = div.querySelector("iframe");
      expect(iframe).not.toBeNull();
      expect(iframe?.contentWindow).toBeNull();
    });
    test("error content is written standalone", async () => {
      const config = widgetConfig();
      const errorWidget = new PopupWidget({
        ...config,
        content: "error",
      });

      const mockCTA = vi
        .spyOn(errorWidget, "_initialiseCTA")
        .mockImplementation(() => {});
      const mockSetupResize = vi
        .spyOn(PopupWidget.prototype as any, "_setupResizeHandler")
        .mockImplementation(() => {});

      await errorWidget.load();

      const dialog = document.body.querySelector("dialog");
      const iframe = dialog?.querySelector("iframe");
      const html = iframe?.contentDocument?.documentElement.innerHTML || "";
      expect(html).toContain("Our referral program is temporarily unavailable.");
      expect(html).not.toContain("dns-prefetch");

      // @ts-ignore
      expect(global.mockDebug).toHaveBeenCalledWith(
        "Popup error template loaded into iframe"
      );
      expect(mockSetupResize).not.toHaveBeenCalled();
    });
    test("width branding on dialog", async () => {
      const div = document.createElement("div");
      div.id = "test";
    });
    test("initialHeight from brandingConfig", async () => {
      const config = widgetConfig();
      const widgetWithHeight = new PopupWidget({
        ...config,
        context: {
          ...config.context,
          widgetConfig: {
            values: {
              brandingConfig: {
                loadingHeight: 350,
              },
            },
          },
        },
      });

      const mockCTA = vi
        .spyOn(widgetWithHeight, "_initialiseCTA")
        .mockImplementation(() => {});
      const mockSetupResize = vi
        .spyOn(PopupWidget.prototype as any, "_setupResizeHandler")
        .mockImplementation(() => {});

      await widgetWithHeight.load();

      const dialog = document.body.querySelector("dialog");
      const iframe = dialog?.querySelector("iframe");
      expect(iframe).not.toBeNull();
      expect(iframe!.style.height).toBe("350px");
    });
    test("cloudinary preconnect links are always present", async () => {
      const mockCTA = vi
        .spyOn(widget, "_initialiseCTA")
        .mockImplementation(() => {});
      const mockSetupResize = vi
        .spyOn(PopupWidget.prototype as any, "_setupResizeHandler")
        .mockImplementation(() => {});

      await widget.load();

      const dialog = document.body.querySelector("dialog");
      const iframe = dialog?.querySelector("iframe");
      const html = iframe?.contentDocument?.documentElement.innerHTML || "";
      expect(html).toContain('dns-prefetch');
      expect(html).toContain('https://res.cloudinary.com');
    });
    test("brand font preconnect links when brandFont is configured", async () => {
      const config = widgetConfig();
      const widgetWithFont = new PopupWidget({
        ...config,
        context: {
          ...config.context,
          widgetConfig: {
            values: {
              brandingConfig: {
                main: { brandFont: "Open Sans" },
              },
            },
          },
        },
      });

      const mockCTA = vi
        .spyOn(widgetWithFont, "_initialiseCTA")
        .mockImplementation(() => {});
      const mockSetupResize = vi
        .spyOn(PopupWidget.prototype as any, "_setupResizeHandler")
        .mockImplementation(() => {});

      await widgetWithFont.load();

      const dialog = document.body.querySelector("dialog");
      const iframe = dialog?.querySelector("iframe");
      const html = iframe?.contentDocument?.documentElement.innerHTML || "";
      expect(html).toContain('fonts.gstatic.com');
      expect(html).toContain('fonts.googleapis.com');
      expect(html).toContain('family=Open%20Sans');
    });
    test("no brand font preconnect links when brandFont is not configured", async () => {
      const mockCTA = vi
        .spyOn(widget, "_initialiseCTA")
        .mockImplementation(() => {});
      const mockSetupResize = vi
        .spyOn(PopupWidget.prototype as any, "_setupResizeHandler")
        .mockImplementation(() => {});

      await widget.load();

      const dialog = document.body.querySelector("dialog");
      const iframe = dialog?.querySelector("iframe");
      const html = iframe?.contentDocument?.documentElement.innerHTML || "";
      expect(html).not.toContain('fonts.gstatic.com');
    });
    test("skeleton preload is present when mint-components dependency exists", async () => {
      const config = widgetConfig();
      const mintWidget = new PopupWidget({
        ...config,
        content: "<sqm-brand><script src='mint-components'></script></sqm-brand>",
      });

      const mockCTA = vi
        .spyOn(mintWidget, "_initialiseCTA")
        .mockImplementation(() => {});
      const mockSetupResize = vi
        .spyOn(PopupWidget.prototype as any, "_setupResizeHandler")
        .mockImplementation(() => {});

      await mintWidget.load();

      const dialog = document.body.querySelector("dialog");
      const iframe = dialog?.querySelector("iframe");
      const html = iframe?.contentDocument?.documentElement.innerHTML || "";
      expect(html).toContain('sq-preload');
    });
    test("skeleton preload is not present without mint-components", async () => {
      const mockCTA = vi
        .spyOn(widget, "_initialiseCTA")
        .mockImplementation(() => {});
      const mockSetupResize = vi
        .spyOn(PopupWidget.prototype as any, "_setupResizeHandler")
        .mockImplementation(() => {});

      await widget.load();

      const dialog = document.body.querySelector("dialog");
      const iframe = dialog?.querySelector("iframe");
      const html = iframe?.contentDocument?.documentElement.innerHTML || "";
      expect(html).not.toContain('sq-preload');
    });
    test("dialog receives brandingConfig width sizing", async () => {
      const config = widgetConfig();
      const widgetWithSizes = new PopupWidget({
        ...config,
        context: {
          ...config.context,
          widgetConfig: {
            values: {
              brandingConfig: {
                widgetSize: {
                  popupWidgets: {
                    minWidth: { value: 200, unit: "px" },
                    maxWidth: { value: 700, unit: "px" },
                  },
                },
              },
            },
          },
        },
      });

      const mockCTA = vi
        .spyOn(widgetWithSizes, "_initialiseCTA")
        .mockImplementation(() => {});
      const mockSetupResize = vi
        .spyOn(PopupWidget.prototype as any, "_setupResizeHandler")
        .mockImplementation(() => {});

      await widgetWithSizes.load();

      const dialog = document.body.querySelector("dialog");
      expect(dialog).not.toBeNull();
      expect(dialog!.style.minWidth).toBe("200px");
      expect(dialog!.style.maxWidth).toBe("700px");
    });
  });
});
