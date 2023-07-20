import { defineCE, waitUntil } from "@open-wc/testing-helpers";
import { defineFeature, loadFeature } from "jest-cucumber";
import {
  DeclarativeEmbedWidget,
  DeclarativePopupWidget,
} from "../../src/squatch";
import { sanitize } from "../helpers/sanitize";
import { PASSWORDLESS, VERIFIED } from "../mocks/handlers";
import { server } from "../mocks/server";

const feature = loadFeature("test/specs/DeclarativeWidgets.feature", {
  tagFilter: "@automated and not @cant-be-tested",
});

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

const specificWebComponentIsIncluded = (_component) => {
  const component = sanitize(_component);
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
      return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiaXJ0ZXN0IiwiYWNjb3VudElkIjoiaXJ0ZXN0IiwibG9jYWxlIjoiZW5fVVMifSwiZW52Ijp7InRlbmFudEFsaWFzIjoidGVzdF9hOGI0MWpvdGY4YTF2IiwiZG9tYWluIjoiaHR0cHM6Ly9zdGFnaW5nLnJlZmVycmFsc2Fhc3F1YXRjaC5jb20ifX0";
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

  test("squatch-popup can be opened via .squatchpop", ({
    given,
    and,
    when,
    then,
  }) => {
    let el!: DeclarativePopupWidget;
    let div!: HTMLDivElement;

    Background(given);

    given(/^an element with the (.*) class exists in the DOM$/, (arg0) => {
      const value = sanitize(arg0) as string;
      div = document.createElement("div");
      div.setAttribute("class", value);
      document.body.appendChild(div);

      expect(document.body.querySelector(`.${value}`)).toBeInstanceOf(
        HTMLDivElement
      );
    });
    and(/^a widget has been loaded correctly using "(.*)"$/, async (arg0) => {
      el = specificWebComponentIsIncluded(arg0);

      el.setAttribute("widget", "w/widget-type");

      document.body.appendChild(el);
      await expect(
        waitUntil(() => el.shadowRoot?.querySelector("iframe"), "no iframe")
      ).resolves.toBeUndefined();

      const frame = el.shadowRoot?.querySelector("iframe");
      expect(frame).toBeInstanceOf(HTMLIFrameElement);
    });
    when(/^the element with the class (.*) class is clicked$/, (arg0) => {
      div.click();
    });

    then(/^the widget (.*) displayed on the screen$/, (arg0) => {
      const isOrNot = sanitize(arg0);
      const dialog = el.shadowRoot!.querySelector("dialog");
      expect(dialog).toBeInstanceOf(HTMLDialogElement);

      if (isOrNot === "is") {
        expect(dialog?.open).toBe(true);
      } else if (isOrNot === "is not") {
        expect(dialog?.open).toBe(false);
      } else {
        fail();
      }
    });
  });

  test("squatch-embed child elements are used as the loading state", ({
    given,
    and,
    when,
    then,
  }) => {
    let el!: DeclarativeEmbedWidget;
    const loadingHTML = `<div id="child1">Loading...</div><div id="child2">Also loading</div>`;
    Background(given);

    given(/^"(.*)" is included in the page's HTML$/, (arg0) => {
      el = specificWebComponentIsIncluded(arg0);
    });

    and("it has at least one child element", () => {
      el.innerHTML = loadingHTML;
    });

    when("the component loads correctly", () => {
      el.setAttribute("widget", "w/widget-type");

      document.body.appendChild(el);
    });

    then(
      /^the child elements of "(.*)" are slotted into its shadowDOM$/,
      (arg0) => {
        const slot = el.shadowRoot?.querySelector("slot");
        expect(slot).toBeDefined();

        const elements = slot?.assignedElements();
        expect(elements?.length).toBe(2);
        expect(elements?.[0].id).toBe("child1");
        expect(elements?.[1].id).toBe("child2");
      }
    );

    when("the widget's iframe loads in", async () => {
      await expect(
        waitUntil(() => el.shadowRoot!.querySelector("iframe"), "no iframe")
      ).resolves.toBeUndefined();
    });

    then(
      "the slot element in the web-component's shadowDOM is removed",
      (arg0) => {
        const slot = el.shadowRoot?.querySelector("slot");
        expect(slot).toBeNull();
      }
    );

    and("the child elements are no longer visible", () => {});
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
  test("Rerender on attribute change", ({ given, and, when, then }) => {
    let el!: DeclarativeEmbedWidget | DeclarativePopupWidget;
    let firstFrame!: HTMLIFrameElement;
    let secondFrame!: HTMLIFrameElement;
    let attributeValue!: string | undefined;

    beforeEach(() => {
      attributeValue = undefined;
    });

    Background(given);
    SquatchTenantIs(given);
    SquatchTokenIs(and);

    and(/^the (.*) web-component is included in the page's HTML$/, (arg0) => {
      el = specificWebComponentIsIncluded(arg0);
    });

    and(/^the (.*) attribute is set to (.*)$/, (arg0, arg1) => {
      const attr = sanitize(arg0) as string;
      const value = sanitize(arg1) as string;

      if (attr !== "widget") el.setAttribute("widget", "w/widge-type");

      attributeValue = value;
      el.setAttribute(attr, value);
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
      expect(html).toContain(attributeValue);
    });

    when(/^the (.*) attribute is changed to (.*)$/, (arg0, arg1) => {
      const attr = sanitize(arg0) as string;
      const value = sanitize(arg1) as string;

      attributeValue = value;
      el.setAttribute(attr, value);
    });

    and("the new widget is loaded into the DOM", async () => {
      await expect(
        waitUntil(
          () =>
            el.shadowRoot
              ?.querySelector("iframe")
              ?.contentDocument?.body.innerHTML.includes(attributeValue!),
          "no iframe"
        )
      ).resolves.toBeUndefined();
      secondFrame = el.shadowRoot!.querySelector("iframe")!;
      expect(secondFrame).toBeDefined();
      expect(secondFrame).toBeInstanceOf(HTMLIFrameElement);

      const html = secondFrame.contentDocument?.body.innerHTML;
      expect(html).toContain(attributeValue);
    });

    and("the new widget's iframe replaces the previous one", () => {
      const results = el.shadowRoot!.querySelectorAll("iframe");
      expect(results.length).toBe(1);
    });
  });
  test("Opening squatch-popup web component dialog via children", ({
    given,
    and,
    when,
    then,
  }) => {
    let el!: DeclarativePopupWidget;
    let dialog!: HTMLDialogElement;

    Background(given);
    given(/^"(.*)" is included in the page's HTML$/, (arg0) => {
      el = specificWebComponentIsIncluded(arg0);
    });

    and(/^the web-component's innerHTML is (.*)$/, (arg0) => {
      const html = sanitize(arg0) as string;
      el.innerHTML = html;
    });

    and("the component has loaded correctly", async () => {
      el.setAttribute("widget", "w/widget-type");
      document.body.appendChild(el);

      await expect(
        waitUntil(() => el.shadowRoot!.querySelector("iframe"), "no iframe")
      ).resolves.toBeUndefined();

      dialog = el.shadowRoot!.querySelector("dialog") as HTMLDialogElement;
      expect(dialog).toBeDefined();
    });

    and("the widget's dialog is closed", () => {
      expect(dialog.open).toBe(false);
    });

    when(/^the child (.*) element fires a click event$/, (arg0) => {
      const tag = sanitize(arg0) as string;
      const element = el.querySelector(tag) as HTMLElement;
      expect(element).toBeDefined();
      element.click();
    });

    then("the widget's dialog is open", () => {
      expect(dialog.open).toBe(true);
    });
  });
  test("Declarative widgets render children via a shadow DOM", ({
    given,
    when,
    then,
    and,
  }) => {
    let el!: DeclarativeEmbedWidget | DeclarativePopupWidget;

    Background(given);

    given(/^(.*) is included in the page's HTML$/, (arg0) => {
      el = specificWebComponentIsIncluded(arg0);
    });
    and("the widget attribute is set to a valid SaaSquatch widget type", () => {
      el.setAttribute("widget", "w/widget-type");
    });
    when("the component loads", () => {
      document.body.appendChild(el);
    });

    then(/^the shadow DOM's mode is set to "(.*)"$/, (arg0) => {
      const mode = sanitize(arg0);
      expect(el.shadowRoot?.mode).toBe(mode);
    });

    and("the shadom DOM's innerHTML is set to the following", (docString) => {
      expect(el.shadowRoot?.innerHTML).toBe(docString);
    });

    and(
      "the widget iframe is slotted into the custom element's shadow DOM",
      async () => {
        await expect(
          waitUntil(() => el.shadowRoot?.querySelector("iframe"), "no iframe")
        ).resolves.toBeUndefined();
        const frame = el.shadowRoot?.querySelector("iframe");
        expect(frame).toBeInstanceOf(HTMLIFrameElement);
        expect(frame?.contentDocument?.body.innerHTML).toContain(
          "w/widget-type"
        );
      }
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
  test("squatch-popup has children and there is a .squatchpop trigger in the DOM", ({
    given,
    and,
    when,
    then,
  }) => {
    let el!: DeclarativePopupWidget;
    let div!: HTMLDivElement;
    let value!: string;

    Background(given);

    given(/^"(.*)" is included in the page's HTML$/, (arg0) => {
      el = specificWebComponentIsIncluded(arg0);
    });

    and(
      /^"(.*)" (.*) at least one child element$/,
      (squatchPopup, _doesOrNot) => {
        const doesOrNot = sanitize(_doesOrNot);
        if (doesOrNot === "does") {
          const child = document.createElement("div");
          child.innerText = "CLICK HERE";

          el.appendChild(child);

          expect(el.querySelector("div")?.innerText).toBe("CLICK HERE");
        } else {
          expect(el.querySelector("div")).toBeNull();
        }
      }
    );

    and(/^an element exists in the DOM with the "(.*)" class$/, (arg0) => {
      value = sanitize(arg0) as string;
      div = document.createElement("div");
      div.setAttribute("class", value);

      document.body.appendChild(div);
    });

    and("the component has loaded correctly", async () => {
      el.setAttribute("widget", "w/widget-type");
      document.body.appendChild(el);

      await expect(
        waitUntil(() => el.shadowRoot?.querySelector("iframe"), "no iframe")
      ).resolves.toBeUndefined();

      const frame = el.shadowRoot?.querySelector("iframe");
      expect(frame).toBeInstanceOf(HTMLIFrameElement);
    });
    when(/^the "(.*)" element is clicked$/, (arg0) => {
      expect(document.body.querySelector(`.${value}`)).toBeDefined();

      div.click();
    });

    then(/^the popup widget's dialog element (.*) open$/, (arg0) => {
      const isOrNot = sanitize(arg0);
      const dialog = el.shadowRoot?.querySelector("dialog");
      expect(dialog).toBeInstanceOf(HTMLDialogElement);

      if (isOrNot === "is") {
        expect(dialog?.open).toBe(true);
      } else if (isOrNot === "is not") {
        expect(dialog?.open).toBe(false);
      } else {
        fail();
      }
    });
  });
  test('"squatch-embed" does not look for the default widget container', ({
    given,
    and,
    when,
    then,
  }) => {
    let el!: DeclarativeEmbedWidget;
    let div!: HTMLDivElement;

    Background(given);

    given(/^"(.*)" is included in the page's HTML$/, (arg0) => {
      el = specificWebComponentIsIncluded(arg0);
    });
    and("the widget attribute is set to a valid SaaSquatch widget type", () => {
      el.setAttribute("widget", "w/widget-type");
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

    when("the component loads", () => {
      document.body.appendChild(el);
    });

    then(
      "the widget iframe is attached to the web-component's shadow DOM",
      async () => {
        await expect(
          waitUntil(() => el.shadowRoot?.querySelector("iframe"), "no iframe")
        ).resolves.toBeUndefined();
        const frame = el.shadowRoot?.querySelector("iframe");
        expect(frame).toBeInstanceOf(HTMLIFrameElement);
      }
    );

    and(
      /^is not a child of the element with (.*) with value (.*)$/,
      (arg0, arg1) => {
        expect(div.querySelector("iframe")).toBeNull();
      }
    );
  });
  test("Passwordless widgets take _saasquatchExtra config as priority", ({
    given,
    when,
    and,
    then,
  }) => {
    let el!: DeclarativeEmbedWidget;
    let squatchConfig: any;
    let widgetConfig: any;

    Background(given);
    given("either web-component is included in the page's HTML", () => {
      el = eitherWebComponentIsIncluded();
    });
    and(/^window.squatchTenant is set to "(.*)"$/, (arg0) => {
      const value = sanitize(arg0);
      // @ts-ignore
      window.squatchTenant = value;
    });
    and("window.squatchToken is undefined", () => {
      // @ts-ignore
      window.squatchToken = null;
    });
    and(/^window.squatchConfig.domain is set to "(.*)"$/, (arg0) => {
      const value = sanitize(arg0);
      // @ts-ignore
      window.squatchConfig = {
        domain: "https://www.example.com",
      };
    });
    and(/^the "(.*)" attribute is set to "(.*)"$/, (arg0, arg1) => {
      const attr = sanitize(arg0) as string;
      const value = sanitize(arg1) as string;
      el.setAttribute(attr, value);
    });
    and(
      "_saasquatchExtra is included in the url with payload as the following",
      (docString) => {
        const payload = btoa(docString);
        window.location.search = `?_saasquatchExtra=${payload}`;
      }
    );
    when("the component loads", async () => {
      document.body.appendChild(el);
      await expect(
        waitUntil(() => el.shadowRoot!.querySelector("iframe"), "no iframe")
      ).resolves.toBeUndefined();
    });
    then(
      /^the component's WidgetAPI has "(.*)" set to "(.*)"$/,
      (arg0, arg1) => {
        const field = sanitize(arg0) as string;
        const value = sanitize(arg1);

        expect(el.widgetApi[field]).toBe(value);
      }
    );
    and(
      /^the component's WidgetAPI has "(.*)" set to "(.*)"$/,
      (arg0, arg1) => {
        const field = sanitize(arg0) as string;
        const value = sanitize(arg1);

        expect(el.widgetApi[field]).toBe(value);
      }
    );
    and(
      /^the component's AnalyticsAPI has "(.*)" set to "(.*)"$/,
      (arg0, arg1) => {
        const field = sanitize(arg0) as string;
        const value = sanitize(arg1);

        expect(el.analyticsApi[field]).toBe(value);
      }
    );
    and(/^the widget loaded has widgetType "(.*)"$/, (arg0) => {
      const value = sanitize(arg0);

      const iframe = el.shadowRoot?.querySelector("iframe");
      const content = iframe?.contentDocument?.body?.innerHTML;
      expect(content).toContain(value);
    });
    and(/^the widget will be rendered as a "(.*)" widget$/, (arg0) => {
      const value = sanitize(arg0);

      const iframe = el.shadowRoot?.querySelector("iframe");
      const content = iframe?.contentDocument?.body?.innerHTML;
      expect(content).toContain(value);
    });
  });

  test("Opening and closing squatch-embed component", ({
    given,
    and,
    when,
    then,
  }) => {
    let el!: DeclarativeEmbedWidget;
    Background(given);

    given(/^"(.*)" is included in the page's HTML$/, (arg0) => {
      el = specificWebComponentIsIncluded(arg0);
    });

    and("the widget's iframe loads correctly into the DOM", async () => {
      el.setAttribute("widget", "w/widget-type");
      document.body.appendChild(el);
      await expect(
        waitUntil(() => el.shadowRoot!.querySelector("iframe"), "no iframe")
      ).resolves.toBeUndefined();
    });

    and(/^the web component (.*)$/, (arg0) => {
      const isVisible = sanitize(arg0);
      const visibility = el.style.visibility !== "hidden";
      if (isVisible === "is visible") {
        expect(visibility).toBe(true);
      } else if (isVisible === "is not visible") {
        el.style.visibility = "hidden";
      } else {
        fail();
      }
    });

    when(/^the (.*) is called on the web component instance$/, (arg0) => {
      const method = sanitize(arg0);
      if (method === "open") {
        el.open();
      } else if (method === "close") {
        el.close();
      } else {
        fail();
      }
    });

    then(/^the web component (.*)$/, (arg0) => {
      const isVisible = sanitize(arg0);
      const visibility = el.style.visibility !== "hidden";
      if (isVisible === "is visible") {
        expect(visibility).toBe(true);
      } else if (isVisible === "is not visible") {
        expect(visibility).toBe(false);
      } else {
        fail();
      }
    });
  });
  test("Opening and closing squatch-popup component", ({
    given,
    and,
    when,
    then,
  }) => {
    let el!: DeclarativePopupWidget;
    let dialog!: HTMLDialogElement;
    Background(given);

    given(/^"(.*)" is included in the page's HTML$/, (arg0) => {
      el = specificWebComponentIsIncluded(arg0);
    });

    and("the widget's iframe loads correctly into the DOM", async () => {
      el.setAttribute("widget", "w/widget-type");
      document.body.appendChild(el);
      await expect(
        waitUntil(() => el.shadowRoot!.querySelector("iframe"), "no iframe")
      ).resolves.toBeUndefined();

      dialog = el.shadowRoot!.querySelector("dialog") as HTMLDialogElement;
      expect(dialog).toBeDefined();
    });

    and(/^the dialog element (.*) open$/, (arg0) => {
      const isOrNot = sanitize(arg0);
      if (isOrNot === "is") {
        dialog.show();
      } else if (isOrNot === "is not") {
        dialog.close();
      } else {
        fail();
      }
    });

    when(/^the (.*) is called on the web component instance$/, (arg0) => {
      const method = sanitize(arg0);
      if (method === "open") {
        el.open();
      } else if (method === "close") {
        el.close();
      } else {
        fail();
      }
    });

    then(/^the dialog element (.*) open$/, (arg0) => {
      const isOrNot = sanitize(arg0);
      if (isOrNot === "is") {
        expect(dialog.open).toBe(true);
      } else if (isOrNot === "is not") {
        expect(dialog.open).toBe(false);
      } else {
        fail();
      }
    });
  });
});
