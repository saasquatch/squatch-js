import { _getAutoConfig } from "../../src/utils/utmUtils";
import { b64encode } from "../../src/utils/cookieUtils";
import * as squatch from "../../src/squatch";
import Widgets from "../../src/widgets/Widgets";

const DOMAIN = "app.referralsaasquatch.com";

const extra = (payload: unknown) =>
  `https://shop.example.com/?_saasquatchExtra=${b64encode(JSON.stringify(payload))}`;

const forTenant = (tenantAlias: string, entry: Record<string, unknown>) => ({
  [DOMAIN]: { [tenantAlias]: entry },
});

let warn: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  // @ts-ignore -- window globals are page-owned and may be absent
  delete window.squatchTenant;
  // @ts-ignore
  delete window.squatchConfig;
});

afterEach(() => {
  warn.mockRestore();
});

describe("_getAutoConfig rejects", () => {
  test("payload when the page has not declared a tenant", () => {
    window.location.href = extra(
      forTenant("attacker_tenant", { autoPopupWidgetType: "p/x/w/friendWidget" }),
    );

    expect(_getAutoConfig()).toBeUndefined();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("window.squatchTenant"));
  });

  test("payload for a different tenant than the page declared", () => {
    window.squatchTenant = "legit_tenant";
    window.location.href = extra(
      forTenant("attacker_tenant", { autoPopupWidgetType: "p/x/w/friendWidget" }),
    );

    expect(_getAutoConfig()).toBeUndefined();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('"legit_tenant"'));
  });

  test("payload for a different tenant than a prior init() declared", () => {
    window.squatchTenant = "attacker_tenant";
    window.location.href = extra(
      forTenant("attacker_tenant", { autoPopupWidgetType: "p/x/w/friendWidget" }),
    );

    expect(_getAutoConfig({ tenantAlias: "legit_tenant", domain: `https://${DOMAIN}` })).toBeUndefined();
  });

  test("payload keyed to a different API domain", () => {
    window.squatchTenant = "legit_tenant";
    window.location.href = extra({
      "evil.example.com": { legit_tenant: { autoPopupWidgetType: "p/x/w/friendWidget" } },
    });

    expect(_getAutoConfig()).toBeUndefined();
  });

  test.each([
    ["missing", {}],
    ["empty", { autoPopupWidgetType: "" }],
    ["non-string", { autoPopupWidgetType: { widgetType: "x" } }],
  ])("%s autoPopupWidgetType", (_, entry) => {
    window.squatchTenant = "legit_tenant";
    window.location.href = extra(forTenant("legit_tenant", entry));

    expect(_getAutoConfig()).toBeUndefined();
  });

  test("undecodable payload without throwing", () => {
    window.squatchTenant = "legit_tenant";
    window.location.href = "https://shop.example.com/?_saasquatchExtra=%%%not-base64";

    expect(_getAutoConfig()).toBeUndefined();
  });

  test("nothing when the param is absent", () => {
    window.squatchTenant = "legit_tenant";
    window.location.href = "https://shop.example.com/";

    expect(_getAutoConfig()).toBeUndefined();
    expect(warn).not.toHaveBeenCalled();
  });
});

describe("_getAutoConfig accepts", () => {
  test("only autoPopupWidgetType from the payload, as a popup", () => {
    window.squatchTenant = "legit_tenant";
    window.location.href = extra(
      forTenant("legit_tenant", {
        autoPopupWidgetType: "p/x/w/friendWidget",
        engagementMedium: "EMBED",
        container: "#login-form",
        trigger: "#buy-button",
        jwt: "ATTACKER_JWT",
        user: { id: "u", accountId: "a" },
        locale: "fr_FR",
      }),
    );

    expect(_getAutoConfig()).toEqual({
      widgetType: "p/x/w/friendWidget",
      engagementMedium: "POPUP",
      displayOnLoad: true,
    });
  });

  test("the declared tenant's entry when the payload holds several tenants", () => {
    window.squatchTenant = "legit_tenant";
    window.location.href = extra({
      [DOMAIN]: {
        attacker_tenant: { autoPopupWidgetType: "p/evil/w/friendWidget" },
        legit_tenant: { autoPopupWidgetType: "p/x/w/friendWidget" },
      },
    });

    expect(_getAutoConfig()?.widgetType).toBe("p/x/w/friendWidget");
  });

  test("a payload keyed to the domain the page configured", () => {
    window.squatchTenant = "legit_tenant";
    window.squatchConfig = { domain: "https://staging.referralsaasquatch.com" };
    window.location.href = extra({
      "staging.referralsaasquatch.com": {
        legit_tenant: { autoPopupWidgetType: "p/x/w/friendWidget" },
      },
    });

    expect(_getAutoConfig()?.widgetType).toBe("p/x/w/friendWidget");
  });
});

describe("_auto", () => {
  test("renders with the page's existing init() config instead of re-initialising", async () => {
    const render = vi.spyOn(Widgets.prototype, "render").mockResolvedValue(undefined);
    squatch.init({ tenantAlias: "legit_tenant", domain: "https://staging.referralsaasquatch.com" });
    const widgetsBefore = squatch.widgets();
    window.location.href = extra({
      "staging.referralsaasquatch.com": {
        legit_tenant: { autoPopupWidgetType: "p/x/w/friendWidget" },
      },
    });

    await squatch._auto();

    expect(squatch.widgets()).toBe(widgetsBefore);
    expect(squatch.api()?.tenantAlias).toBe("legit_tenant");
    expect(render).toHaveBeenCalledWith({
      widgetType: "p/x/w/friendWidget",
      engagementMedium: "POPUP",
      displayOnLoad: true,
    });
    render.mockRestore();
  });

  test("leaves the page's config untouched for a foreign tenant", async () => {
    const render = vi.spyOn(Widgets.prototype, "render").mockResolvedValue(undefined);
    squatch.init({ tenantAlias: "legit_tenant" });
    window.location.href = extra(
      forTenant("attacker_tenant", { autoPopupWidgetType: "p/x/w/friendWidget" }),
    );

    await squatch._auto();

    expect(squatch.api()?.tenantAlias).toBe("legit_tenant");
    expect(render).not.toHaveBeenCalled();
    render.mockRestore();
  });
});
