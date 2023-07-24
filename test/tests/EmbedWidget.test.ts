import { EmbedWidget, WidgetApi, ready } from "../../src/squatch";
import { DEFAULT_DOMAIN, DEFAULT_NPM_CDN } from "../../src/utils/validate";
import * as domutil from "../../src/utils/domready";
import Widget from "../../src/widgets/Widget";
import { waitUntil } from "@open-wc/testing-helpers";
// jest.useFakeTimers();
// jest.spyOn(global, "setTimeout");

describe("methods", () => {
  let widget!: EmbedWidget;

  beforeEach(() => {
    widget = new EmbedWidget({
      api: new WidgetApi({ tenantAlias: "TENANTALIAS" }),
      content: "<p>CONTENT</p>",
      context: { type: "upsert" },
      domain: DEFAULT_DOMAIN,
      npmCdn: DEFAULT_NPM_CDN,
      type: "w/widget-type",
    });
  });
  describe("load", () => {
    test("successful load", async () => {
      const div = document.createElement("div");
      div.id = "test";
      document.appendChild(div);

      const mockElement = jest
        .spyOn(widget, "_findElement")
        .mockImplementation(() => {
          return document.querySelector("#test") as HTMLElement;
        });

      // const mockDomready = jest
      //   .spyOn(domutil, "domready")
      //   .mockImplementation((frame, cb) => {
      //     cb();
      //     return 0;
      //   });

      const mockLoadEvent = jest.spyOn(Widget.prototype as any, "_loadEvent");

      widget.container = null;
      widget.load();

      await waitUntil(() => document.readyState === "complete");
      expect(mockElement).toHaveBeenCalled();
      // const element = document.body.querySelector("#test");
      // expect(element).not.toBeNull();

      const iframe = document?.querySelector("iframe") as HTMLIFrameElement;
      expect(iframe).toBeInstanceOf(HTMLIFrameElement);
      expect(div?.firstChild).toBe(iframe);

      expect(iframe?.contentDocument?.body.innerHTML).toContain(
        `resize-observer-polyfill@1.5.x`
      );
      expect(iframe?.contentDocument?.body.innerHTML).toContain(
        `<p>CONTENT</p>`
      );

      // expect(mockLoadEvent).toHaveBeenCalledTimes(1);
      // const frameDoc = iframe?.contentDocument;

      // expect(mockDomready.mock.calls[0][0]).toBe(frameDoc);
    });
  });
});
