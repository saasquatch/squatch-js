import { EmbedWidget, WidgetApi } from "../src/squatch";
import { DEFAULT_DOMAIN, DEFAULT_NPM_CDN } from "../src/utils/validate";

describe("testing", () => {
  test("load function", () => {
    const widget = new EmbedWidget({
      api: new WidgetApi({ tenantAlias: "TENANTALIAS" }),
      content: "<p>CONTENT</p>",
      context: { type: "upsert" },
      domain: DEFAULT_DOMAIN,
      npmCdn: DEFAULT_NPM_CDN,
      type: "w/widget-type",
    });
    const frame = widget._createFrame();
    expect(async () => await widget.load()).rejects.toThrowError();
  });
});
