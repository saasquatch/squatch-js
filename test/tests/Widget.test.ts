import WidgetApi from "../../src/api/WidgetApi";
import { DEFAULT_DOMAIN, DEFAULT_NPM_CDN } from "../../src/globals";
import { EmbedWidget, EngagementMedium } from "../../src/squatch";
import Widget, { Params } from "../../src/widgets/Widget";

const TENANT_ALIAS = "test_a8b41jotf8a1v";
const WIDGET_TYPE = "w/ir-tester";
const DOMAIN = "https://app.referralsaasquatch.com";

class TestWidget extends Widget {
  constructor(params: Params) {
    super(params);
  }
  load() {}
  open() {}
}
const validSqh = {
  analytics: {
    attributes: {
      tenant: "tenant",
      accountId: "accountId",
      userId: "userId",
    },
  },
  mode: {
    widgetMode: "POPUP",
  },
};

test("Error widget", () => {
  const widget = new TestWidget({
    api: new WidgetApi({ tenantAlias: TENANT_ALIAS }),
    content: "error",
    context: { type: "upsert" },
    domain: DEFAULT_DOMAIN,
    npmCdn: DEFAULT_NPM_CDN,
    type: WIDGET_TYPE,
  });

  expect(widget.content).toContain(
    "Our referral program is temporarily unavailable."
  );
});
describe("Widget methods", () => {
  let widget: TestWidget;
  beforeEach(() => {
    widget = new TestWidget({
      api: new WidgetApi({ tenantAlias: TENANT_ALIAS }),
      content: "<p>DEFAULT_WIDGET_CONTENT</p>",
      context: { type: "upsert" },
      domain: DEFAULT_DOMAIN,
      npmCdn: DEFAULT_NPM_CDN,
      type: WIDGET_TYPE,
    });
  });
  test("_createFrame", () => {
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

  describe("_findFrame", () => {
    test("iframe exists", () => {
      const div = document.createElement("div");
      div.setAttribute("class", "squatchembed");
      document.body.appendChild(div);

      const element = widget._findElement();
      const iframe = widget._createFrame();
      element.appendChild(iframe);

      const foundFrame = widget._findFrame();
      expect(foundFrame).not.toBeNull();
      expect(foundFrame).toBeInstanceOf(HTMLIFrameElement);
    });
  });

  describe("_loadEvent", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("No load config", () => {
      let mock = jest.spyOn(widget.analyticsApi, "pushAnalyticsLoadEvent");
      // @ts-ignore
      expect(widget["_loadEvent"]()).toBeUndefined();
      expect(mock).not.toBeCalled();
    });
    test("Invalid load config type", () => {
      let mock = jest.spyOn(widget.analyticsApi, "pushAnalyticsLoadEvent");
      // @ts-ignore
      expect(() => widget["_loadEvent"]("asdf")).toThrow();
      expect(mock).not.toBeCalled();
    });
    test("Invalid load config", () => {
      let mock = jest.spyOn(widget.analyticsApi, "pushAnalyticsLoadEvent");
      // @ts-ignore
      expect(() => widget["_loadEvent"]({})).toThrow();
      expect(mock).not.toBeCalled();
    });
    test("Invalid program load config", () => {
      let mock = jest.spyOn(widget.analyticsApi, "pushAnalyticsLoadEvent");
      // @ts-ignore
      expect(() => widget["_loadEvent"]({ programId: "string" })).toThrow();
      expect(mock).not.toBeCalled();
    });
    test("Valid program load config", () => {
      const obj = {
        tenantAlias: "ta",
        accountId: "accountId",
        userId: "userId",
        engagementMedium: "engagementMedium",
        programId: "programId",
      };
      let mock = jest.spyOn(widget.analyticsApi, "pushAnalyticsLoadEvent");
      // @ts-ignore
      widget["_loadEvent"](obj);
      expect(mock).toBeCalledTimes(1);
    });
    test("Valid analytics load config", async () => {
      let mock = jest
        .spyOn(widget.analyticsApi, "pushAnalyticsLoadEvent")
        .mockImplementation(
          async () => await new Promise((res) => res("response"))
        );
      // @ts-ignore
      widget["_loadEvent"](validSqh);
      expect(mock).toBeCalledTimes(1);
    });
    test("Valid analytics load config request failure", async () => {
      let mock = jest
        .spyOn(widget.analyticsApi, "pushAnalyticsLoadEvent")
        .mockImplementation(() => new Promise((res, rej) => rej("error")));

      expect(widget["_loadEvent"](validSqh)).resolves;
      expect(mock).toBeCalledTimes(1);
    });
  });

  describe("_shareEvent", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("Invalid param", () => {
      let mock = jest.spyOn(
        widget.analyticsApi,
        "pushAnalyticsShareClickedEvent"
      );

      widget["_shareEvent"](undefined, undefined);
      expect(mock).toBeCalledTimes(0);
    });
    test("Invalid config", () => {
      let mock = jest.spyOn(
        widget.analyticsApi,
        "pushAnalyticsShareClickedEvent"
      );
      expect(() => widget["_shareEvent"]({}, "medium")).toThrow();
      expect(mock).toBeCalledTimes(0);
    });
    test("Valid config, resolved request", async () => {
      let mock = jest
        .spyOn(widget.analyticsApi, "pushAnalyticsShareClickedEvent")
        .mockImplementation(() => new Promise((res) => res("Success")));

      widget["_shareEvent"](validSqh, "medium");
      expect(mock).toBeCalledTimes(1);
    });
    test("Valid config, rejected request", async () => {
      let mock = jest
        .spyOn(widget.analyticsApi, "pushAnalyticsShareClickedEvent")
        .mockImplementation(() => new Promise((res, rej) => rej("Error")));

      expect(widget["_shareEvent"](validSqh, "medium")).resolves;
      expect(mock).toBeCalledTimes(1);
    });
  });

  describe("_error", () => {
    test("Fill in of params", () => {
      const rs = "400";
      const mode = "modal";
      const style = "color: black;";

      const errorHtml = widget["_error"](rs, mode, style);
      expect(errorHtml).toContain(rs);
      expect(errorHtml).toContain(mode);
      expect(errorHtml).toContain(style);
    });
  });

  describe("_findInnerContainer", () => {
    beforeEach(() => {
      document.body.innerHTML = "";
    });
    test("Invalid frame", async () => {
      await expect(
        // @ts-ignore
        async () => await widget["_findInnerContainer"]({})
      ).rejects.toThrow();
    });
    test("Find container of frame, sqh-global-container", async () => {
      const frame = widget._createFrame();
      document.body.appendChild(frame);
      frame.contentDocument?.write(
        `<sqh-global-container></sqh-global-container>`
      );

      const container = await widget["_findInnerContainer"](frame);
      expect(container).toBeInstanceOf(HTMLElement);
      expect(container.tagName).toBe("SQH-GLOBAL-CONTAINER");
    });
    test("Find container of frame, squatch-container", async () => {
      const frame = widget._createFrame();
      document.body.appendChild(frame);
      frame.contentDocument?.write(`<div class="squatch-container"></div>`);

      // @ts-ignore
      const container = await widget["_findInnerContainer"](frame);
      expect(container).toBeInstanceOf(HTMLElement);
      expect(container.className).toBe("squatch-container");
    });
    test("Find container of frame, empty frame", async () => {
      const frame = widget._createFrame();
      document.body.appendChild(frame);

      const container = await widget["_findInnerContainer"](frame);
      expect(container).toBeInstanceOf(HTMLElement);
      expect(container.tagName).toBe("BODY");
    });
    test("Find container of frame, framebody default", async () => {
      const frame = widget._createFrame();
      document.body.appendChild(frame);
      frame.contentDocument?.write(`<div></div>`);

      // @ts-ignore
      const container = await widget["_findInnerContainer"](frame);
      expect(container).toBeInstanceOf(HTMLElement);
      expect(container).toBe(frame.contentDocument?.body);
    });
  });

  describe("reload", () => {
    beforeEach(() => {
      document.body.innerHTML = "";
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("no iframe", () => {
      const div = document.createElement("div");
      div.setAttribute("class", "squatchembed");
      document.body.appendChild(div);

      // const element = widget._findElement();
      // const iframe = widget._createFrame();
      // element.appendChild(iframe);

      expect(() =>
        widget.reload(
          { email: "john@example.com", firstName: "asdf", lastName: "asdf" },
          "asdf"
        )
      ).toThrow();
    });
    test("invalid iframe", () => {
      const mock = jest
        .spyOn(widget, "_findFrame")
        .mockImplementation(() => document.createElement("iframe"));

      expect(() =>
        widget.reload(
          { email: "john@example.com", firstName: "asdf", lastName: "asdf" },
          "asdf"
        )
      ).toThrowError("Frame needs a content window");
    });
    test("with iframe, no user context", () => {
      const div = document.createElement("div");
      div.setAttribute("class", "squatchembed");
      document.body.appendChild(div);

      const element = widget._findElement();
      const iframe = widget._createFrame();
      element.appendChild(iframe);

      expect(() =>
        widget.reload(
          { email: "john@example.com", firstName: "asdf", lastName: "asdf" },
          "asdf"
        )
      ).toThrow();
    });

    test.each([
      { email: "john@example.com", firstName: "asdf", lastName: "asdf" },
      { email: undefined, firstName: undefined, lastName: undefined },
    ])("with iframe, user context, upsert resolves", async (param) => {
      const upsertMock = jest
        .spyOn(widget.widgetApi, "upsertUser")
        .mockImplementation(
          () => new Promise((res) => res({ template: "asdf" }))
        );

      const div = document.createElement("div");
      div.setAttribute("class", "squatchembed");
      document.body.appendChild(div);

      const element = widget._findElement();
      const iframe = widget._createFrame();
      element.appendChild(iframe);

      widget.context = {
        type: "upsert",
        user: {
          accountId: "asdf",
          id: "asdf",
        },
      };

      await widget.reload(param, "asdf");

      expect(upsertMock).toBeCalledTimes(1);
      expect(widget.content).toBe("asdf");
    });
    test("with iframe, render resolves", async () => {
      const upsertMock = jest
        .spyOn(widget.widgetApi, "render")
        .mockImplementation(
          () => new Promise((res) => res({ template: "asdf" }))
        );

      const div = document.createElement("div");
      div.setAttribute("class", "squatchembed");
      document.body.appendChild(div);

      const element = widget._findElement();
      const iframe = widget._createFrame();
      element.appendChild(iframe);

      widget.context = {
        type: "passwordless",
      };

      await widget.reload(
        { email: "john@example.com", firstName: "asdf", lastName: "asdf" },
        "asdf"
      );

      expect(upsertMock).toBeCalledTimes(1);
      expect(widget.content).toBe("asdf");
    });
    test.each([
      { type: "w/widget-type", engagementMedium: "EMBED" },
      { type: "REFERRER_WIDGET", engagementMedium: "POPUP" },
    ])(
      "with iframe, render resolves, legacy register occurs",
      async (param) => {
        const upsertMock = jest
          .spyOn(widget.widgetApi, "render")
          .mockImplementation(
            () => new Promise((res) => res({ template: "asdf" }))
          );

        const loadMock = jest.spyOn(widget, "load");
        const openMock = jest.spyOn(widget, "open");

        const div = document.createElement("div");
        div.setAttribute("class", "squatchembed");
        document.body.appendChild(div);

        const element = widget._findElement();
        const iframe = widget._createFrame();
        element.appendChild(iframe);

        iframe.contentDocument?.write(`<div class="squatch-register"></div>`);

        widget.type = param.type;
        widget.context = {
          type: "passwordless",
          engagementMedium: param.engagementMedium as EngagementMedium,
        };

        await widget.reload(
          { email: "john@example.com", firstName: "asdf", lastName: "asdf" },
          "asdf"
        );

        expect(upsertMock).toBeCalledTimes(1);
        expect(widget.content).toBe("asdf");

        const button = iframe.contentDocument?.body.querySelector(
          "#show-stats-btn"
        ) as HTMLButtonElement;

        expect(button).not.toBeNull();
        expect((button as HTMLButtonElement).onclick).toBeDefined();

        button.click();
        expect(loadMock).toBeCalledTimes(1);
        expect(iframe.contentDocument?.body.innerHTML).toContain(
          "john@example.com"
        );
        if (param.type === "REFERRER_WIDGET") {
          expect(iframe.contentDocument?.body.innerHTML).toContain(
            "Show Stats"
          );
        } else {
          expect(iframe.contentDocument?.body.innerHTML).toContain(
            "Show Reward"
          );
        }
        if (param.engagementMedium === "POPUP") {
          expect(iframe.contentDocument?.body.innerHTML).toContain(
            "max-width: 130px"
          );
          expect(openMock).toBeCalledTimes(1);
        } else {
          expect(iframe.contentDocument?.body.innerHTML).not.toContain(
            "max-width: 130px"
          );
          expect(openMock).toBeCalledTimes(0);
        }
      }
    );
    test("with iframe, request rejects", async () => {
      const upsertMock = jest
        .spyOn(widget.widgetApi, "render")
        .mockImplementation(() => new Promise((res, rej) => rej("ERROR")));

      const div = document.createElement("div");
      div.setAttribute("class", "squatchembed");
      document.body.appendChild(div);

      const element = widget._findElement();
      const iframe = widget._createFrame();
      element.appendChild(iframe);

      widget.context = {
        type: "passwordless",
      };

      await widget.reload(
        { email: "john@example.com", firstName: "asdf", lastName: "asdf" },
        "asdf"
      );

      expect(upsertMock).toBeCalledTimes(1);
      expect(widget.content).toBe("<p>DEFAULT_WIDGET_CONTENT</p>");
    });
    test("with iframe, error type", async () => {
      const div = document.createElement("div");
      div.setAttribute("class", "squatchembed");
      document.body.appendChild(div);

      const element = widget._findElement();
      const iframe = widget._createFrame();
      element.appendChild(iframe);

      widget.context = {
        type: "error",
      };

      expect(() =>
        widget.reload(
          { email: "john@example.com", firstName: "asdf", lastName: "asdf" },
          "asdf"
        )
      ).toThrowError("can't reload an error widget");
    });
  });
  afterEach(() => {
    // @ts-ignore
    widget = null;
  });
});
