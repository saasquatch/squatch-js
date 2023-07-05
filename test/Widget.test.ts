import WidgetApi from "../src/api/WidgetApi";
import { DEFAULT_DOMAIN, DEFAULT_NPM_CDN } from "../src/utils/validate";
import Widget, { Params } from "../src/widgets/Widget";

const TENANT_ALIAS = "test_a8b41jotf8a1v";
const WIDGET_TYPE = "w/ir-tester";
const DOMAIN = "https://app.referralsaasquatch.com";

class TestWidget extends Widget {
  constructor(params: Params) {
    super(params);
  }
  load() {}
}

describe("Widget methods", () => {
  let widget: TestWidget;
  beforeEach(() => {
    widget = new TestWidget({
      api: new WidgetApi({ tenantAlias: TENANT_ALIAS }),
      content: "<p>TEST_WIDGET_CONTENT</p>",
      context: { type: "upsert" },
      domain: DEFAULT_DOMAIN,
      npmCdn: DEFAULT_NPM_CDN,
      type: WIDGET_TYPE,
    });
  });
  test("Frame is generated correctly", () => {
    const frame = widget._createFrame();

    expect(frame).not.toBe(null);
    expect(frame.tagName).toBe("IFRAME");
    expect(frame["squatchJsApi"]).toBeInstanceOf(TestWidget);
  });

  describe("_findElement", () => {
    test("no container, has default element", () => {
      document.body.innerHTML = `<div id="squatchembed"></div>`;

      const el = widget._findElement();
      expect(el.tagName).toBe("DIV");
      expect(el.id).toBe("squatchembed");

      document.body.innerHTML = `<div class="squatchembed"></div>`;

      const el_class = widget._findElement();
      expect(el_class.tagName).toBe("DIV");
      expect(el_class.className).toBe("squatchembed");
    });

    test("no container, no default", () => {
      expect(() => widget._findElement()).toThrowError("not found");
    });

    test("HtmlElement container", () => {
      const div = document.createElement("div");
      widget.container = div;

      const el = widget._findElement();
      expect(el).toBeDefined();
      expect(el).toBe(div);
    });

    test("Invalid container selector", () => {
      // @ts-ignore
      widget.container = 1234;
      expect(() => widget._findElement()).toThrowError("not found");
    });

    test("Manual container selector", () => {
      document.body.innerHTML = `<div class="asdf"></div>`;
      widget.container = ".asdf";
      expect(widget._findElement().className).toBe("asdf");

      document.body.innerHTML = `<a>asdf</a>`;
      widget.container = "a";
      expect(widget._findElement().tagName).toBe("A");

      document.body.innerHTML = `<div id="WRONG_ID"></div>`;
      widget.container = "#ID";
      expect(() => widget._findElement()).toThrowError("not found");
    });

    afterEach(() => {
      document.body.innerHTML = "";
      widget.container = null;
    });
  });

  afterEach(() => {
    // @ts-ignore
    widget = null;
  });
});
