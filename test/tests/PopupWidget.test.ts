import { DEFAULT_DOMAIN, DEFAULT_NPM_CDN } from "../../src/globals";
import { WidgetApi } from "../../src/squatch";
import PopupWidget from "../../src/widgets/PopupWidget";

beforeEach(() => {
  document.body.innerHTML = "";
  document.head.innerHTML = "";
});

declare global {
  var mockDebug: jest.Mock<any, any>;
}

jest.mock("debug", () => {
  // @ts-ignore
  global.mockDebug = jest.fn();
  // @ts-ignore
  return { ...jest.requireActual("debug"), debug: () => global.mockDebug };
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
    jest.useFakeTimers();
    document.body.innerHTML = "";
    // @ts-ignore
    window.squatchTenant = null;

    const config = widgetConfig();
    widget = new PopupWidget(config);
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  describe("_initialiseCTA", () => {
    test("success", () => {
      const button = document.createElement("button");
      button.className = "trigger";
      document.body.appendChild(button);

      const mockOpen = jest.spyOn(widget, "open").mockImplementation(() => {});

      widget.trigger = ".trigger";
      widget._initialiseCTA();

      expect(button.onclick).toBeInstanceOf(Function);

      expect(mockOpen).not.toHaveBeenCalled();
      button.click();
      expect(mockOpen).toHaveBeenCalled();
    });
    test("failure", () => {
      const mockQuerySelector = jest.spyOn(document, "querySelector");
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
  test("_createPopupDialog", () => {
    const dialog = widget._createPopupDialog();
    expect(dialog.id).toBe(widget.id);
    expect(dialog.style.width).toBe("100%");
    expect(dialog.style.maxWidth).toBe("500px");
    expect(dialog.style.border).toBe("none");
    expect(dialog.style.padding).toBe("0px");

    const mockClose = jest.spyOn(dialog, "close").mockImplementation(() => {});

    expect(mockClose).not.toHaveBeenCalled();
    dialog.click();
    expect(mockClose).toHaveBeenCalled();
  });
  describe("load", () => {
    test("success", async () => {
      const mockCTA = jest
        .spyOn(widget, "_initialiseCTA")
        .mockImplementation(() => {});
      const createDialogSpy = jest.spyOn(widget, "_createPopupDialog");
      const mockSetupResize = jest
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

      const mockCTA = jest
        .spyOn(widget, "_initialiseCTA")
        .mockImplementation(() => {});
      const mockFindElement = jest
        .spyOn(widget, "_findElement")
        .mockImplementation(() => document.querySelector("div#test")!);
      const createDialogSpy = jest.spyOn(widget, "_createPopupDialog");
      const mockSetupResize = jest
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

      const mockElement = jest
        .spyOn(widget, "_findElement")
        .mockImplementation(() => div);
      const mockCTA = jest
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
  });
});
