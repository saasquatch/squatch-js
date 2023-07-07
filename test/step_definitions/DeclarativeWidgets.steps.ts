import {
  StepDefinitions,
  autoBindSteps,
  defineFeature,
  loadFeature,
  loadFeatures,
} from "jest-cucumber";
import { server } from "../mocks/server";
import { defineCE, elementUpdated, waitUntil } from "@open-wc/testing-helpers";
import {
  DeclarativeEmbedWidget,
  DeclarativePopupWidget,
} from "../../src/squatch";
import DeclarativeWidget from "../../src/widgets/declarative/DeclarativeWidget";
import { sanitize } from "../helpers/sanitize";
import { PASSWORDLESS, VERIFIED } from "../mocks/handlers";
const feature = loadFeature(
  "../blackbox-testing/features/squatchjs/DeclarativeWidgets.feature"
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: "bypass" });
  window.Cookies = {
    // @ts-ignore
    get: (name: string) => "cookies",
  };
});
beforeEach(() => {
  window.squatchTenant = "TENANT_ALIAS";
  window.squatchConfig = {
    domain: "https://staging.referralsaasquatch.com",
  };
  // @ts-ignore
  window.squatchToken = null;
});
afterEach(() => {
  document.body.innerHTML = "";
  server.resetHandlers();
});
afterAll(() => {
  server.close();
  jest.clearAllMocks();
});

const Background = (given) => {
  given(
    /^the following squatchjs loader script is in the "(.*)" tag$/,
    (head, docString) => {}
  );
};

const eitherWebComponentIsIncluded = () => {
  const tag = defineCE(class Test extends DeclarativeEmbedWidget {});
  return document.createElement(`${tag}`) as DeclarativeEmbedWidget;
};

const specificWebComponentIsIncluded = (component) => {
  if (component === "squatch-embed") {
    const tag = defineCE(class Test extends DeclarativeEmbedWidget {});
    return document.createElement(`${tag}`) as DeclarativeEmbedWidget;
  } else {
    const tag = defineCE(class Test extends DeclarativePopupWidget {});
    return document.createElement(`${tag}`) as DeclarativePopupWidget;
  }
};

const getTokenValueFromPrompt = (prompt: any) => {
  switch (prompt) {
    case "a token without user object":
      return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbnYiOnsidGVuYW50QWxpYXMiOiJ0ZXN0X2E4YjQxam90ZjhhMXYiLCJkb21haW4iOiJodHRwczovL3N0YWdpbmcucmVmZXJyYWxzYWFzcXVhdGNoLmNvbSJ9fQ";
    case "a token without API key":
      return "";
    case "a valid token":
      return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiaXJ0ZXN0IiwiYWNjb3VudElkIjoiaXJ0ZXN0In0sImVudiI6eyJ0ZW5hbnRBbGlhcyI6InRlc3RfYThiNDFqb3RmOGExdiIsImRvbWFpbiI6Imh0dHBzOi8vc3RhZ2luZy5yZWZlcnJhbHNhYXNxdWF0Y2guY29tIn19";
    default:
      return prompt;
  }
};

const SquatchTenantIs = (given) => {
  given(/^window.squatchTenant is (.*)$/, (arg0) => {
    if (arg0 === "invalid") window.squatchTenant = "INVALID_TENANT_ALIAS";
    // @ts-ignore
    else window.squatchTenant = sanitize(arg0);
  });
};

const SquatchTokenIs = (and) => {
  and(/^window.squatchToken is (.*)$/, (_tokenArg) => {
    const tokenArg = sanitize(_tokenArg);
    const tokenValue = getTokenValueFromPrompt(tokenArg);
    window.squatchToken = tokenValue;
  });
};

defineFeature(feature, (test) => {
  test("Missing or invalid tenant alias", ({ given, and, when, then }) => {
    let el!: DeclarativeEmbedWidget;

    Background(given);

    SquatchTenantIs(given);

    and("either web-component is included in the page's HTML", () => {
      el = eitherWebComponentIsIncluded();
    });

    and("the widget has a valid widget type", () => {
      el.setAttribute("widget", "w/valid-widget");
    });

    then("the web-component throws an error while loading", async () => {
      await expect(
        async () => await el.connectedCallback()
      ).rejects.toThrowError("tenantAlias");
    });

    and("an iframe is not loaded into the DOM", () => {
      expect(el.shadowRoot!.querySelector("iframe")).toBeNull();
    });
  });
  test("Rendering a passwordless widget", ({ given, and, when, then }) => {
    let el!: DeclarativeEmbedWidget;

    Background(given);

    given(/^window.squatchToken is (.*)$/, (arg0) => {
      // @ts-ignore
      window.squatchToken = sanitize(arg0);
    });

    and("either web-component is included in the page's HTML", () => {
      el = eitherWebComponentIsIncluded();
    });
    and("the widget has a valid widget type", () => {
      el.setAttribute("widget", "w/valid-widget");
    });

    when("the component loads", async () => {
      document.body.appendChild(el);
      await expect(
        waitUntil(() => !!el.shadowRoot!.querySelector("iframe"), "no iframe")
      ).resolves.toBeUndefined();
    });

    then("squatchjs requests the widget with no user information", () => {
      // Indirect check
      expect(el.widgetInstance.context.type).toBe("passwordless");
    });

    and("the widget is a passwordless widget", async () => {
      await expect(
        waitUntil(() => !!el.shadowRoot!.querySelector("iframe"), "no iframe")
      ).resolves.toBeUndefined();

      const frame = el.shadowRoot!.querySelector("iframe");
      expect(frame).toBeInstanceOf(HTMLIFrameElement);
      expect(frame?.contentDocument?.body.innerHTML).toContain(PASSWORDLESS);
    });
  });
  test("squatchToken requires a valid user object", ({
    given,
    and,
    when,
    then,
  }) => {
    let el!: DeclarativeEmbedWidget;
    let field!: string;
    let frame!: HTMLIFrameElement;

    Background(given);

    given(
      /^window.squatchToken does not include the user object (.*) field$/,
      (_arg) => {
        const arg = sanitize(_arg) as string;

        if (arg === "accountId") {
          window.squatchToken =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiaXJ0ZXN0In0sImVudiI6eyJ0ZW5hbnRBbGlhcyI6InRlc3RfYThiNDFqb3RmOGExdiIsImRvbWFpbiI6Imh0dHBzOi8vc3RhZ2luZy5yZWZlcnJhbHNhYXNxdWF0Y2guY29tIn19";
          field = "accountId";
        } else if (arg === "id") {
          window.squatchToken =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImFjY291bnRJZCI6ImlydGVzdCJ9LCJlbnYiOnsidGVuYW50QWxpYXMiOiJ0ZXN0X2E4YjQxam90ZjhhMXYiLCJkb21haW4iOiJodHRwczovL3N0YWdpbmcucmVmZXJyYWxzYWFzcXVhdGNoLmNvbSJ9fQ";
          field = "userId";
        } else {
          fail();
        }
      }
    );

    and("either web-component is included in the page's HTML", () => {
      el = eitherWebComponentIsIncluded();
    });

    and("the widget has a valid widget type", () => {
      el.setAttribute("widget", "w/valid-widget");
    });

    when("the component loads", () => {
      document.body.appendChild(el);
    });

    then("the widget's iframe is loaded into the DOM", async () => {
      await expect(
        waitUntil(() => !!el.shadowRoot!.querySelector("iframe"), "no iframe")
      ).resolves.toBeUndefined();

      frame = el.shadowRoot?.querySelector("iframe") as HTMLIFrameElement;
      expect(frame).toBeInstanceOf(HTMLIFrameElement);
    });

    and(/^the widget is a "(.*)" widget$/, (_type) => {
      const type = sanitize(_type);
      if (type === "verified") {
        expect(frame?.contentDocument?.body.innerHTML).toContain(VERIFIED);
      } else if (type === "passwordless") {
        expect(frame?.contentDocument?.body.innerHTML).toContain(PASSWORDLESS);
      } else {
        expect(frame?.contentDocument?.body.innerHTML).toContain("Error");
      }
    });
  });

  test("Missing widget attribute", ({ given, and, when, then }) => {
    let el!: DeclarativeEmbedWidget | DeclarativePopupWidget;
    let component: string;
    let widgetType: any;

    Background(given);

    given(/^(.*) is included in the page's HTML$/, (arg0) => {
      component = arg0;
      el = specificWebComponentIsIncluded(arg0);
    });

    and(/^the widget attribute is set to (.*)$/, (arg0) => {
      widgetType = sanitize(arg0);
      if (widgetType) {
        // @ts-ignore
        el.setAttribute("widget", widgetType);
      }
    });

    when("the component loads", () => {});

    then("the component throws an error", async (throws) => {
      await expect(() => el.connectedCallback()).rejects.toThrowError();
    });

    and("the widget does not render", (renders) => {
      expect(el.shadowRoot!.querySelector("iframe")).toBeNull();
    });
  });

  test("Declarative popup widgets can be open by default", ({
    given,
    and,
    when,
    then,
  }) => {
    let el!: DeclarativeEmbedWidget | DeclarativePopupWidget;

    Background(given);
    SquatchTenantIs(given);
    SquatchTokenIs(and);

    given(
      /^the "(.*)" web-component is included in the page's HTML$/,
      (arg0) => {
        el = specificWebComponentIsIncluded(arg0);
      }
    );

    and("the widget attribute is set to a valid SaaSquatch widget type", () => {
      el.setAttribute("widget", "w/widget-type");
    });
    and(
      /^the "(.*)" attribute (.*) set on the "(.*)" element$/,
      (arg0, arg1, arg2) => {
        const attr = sanitize(arg0);

        if (arg1 === "is") {
          el.setAttribute(attr as string, "");
        }
      }
    );

    when("the component loads", () => {
      document.body.appendChild(el);
    });

    and("the widget's iframe is loaded into the DOM", async () => {
      await expect(
        waitUntil(() => !!el.shadowRoot!.querySelector("iframe"), "no iframe")
      ).resolves.toBeUndefined();

      const frame = el.shadowRoot?.querySelector("iframe") as HTMLIFrameElement;
      expect(frame).toBeInstanceOf(HTMLIFrameElement);
    });

    then(/^the popup widget (.*) displayed on the screen$/, (arg0) => {
      const dialog = el.shadowRoot!.querySelector("dialog");
      expect(dialog).toBeInstanceOf(HTMLDialogElement);

      if (arg0 === "is") {
        expect(dialog?.open).toBe(true);
      } else if (arg0 === "is not") {
        expect(dialog?.open).toBe(false);
      } else {
        fail();
      }
    });
  });

  test.skip("squatch-popup can be opened via .squatchpop", ({
    given,
    and,
    when,
    then,
  }) => {
    Background(given);
    given(/^a widget has been loaded correctly using "(.*)"$/, (arg0) => {});

    and(/^an element with the (.*) class exists in the DOM$/, (arg0) => {});
    when(/^the element with the class (.*) class is clicked$/, (arg0) => {});

    then(/^the widget (.*) displayed on the screen$/, (arg0) => {});
  });

  test.skip("squatch-embed child elements are used as the loading state", ({
    given,
    and,
    when,
    then,
  }) => {
    Background(given);

    given(/^"(.*)" is included in the page's HTML$/, (arg0) => {});

    and("it has at least one child element", () => {});

    when("the component loads", () => {});

    then(
      /^the child elements of "(.*)" are displayed on the screen$/,
      (arg0) => {}
    );

    when("the widget loads correctly", () => {});

    then(
      /^the child elements of "(.*)" are replaced with the widget$/,
      (arg0) => {}
    );
  });
  test.skip("Legacy API and declarative widgets", ({
    given,
    and,
    when,
    then,
  }) => {
    given(
      /^the following squatchjs loader script is in the "(.*)" tag$/,
      (arg0, docString) => {}
    );

    given(/^"(.*)" is included in the page's HTML$/, (arg0) => {});

    and(/^the "(.*)" attribute is set to "(.*)"$/, (arg0, arg1) => {});

    and("another widget is loaded via the following script", (docString) => {});

    and(/^an element exists in the DOM with the "(.*)" id$/, (arg0) => {});

    when("the widgets are loaded", () => {});

    then(
      /^the "(.*)" widget iframe is attached to the "(.*)" element's shadow DOM$/,
      (arg0, arg1) => {}
    );

    and(
      /^the "(.*)" widget iframe is attached as a child to the element with the "(.*)" id$/,
      (arg0, arg1) => {}
    );
  });
  test.skip("squatch-popup elements without children override the .squatchpop onclick callback", ({
    given,
    and,
    when,
    then,
  }) => {
    Background(given);

    given(
      /^at least (\d+) "(.*)" elements in the page's HTML$/,
      (arg0, arg1) => {}
    );

    and(/^an element with the "(.*)" class$/, (arg0) => {});

    when("the component loads", () => {});

    and("the widgets are loaded correctly", () => {});

    then(
      /^the "(.*)" class element's onclick callback is overridden$/,
      (arg0) => {}
    );

    when(/^the "(.*)" class element is clicked$/, (arg0) => {});

    then("it opens up the last loaded widget", () => {});
  });
  test.skip('Declarative web components are "display: inline" until component code is loaded', ({
    given,
    when,
    but,
    then,
  }) => {
    given(
      /^the following squatchjs loader script is in the "(.*)" tag$/,
      (arg0, docString) => {}
    );

    given(/^(.*) is included in the page's HTML$/, (arg0) => {});

    when("the component loads", () => {});

    but("squatchjs hasn't loaded yet", () => {});

    then(/^the element will default to be "(.*)"$/, (arg0) => {});

    when("squatchjs loads", () => {});

    then(/^the element will be set to "(.*)"$/, (arg0) => {});
  });

  test.skip("Overriding default squatch configurations", ({
    given,
    and,
    then,
  }) => {
    given(
      /^the following squatchjs loader script is in the "(.*)" tag$/,
      (arg0, docString) => {}
    );

    given("window.squatchConfig has been set", () => {});

    and(/^the field (.*) has been set$/, (arg0) => {});

    then(
      /^the default value of (.*) is overriden with the value in window.squatchConfig$/,
      (arg0) => {}
    );
  });
  test("Rendering a basic embedded widget", ({ given, and, when, then }) => {
    Background(given);
    let el!: DeclarativeEmbedWidget | DeclarativePopupWidget;
    let frame: HTMLIFrameElement | null;

    SquatchTenantIs(given);

    SquatchTokenIs(and);

    and(/^the "(.*)" web-component is included in the page's HTML$/, (arg0) => {
      el = specificWebComponentIsIncluded(arg0);
    });

    and("the widget attribute is set to a valid SaaSquatch widget type", () => {
      el.setAttribute("widget", "w/widget-type");
    });

    when("the component loads", () => {
      document.body.appendChild(el);
    });

    then("the widget's iframe is loaded into the DOM", async () => {
      await expect(
        waitUntil(() => !!el.shadowRoot!.querySelector("iframe"), "no iframe")
      ).resolves.toBeUndefined();

      frame = el.shadowRoot!.querySelector("iframe");
      expect(frame).toBeDefined();
      expect(frame).toBeInstanceOf(HTMLIFrameElement);
    });

    and(/^the widget is a (.*) widget$/, (_type) => {
      const type = sanitize(_type);
      if (type === "verified") {
        expect(frame?.contentDocument?.body.innerHTML).toContain(VERIFIED);
      } else if (type === "passwordless") {
        expect(frame?.contentDocument?.body.innerHTML).toContain(PASSWORDLESS);
      } else {
        expect(frame?.contentDocument?.body.innerHTML).toContain("Error");
      }
    });
  });
  test("Rendering a basic popup widget", ({ given, and, when, then }) => {
    let el!: DeclarativePopupWidget;
    let frame: HTMLIFrameElement | null;
    Background(given);

    SquatchTenantIs(given);

    SquatchTokenIs(and);

    and(/^the "(.*)" web-component is included in the page's HTML$/, (arg0) => {
      el = specificWebComponentIsIncluded(arg0);
    });

    and("the widget attribute is set to a valid SaaSquatch widget type", () => {
      el.setAttribute("widget", "w/widget-type");
    });

    when("the component loads", () => {
      document.body.appendChild(el);
    });

    then("the widget's iframe is loaded into the DOM", async () => {
      await expect(
        waitUntil(() => !!el.shadowRoot!.querySelector("iframe"), "no iframe")
      ).resolves.toBeUndefined();

      frame = el.shadowRoot!.querySelector("iframe");
      expect(frame).toBeDefined();
      expect(frame).toBeInstanceOf(HTMLIFrameElement);
    });

    and(
      /^the widget\'s iframe is the only child of a "dialog" element$/,
      () => {
        const dialog = el.shadowRoot!.querySelector("dialog");
        expect(dialog).toBeDefined();
        expect(dialog).toBeInstanceOf(HTMLDialogElement);

        expect(dialog?.children.item(0)).toBe(frame);
      }
    );

    and(/^the widget is a (.*) widget$/, (type) => {
      if (type === "verified") {
        expect(frame?.contentDocument?.body.innerHTML).toContain(VERIFIED);
      } else if (type === "passwordless") {
        expect(frame?.contentDocument?.body.innerHTML).toContain(PASSWORDLESS);
      } else {
        expect(frame?.contentDocument?.body.innerHTML).toContain("Error");
      }
    });
  });
  test("Rerender on widget attribute change", ({ given, and, when, then }) => {
    let el!: DeclarativeEmbedWidget | DeclarativePopupWidget;
    let firstFrame!: HTMLIFrameElement;
    let secondFrame!: HTMLIFrameElement;

    Background(given);
    SquatchTenantIs(given);
    SquatchTokenIs(and);

    and(/^the (.*) web-component is included in the page's HTML$/, (arg0) => {
      el = specificWebComponentIsIncluded(arg0);
    });

    and("the widget attribute is set to a valid SaaSquatch widget type", () => {
      el.setAttribute("widget", "w/widget-type");
    });

    and("the widget is loaded into the DOM", async () => {
      document.body.appendChild(el);
      await expect(
        waitUntil(() => !!el.shadowRoot?.querySelector("iframe"), "no iframe")
      ).resolves.toBeUndefined();

      firstFrame = el.shadowRoot!.querySelector("iframe")!;
      expect(firstFrame).toBeDefined();
      expect(firstFrame).toBeInstanceOf(HTMLIFrameElement);

      const html = firstFrame.contentDocument?.body.innerHTML;
      expect(html).toContain("w/widget-type");
    });

    when("the widget attribute is changed", () => {
      el.setAttribute("widget", "w/new-widget-type");
    });

    and("the new widget is loaded into the DOM", async () => {
      await expect(
        waitUntil(() =>
          el.shadowRoot
            ?.querySelector("iframe")
            ?.contentDocument?.body.innerHTML.includes("w/new-widget-type")
        )
      ).resolves.toBeUndefined();

      // Making sure
      secondFrame = el.shadowRoot!.querySelector("iframe")!;
      expect(secondFrame).toBeDefined();
      expect(secondFrame).toBeInstanceOf(HTMLIFrameElement);

      const html = secondFrame.contentDocument?.body.innerHTML;
      expect(html).toContain("w/new-widget-type");
    });

    and("the new widget's iframe replaces the previous one", () => {
      const results = el.shadowRoot!.querySelectorAll("iframe");
      expect(results.length).toBe(1);
    });
  });
  test.skip("Opening squatch-popup web component dialog via children", ({
    given,
    and,
    when,
    then,
  }) => {
    given(
      /^the following squatchjs loader script is in the "(.*)" tag$/,
      (arg0, docString) => {}
    );

    given(/^a widget has been loaded correctly using "(.*)"$/, (arg0) => {});

    and(
      /^"(.*)" contains at least one child element that isn't a "(.*)" element$/,
      (arg0, arg1) => {}
    );

    and(/^the children of "(.*)" is (.*)$/, (arg0, arg1) => {});

    when(/^the child element fires a "(.*)" event$/, (arg0) => {});

    then("the widget is shown on the screen", () => {});
  });
  test.skip("Declarative widgets render children via a shadow DOM", ({
    given,
    when,
    then,
    and,
  }) => {
    let el!: DeclarativeEmbedWidget | DeclarativePopupWidget;

    Background(given);

    given(/^(.*) is included in the page's HTML$/, (arg0) => {});
    and("the widget attribute is set to a valid SaaSquatch widget type", () => {
      el.setAttribute("widget", "w/widget-type");
    });

    when("the component loads", () => {});

    then(/^the shadow DOM's mode is set to "(.*)"$/, (arg0) => {});

    and(
      "the shadom DOM's innerHTML is set to the following",
      (docString) => {}
    );

    then(
      "the widget iframe is slotted into the custom element's shadow DOM",
      () => {}
    );
  });
  test("Custom widget containers for squatch-embed", ({
    given,
    and,
    when,
    then,
  }) => {
    let el!: DeclarativeEmbedWidget | DeclarativePopupWidget;
    let div!: HTMLDivElement;

    Background(given);

    given(/^"(.*)" is included in the page's HTML$/, (arg0) => {
      el = specificWebComponentIsIncluded(arg0);
    });
    and("the widget attribute is set to a valid SaaSquatch widget type", () => {
      el.setAttribute("widget", "w/widget-type");
    });
    and(/^the "(.*)" attribute has been set to (.*)$/, (arg0, arg1) => {
      const attr = sanitize(arg0) as string;
      const value = sanitize(arg1) as string;

      if (value && attr) el.setAttribute(attr, value);
    });

    and(
      /^an element with attribute (.*) with value (.*) exists in the DOM$/,
      (arg0, arg1) => {
        const attr = sanitize(arg0) as string;
        const value = sanitize(arg1) as string;

        div = document.createElement("div");
        if (value && attr) div.setAttribute(attr, value);
        document.body.appendChild(div);
      }
    );

    when(/^the component (.*)$/, async (loadBehaviour) => {
      if (loadBehaviour === "throws an error on load") {
        await expect(
          async () => await el.connectedCallback()
        ).rejects.toThrowError("not found");
      } else if (loadBehaviour === "loads") {
        document.body.appendChild(el);

        await expect(
          waitUntil(
            () =>
              document.body.querySelector("iframe") ||
              el.shadowRoot?.querySelector("iframe"),
            "no iframe"
          )
        ).resolves.toBeUndefined();
      } else {
        fail();
      }
    });

    then(
      /^the widget (.*) contained within the corresponding element$/,
      async (arg0) => {
        const arg = sanitize(arg0);
        if (arg === "is") {
          expect(div.querySelector("iframe")).toBeDefined();
        } else if (arg === "is not") {
          expect(div.querySelector("iframe")).toBeNull();
        } else {
          fail();
        }
      }
    );
  });
  test.skip("squatch-popup has children and there is a .squatchpop trigger in the DOM", ({
    given,
    and,
    when,
    then,
  }) => {
    given(
      /^the following squatchjs loader script is in the "(.*)" tag$/,
      (arg0, docString) => {}
    );

    given(/^"(.*)" is included in the page's HTML$/, (arg0) => {});

    and(/^"(.*)" (.*) at least one child element$/, (arg0, arg1) => {});

    and(/^an element exists in the DOM with the "(.*)" class$/, (arg0) => {});

    when(/^the "(.*)" element is clicked$/, (arg0) => {});

    then(/^the popup widget (.*)$/, (arg0) => {});
  });
  test.skip('"squatch-embed" does not look for the default widget container', ({
    given,
    and,
    when,
    then,
  }) => {
    given(
      /^the following squatchjs loader script is in the "(.*)" tag$/,
      (arg0, docString) => {}
    );

    given(/^"(.*)" is included in the page's HTML$/, (arg0) => {});

    and(
      /^an element exists in the DOM with the "(.*)" (.*)$/,
      (arg0, arg1) => {}
    );

    when("the component loads", () => {});

    and("the widgets loads correctly", () => {});

    then(
      /^the widget iframe is attached to the "(.*)" element's shadow DOM$/,
      (arg0) => {}
    );

    and(
      /^is not a child of the element with the "(.*)" (.*)$/,
      (arg0, arg1) => {}
    );
  });
});
