// @ts-check
import { debug } from "debug";
import AnalyticsApi, { SQHDetails } from "../api/AnalyticsApi";
import WidgetApi from "../api/WidgetApi";
import { EngagementMedium, WidgetContext, WidgetType } from "../types";
import { isObject } from "../utils/validate";

/** @hidden */
const _log = debug("squatch-js:widget");

export interface Params {
  type: WidgetType;
  domain: string;
  npmCdn: string;
  content: string;
  api: WidgetApi;
  rsCode?: string;
  context: WidgetContext;
  container?: string | HTMLElement | null | undefined;
}

export type ProgramLoadEvent = {
  programId: string;
  tenantAlias?: string;
  accountId?: string;
  userId?: string;
  engagementMedium?: EngagementMedium;
};
export type GenericLoadEvent = {
  mode: any;
  analytics: any;
};
export type WidthSetting = {
  value: number;
  unit: "px" | "%";
};
export type WidgetWidths = {
  minWidth: WidthSetting;
  maxWidth: WidthSetting;
};

/*
 * The Widget class is the base class for the different widget types available
 *
 * Creates an `iframe` in which the html content of the widget gets embedded.
 * Uses element-resize-detector (https://github.com/wnr/element-resize-detector)
 * for listening to the height of the widget content and make the iframe responsive.
 *
 */
export default abstract class Widget {
  type: WidgetType;
  content: string;
  analyticsApi: AnalyticsApi;
  widgetApi: WidgetApi;
  context: WidgetContext;
  npmCdn: string;
  container: string | HTMLElement | undefined | null;
  loadEventListener: EventListener | null = null;

  protected constructor(params: Params) {
    _log("widget initializing ...");
    this.content =
      params.content === "error" ? this._error(params.rsCode) : params.content;
    this.type = params.type;
    this.widgetApi = params.api;
    this.npmCdn = params.npmCdn;
    this.analyticsApi = new AnalyticsApi({ domain: params.domain });
    this.context = params.context;
    this.container = params.context?.container || params.container;
  }

  _findElement(): HTMLElement {
    let element: Element | null;

    if (typeof this.container === "string") {
      // selector is a string
      element = document.querySelector(this.container);
      _log("loading widget with selector", element);
      // selector is an HTML element
    } else if (this.container instanceof HTMLElement) {
      element = this.container;
      _log("loading widget with container", element);
      // garbage container found
    } else if (this.container) {
      element = null;
      _log("container must be an HTMLElement or string", this.container);
      // find element on page
    } else {
      element =
        document.querySelector("#squatchembed") ||
        document.querySelector(".squatchembed") ||
        document.querySelector("#impactembed") ||
        document.querySelector(".impactembed");

      _log("loading widget with default selector", element);
    }

    if (!(element instanceof HTMLElement))
      throw new Error(
        `element with selector '${
          this.container ||
          "#squatchembed, .squatchembed, #impactembed, or .impactembed"
        }' not found.'`
      );

    return element;
  }

  _createFrame(options?: { minWidth?: string; maxWidth?: string }) {
    const frame = document.createElement("iframe");
    frame["squatchJsApi"] = this;
    frame.id = "squatchFrame";
    frame.width = "100%";

    frame.src = "about:blank";
    frame.scrolling = "no";
    frame.setAttribute(
      "style",
      "border: 0; background-color: none; width: 1px; min-width: 100%;"
    );

    if (options?.minWidth) frame.style.minWidth = options.minWidth;
    if (options?.maxWidth) frame.style.maxWidth = options.maxWidth;
    if (options?.maxWidth || options?.minWidth) {
      // Avoid 1px width when custom width is set
      frame.style.width = "100%";
    }

    return frame;
  }

  _findFrame() {
    const element = this.container ? this._findElement() : document.body;
    const parent = element.shadowRoot || element;
    return parent.querySelector(
      "iframe#squatchFrame"
    ) as HTMLIFrameElement | null;
  }

  abstract load(): void;

  protected _detachLoadEventListener(frameDoc: Document) {
    if (this.loadEventListener) {
      frameDoc.removeEventListener(
        "sq:user-registration",
        this.loadEventListener
      );

      this.loadEventListener = null;
    }
  }

  protected _attachLoadEventListener(
    frameDoc: Document,
    sqh: ProgramLoadEvent | GenericLoadEvent
  ) {
    if (this.loadEventListener === null) {
      this.loadEventListener = (
        e: CustomEvent<{ userId: string; accountId: string }>
      ) => {
        this._loadEvent({
          ...sqh,
          userId: e.detail.userId,
          accountId: e.detail.accountId,
        });
      };

      frameDoc.addEventListener("sq:user-registration", this.loadEventListener);
    }
  }

  protected _loadEvent(sqh: ProgramLoadEvent | GenericLoadEvent) {
    if (!sqh) return; // No non-truthy value
    if (!isObject(sqh)) {
      throw new Error("Widget Load event identity property is not an object");
    }

    let params: SQHDetails;
    if ("programId" in sqh) {
      if (
        !sqh.tenantAlias ||
        !sqh.accountId ||
        !sqh.userId ||
        !sqh.engagementMedium
      )
        throw new Error("Widget Load event missing required properties");

      params = {
        tenantAlias: sqh.tenantAlias,
        externalAccountId: sqh.accountId,
        externalUserId: sqh.userId,
        engagementMedium: sqh.engagementMedium,
        programId: sqh.programId,
      };
    } else {
      const { analytics, mode } = sqh;
      params = {
        tenantAlias: analytics.attributes.tenant,
        externalAccountId: analytics.attributes.accountId,
        externalUserId: analytics.attributes.userId,
        engagementMedium: mode.widgetMode,
      };
    }

    this.analyticsApi
      .pushAnalyticsLoadEvent(params)
      ?.then((response) => {
        _log(`${params.engagementMedium} loaded event recorded.`);
      })
      .catch((ex) => {
        _log(`ERROR: pushAnalyticsLoadEvent() ${ex}`);
      });
  }

  protected _shareEvent(sqh, medium) {
    if (sqh) {
      this.analyticsApi
        .pushAnalyticsShareClickedEvent({
          tenantAlias: sqh.analytics.attributes.tenant,
          externalAccountId: sqh.analytics.attributes.accountId,
          externalUserId: sqh.analytics.attributes.userId,
          engagementMedium: sqh.mode.widgetMode,
          shareMedium: medium,
        })
        .then((response) => {
          _log(
            `${sqh.mode.widgetMode} share ${medium} event recorded. ${response}`
          );
        })
        .catch((ex) => {
          _log(`ERROR: pushAnalyticsShareClickedEvent() ${ex}`);
        });
    }
  }

  protected _error(rs, mode = "modal", style = "") {
    const errorTemplate = `<!DOCTYPE html>
    <!--[if IE 7]><html class="ie7 oldie" lang="en"><![endif]-->
    <!--[if IE 8]><html class="ie8 oldie" lang="en"><![endif]-->
    <!--[if gt IE 8]><!--><html lang="en"><!--<![endif]-->
    <head>
      <link rel="stylesheet" media="all" href="https://fast.ssqt.io/assets/css/widget/errorpage.css">
      <style>
        ${style}
      </style>
    </head>
    <body>

      <div class="squatch-container ${mode}" style="width:100%">
        <div class="errorheader">
          <button type="button" class="close" onclick="window.frameElement.squatchJsApi.close();">&times;</button>
          <p class="errortitle">Error</p>
        </div>
        <div class="errorbody">
          <div class="sadface"><img src="https://fast.ssqt.io/assets/images/face.png"></div>
          <h4>Our referral program is temporarily unavailable.</h4><br>
          <p>Please reload the page or check back later.</p>
          <p>If the persists please contact our support team.</p>
          <br>
          <br>
          <div class="right-align errtxt">
            Error Code: ${rs}
          </div>
        </div>
      </div>
    </body>
    </html>`;

    return errorTemplate;
  }

  protected async _findInnerContainer(
    frame: HTMLIFrameElement
  ): Promise<Element> {
    const { contentWindow } = frame;
    if (!contentWindow)
      throw new Error("Squatch.js frame inner frame is empty");
    const frameDoc = contentWindow.document;

    function search() {
      const containers = frameDoc.getElementsByTagName("sqh-global-container");
      const legacyContainers =
        frameDoc.getElementsByClassName("squatch-container");
      const fallback =
        containers.length > 0
          ? containers[0]
          : legacyContainers.length > 0
          ? legacyContainers[0]
          : null;
      return fallback;
    }

    let found: Element | null = null;
    for (let i = 0; i < 5; i++) {
      found = search();
      if (found) break;
      await delay(100);
    }
    if (!found) {
      return frameDoc.body;
    }
    return found;
  }

  /**
   * Reloads the current widget, makes updated request to API and renders result.
   * Primarily for Classic widgets with registration
   * @param param0 Form field values
   * @param jwt JWT for API authentication
   */
  reload({ email, firstName, lastName }, jwt) {
    const frame = this._findFrame();
    if (!frame) throw new Error("Could not find widget iframe");
    const frameWindow = frame.contentWindow;

    const engagementMedium = this.context.engagementMedium || "POPUP";

    if (!frameWindow) {
      throw new Error("Frame needs a content window");
    }

    let response;

    if (this.context.type === "upsert") {
      if (!this.context.user) throw new Error("Can't reload without user ids");

      let userObj = {
        email: email || null,
        firstName: firstName || null,
        lastName: lastName || null,

        id: this.context.user!.id,
        accountId: this.context.user!.accountId,
      };

      response = this.widgetApi.upsertUser({
        user: userObj,
        engagementMedium,
        widgetType: this.type,
        jwt,
      });
    } else if (this.context.type === "passwordless") {
      response = this.widgetApi.render({
        user: undefined,
        engagementMedium,
        widgetType: this.type,
        jwt: undefined,
      });
    } else {
      throw new Error("can't reload an error widget");
    }

    response
      .then(({ template }) => {
        if (template) {
          this.content = template;

          // Support for classic widget registration forms
          this.__deprecated__register(
            frame,
            { email, engagementMedium },
            () => {
              this.load();

              // @ts-ignore -- open exists in the PopupWidget, so this call will always exist when it's called.
              engagementMedium === "POPUP" && this.open();
            }
          );
        }
      })
      .catch(({ message }) => {
        _log(`${message}`);
      });
  }

  private __deprecated__register(frame, params, onClick) {
    const frameWindow = frame.contentWindow;
    const frameDoc = frameWindow.document;
    const showStatsBtn = frameDoc.createElement("button");
    const registerForm = frameDoc.getElementsByClassName("squatch-register")[0];

    if (registerForm) {
      showStatsBtn.className = "btn btn-primary";
      showStatsBtn.id = "show-stats-btn";

      showStatsBtn.textContent =
        this.type === "REFERRER_WIDGET" ? "Show Stats" : "Show Reward";

      const widgetStyle =
        params.engagementMedium === "POPUP"
          ? "margin-top: 10px; max-width: 130px; width: 100%;"
          : "margin-top: 10px;";

      showStatsBtn.setAttribute("style", widgetStyle);
      showStatsBtn.onclick = onClick;

      // @ts-ignore -- expect register form to be a stylable element
      registerForm.style.paddingTop = "30px";
      registerForm.innerHTML = `<p><strong>${params.email}</strong><br>Has been successfully registered</p>`;
      registerForm.appendChild(showStatsBtn);
    }
  }
}

function delay(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}
