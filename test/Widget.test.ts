import { WidgetApi } from "../src/squatch";
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
  beforeAll(() => {
    widget = new TestWidget({
      api: new WidgetApi({ tenantAlias: TENANT_ALIAS }),
      content: "<p>TEST_WIDGET_CONTENT",
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

  // test.todo("findElement", () => {
  //   // const element = widget._findElement();
  // });

  afterAll(() => {
    // @ts-ignore
    widget = null;
  });
});
