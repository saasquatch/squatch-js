import { EmbedWidget, WidgetApi } from "../../src/squatch";
import { DEFAULT_DOMAIN, DEFAULT_NPM_CDN } from "../../src/utils/validate";
import Widget from "../../src/widgets/Widget";

describe("methods", () => {
  let widget!: EmbedWidget;

  beforeEach(() => {
    jest.useFakeTimers();
    document.body.innerHTML = "";

    widget = new EmbedWidget({
      api: new WidgetApi({ tenantAlias: "TENANTALIAS" }),
      content: "<sqh-global-container>CONTENT</sqh-global-container>",
      context: { type: "upsert", user: { accountId: "asdf", id: "asdf" } },
      domain: DEFAULT_DOMAIN,
      npmCdn: DEFAULT_NPM_CDN,
      type: "w/widget-type",
    });
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  describe("load", () => {
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
    test.skip.each([
      { replace: true, declarativeWidget: true },
      { replace: true, declarativeWidget: false },
      { replace: false, declarativeWidget: true },
      { replace: false, declarativeWidget: false },
    ])("shadowRoot", async (args) => {
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

      if (args.declarativeWidget) {
        widget.container = document.createElement("squatch-embed");
      } else {
        widget.container = ".container";
      }
      await widget.load();

      jest.runAllTimers(); // domready settimeout
      await Promise.resolve();

      expect(mockElement).toHaveBeenCalled();

      const iframes = (
        args.replace ? div.shadowRoot : document
      )?.querySelectorAll("iframe");
      expect(iframes?.length).toBe(1);
      const iframe = iframes?.[0];
      expect(iframe).toBeInstanceOf(HTMLIFrameElement);
      if (args.replace) expect(div?.shadowRoot?.lastChild).toBe(iframe);
      else expect(div.lastChild).toBe(iframe);

      expect(iframe?.contentDocument?.body.innerHTML).toContain(
        `resize-observer-polyfill@1.5.x`
      );
      expect(iframe?.contentDocument?.body.innerHTML).toContain(widget.content);

      if (args.declarativeWidget)
        expect(mockLoadEvent).toHaveBeenCalledTimes(1);
      else expect(mockLoadEvent).toHaveBeenCalledTimes(0);
    });
  });
});
