// @ts-check

import debug from "debug";
import AnalyticsApi, { SQHDetails } from "../api/AnalyticsApi";
import WidgetApi from "../api/WidgetApi";
import { WidgetType, WidgetContext, EngagementMedium } from "../types";
import { isObject, hasProps } from "../utils/validate";

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
}
/*
 * The Widget class is the base class for the different widget types available
 *
 * Creates an `iframe` in which the html content of the widget gets embedded.
 * Uses element-resize-detector (https://github.com/wnr/element-resize-detector)
 * for listening to the height of the widget content and make the iframe responsive.
 *
 */
export default abstract class Widget {
  frame: HTMLIFrameElement;
  type: WidgetType;
  content: string;
  analyticsApi: AnalyticsApi;
  widgetApi: WidgetApi;
  context: WidgetContext;
  npmCdn: string;

  protected constructor(params: Params) {
    _log("widget initializing ...");
    this.content =
      params.content === "error" ? this._error(params.rsCode) : params.content;
    this.type = params.type;
    this.widgetApi = params.api;
    this.npmCdn = params.npmCdn;
    this.analyticsApi = new AnalyticsApi({ domain: params.domain });
    this.frame = document.createElement("iframe");
    this.frame["squatchJsApi"] = this;
    this.frame.width = "100%";
    this.frame.scrolling = "no";
    this.frame.setAttribute(
      "style",
      "border: 0; background-color: none; width: 1px; min-width: 100%;"
    );
    this.context = params.context;
  }

  abstract load();

  protected _loadEvent(sqh: unknown) {
    if (!sqh) return; // No non-truthy value
    if (!isObject(sqh)) {
      throw new Error("Widget Load event identity property is not an object");
    }

    let params: SQHDetails;
    if (hasProps<{ programId: string }>(sqh, "programId")) {
      if (
        !hasProps<{
          tenantAlias: string;
          accountId: string;
          userId: string;
          engagementMedium: EngagementMedium;
        }>(sqh, ["tenantAlias", "accountId", "userId", "engagementMedium"])
      ) {
        throw new Error("Widget Load event missing required properties");
      }
      params = {
        tenantAlias: sqh.tenantAlias,
        externalAccountId: sqh.accountId,
        externalUserId: sqh.userId,
        engagementMedium: sqh.engagementMedium,
        programId: sqh.programId,
      };
    } else {
      const { analytics, mode } = sqh as any;
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
        _log(new Error(`pushAnalyticsLoadEvent() ${ex}`));
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
          _log(new Error(`pushAnalyticsLoadEvent() ${ex}`));
        });
    }
  }

  protected _inviteContacts(sqh, emailList) {
    if (sqh) {
      this.widgetApi
        .invite({
          tenantAlias: sqh.analytics.attributes.tenant,
          accountId: sqh.analytics.attributes.accountId,
          userId: sqh.analytics.attributes.userId,
          emailList,
        })
        .then((response) => {
          _log(`Sent email invites to share ${emailList}. ${response}`);
        })
        .catch((ex) => {
          _log(new Error(`invite() ${ex}`));
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

  protected async _findInnerContainer(): Promise<Element> {
    const { contentWindow } = this.frame;
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

  reload({ email, firstName, lastName }, jwt) {
    const frameWindow = this.frame.contentWindow;

    const engagementMedium = this.context.engagementMedium || "POPUP";

    if (!frameWindow) {
      throw new Error("Frame needs a content window");
    }

    const frameDoc = frameWindow.document;

    let response;

    if (this.context.type === "upsert") {
      let userObj = {
        email: email || null,
        firstName: firstName || null,
        lastName: lastName || null,

        // FIXME: Double check this
        id: this.context.user!.id,
        accountId: this.context.user!.accountId,
      };

      response = this.widgetApi.upsertUser({
        user: userObj,
        engagementMedium,
        widgetType: this.type,
        jwt,
      });
    } else if (this.context.type === "cookie") {
      let userObj = {
        email: email || null,
        firstName: firstName || null,
        lastName: lastName || null,
      };

      response = this.widgetApi.cookieUser({
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
          const showStatsBtn = frameDoc.createElement("button");
          const registerForm =
            frameDoc.getElementsByClassName("squatch-register")[0];

          if (registerForm) {
            showStatsBtn.className = "btn btn-primary";
            showStatsBtn.id = "show-stats-btn";

            showStatsBtn.textContent =
              this.type === "REFERRER_WIDGET" ? "Show Stats" : "Show Reward";

            const widgetStyle =
              engagementMedium === "POPUP"
                ? "margin-top: 10px; max-width: 130px; width: 100%;"
                : "margin-top: 10px;";

            showStatsBtn.setAttribute("style", widgetStyle);
            showStatsBtn.onclick = () => {
              this.load();

              // @ts-ignore -- open exists in the PopupWidget, so this call will always exist when it's called.
              engagementMedium === "POPUP" && this.open();
            };

            // @ts-ignore -- expect register form to be a stylable element
            registerForm.style.paddingTop = "30px";
            registerForm.innerHTML = `<p><strong>${email}</strong><br>Has been successfully registered</p>`;
            registerForm.appendChild(showStatsBtn);
          }
        }
      })
      .catch(({ message }) => {
        _log(`${message}`);
      });
  }
}

function delay(duration) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve();
    }, duration);
  });
}
