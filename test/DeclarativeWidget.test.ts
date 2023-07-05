import { defineCE, fixtureCleanup, waitUntil } from "@open-wc/testing-helpers";
import Cookies from "js-cookie";
import { DeclarativeEmbedWidget, DeclarativePopupWidget } from "../src/squatch";
import { PASSWORDLESS, VERIFIED } from "./mocks/handlers";
import { server } from "./mocks/server";

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
afterEach(() => server.resetHandlers());
afterAll(() => {
  server.close();
  jest.clearAllMocks();
});

describe("DeclarativeEmbedWidget", () => {
  test("Throws error on load without widget attribute", async () => {
    const tag = defineCE(class Test extends DeclarativeEmbedWidget {});
    const el = document.createElement(`${tag}`) as DeclarativeEmbedWidget;
    expect(el).toBeInstanceOf(DeclarativeEmbedWidget);

    await expect(async () => await el.connectedCallback()).rejects.toThrowError(
      "No widget has been specified"
    );

    const iframe = el.shadowRoot!.querySelector("iframe");
    expect(iframe).toBe(null);
  });
  test("Verified widget load", async () => {
    window.squatchTenant = "TENANT_ALIAS";
    window.squatchToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiaXJ0ZXN0IiwiYWNjb3VudElkIjoiaXJ0ZXN0In0sImVudiI6eyJ0ZW5hbnRBbGlhcyI6InRlc3RfYThiNDFqb3RmOGExdiIsImRvbWFpbiI6Imh0dHBzOi8vc3RhZ2luZy5yZWZlcnJhbHNhYXNxdWF0Y2guY29tIn19";
    window.squatchConfig = {
      domain: "https://staging.referralsaasquatch.com",
    };

    const tag = defineCE(class Test extends DeclarativeEmbedWidget {});
    const el = document.createElement(`${tag}`) as DeclarativeEmbedWidget;
    el.setAttribute("widget", "w/widget-type");
    document.body.appendChild(el);

    await waitUntil(
      () => !!el.shadowRoot!.querySelector("iframe"),
      "no iframe"
    );

    const frame = el.shadowRoot!.querySelector("iframe");
    expect(frame).toBeDefined();
    expect(frame).toBe(el.frame);

    expect(frame?.contentDocument?.body.innerHTML).toContain(VERIFIED);
    expect(frame?.contentDocument?.body.innerHTML).toContain("EMBED");
  });

  test("Passwordless widget load", async () => {
    const tag = defineCE(class Test extends DeclarativeEmbedWidget {});
    const el = document.createElement(`${tag}`) as DeclarativeEmbedWidget;
    el.setAttribute("widget", "w/widget-type");
    document.body.appendChild(el);

    await waitUntil(
      () => !!el.shadowRoot!.querySelector("iframe"),
      "no iframe"
    );

    const frame = el.shadowRoot!.querySelector("iframe");
    expect(frame).toBeDefined();
    expect(frame).toBe(el.frame);

    expect(frame?.contentDocument?.body.innerHTML).toContain(PASSWORDLESS);
    expect(frame?.contentDocument?.body.innerHTML).toContain("EMBED");
    expect(frame?.contentDocument?.body.innerHTML).toContain("w/widget-type");
  });
});

describe("DeclarativePopupWidget", () => {
  test("Throws error on load without widget attribute", async () => {
    const tag = defineCE(class Test extends DeclarativePopupWidget {});
    const el = document.createElement(`${tag}`) as DeclarativePopupWidget;
    expect(el).toBeInstanceOf(DeclarativePopupWidget);

    expect(async () => await el.connectedCallback()).rejects.toThrowError(
      "No widget has been specified"
    );

    const iframe = el.shadowRoot!.querySelector("iframe");
    expect(iframe).toBe(null);
  });
  test("Verified widget load", async () => {
    window.squatchTenant = "TENANT_ALIAS";
    window.squatchToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiaXJ0ZXN0IiwiYWNjb3VudElkIjoiaXJ0ZXN0In0sImVudiI6eyJ0ZW5hbnRBbGlhcyI6InRlc3RfYThiNDFqb3RmOGExdiIsImRvbWFpbiI6Imh0dHBzOi8vc3RhZ2luZy5yZWZlcnJhbHNhYXNxdWF0Y2guY29tIn19";
    window.squatchConfig = {
      domain: "https://staging.referralsaasquatch.com",
    };

    const tag = defineCE(class Test extends DeclarativePopupWidget {});
    const el = document.createElement(`${tag}`) as DeclarativePopupWidget;
    el.setAttribute("widget", "w/widget-type");
    document.body.appendChild(el);

    await expect(
      waitUntil(() => !!el.shadowRoot!.querySelector("dialog"), "no dialog")
    ).resolves.toBeUndefined();

    const dialog = el.shadowRoot!.querySelector("dialog");
    expect(dialog?.id).toBe("squatchModal");

    const frame = el.shadowRoot!.querySelector("iframe");
    expect(frame).toBeDefined();
    expect(frame).toBe(el.frame);

    expect(frame?.contentDocument?.body.innerHTML).toContain(VERIFIED);
    expect(frame?.contentDocument?.body.innerHTML).toContain("POPUP");
  });

  test("Passwordless widget load", async () => {
    const tag = defineCE(class Test extends DeclarativePopupWidget {});
    const el = document.createElement(`${tag}`) as DeclarativePopupWidget;
    el.setAttribute("widget", "w/widget-type");
    document.body.appendChild(el);

    await expect(
      waitUntil(() => !!el.shadowRoot!.querySelector("dialog"), "no dialog")
    ).resolves.toBeUndefined();

    const dialog = el.shadowRoot!.querySelector("dialog");
    expect(dialog?.id).toBe("squatchModal");

    const frame = el.shadowRoot!.querySelector("iframe");
    expect(frame).toBeDefined();
    expect(frame).toBe(el.frame);

    expect(frame?.contentDocument?.body.innerHTML).toContain(PASSWORDLESS);
    expect(frame?.contentDocument?.body.innerHTML).toContain("POPUP");
    expect(frame?.contentDocument?.body.innerHTML).toContain("w/widget-type");
  });
});
