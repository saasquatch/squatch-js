// @ts-check

import debug from "debug";
import AnalyticsApi from "../api/AnalyticsApi";
import WidgetApi from "../api/WidgetApi";
import { WidgetType } from "../types";

/** @hidden */
const _log = debug("squatch-js:widget");

export interface Params{
  type: WidgetType;
  domain: string;
  content: string;
  api: WidgetApi;
  rsCode?: string;
}
/*
 *
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

  protected constructor(params:Params) {
    _log("widget initializing ...");
    this.content =
      params.content === "error" ? this._error(params.rsCode) : params.content;
    this.type = params.type;
    this.widgetApi = params.api;
    this.analyticsApi = new AnalyticsApi({ domain: params.domain });
    this.frame = document.createElement("iframe");
    this.frame["squatchJsApi"] = this;
    this.frame.width = "100%";
    this.frame.scrolling = "no";
    this.frame.setAttribute("style", "border: 0; background-color: none;");
  }

  abstract load();

  protected _loadEvent(sqh) {
    if (sqh) {
      this.analyticsApi
        .pushAnalyticsLoadEvent({
          tenantAlias: sqh.analytics.attributes.tenant,
          externalAccountId: sqh.analytics.attributes.accountId,
          externalUserId: sqh.analytics.attributes.userId,
          engagementMedium: sqh.mode.widgetMode,
        })
        .then(response => {
          _log(`${sqh.mode.widgetMode} loaded event recorded. ${response}`);
        })
        .catch(ex => {
          _log(new Error(`pushAnalyticsLoadEvent() ${ex}`));
        });
    }
  }

 protected _shareEvent(sqh, medium) {
    if (sqh) {
      this.analyticsApi
        .pushAnalyticsShareClickedEvent({
          tenantAlias: sqh.analytics.attributes.tenant,
          externalAccountId: sqh.analytics.attributes.accountId,
          externalUserId: sqh.analytics.attributes.userId,
          engagementMedium: sqh.mode.widgetMode,
          shareMedium: medium
        })
        .then(response => {
          _log(
            `${sqh.mode.widgetMode} share ${medium} event recorded. ${response}`
          );
        })
        .catch(ex => {
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
          emailList
        })
        .then(response => {
          _log(`Sent email invites to share ${emailList}. ${response}`);
        })
        .catch(ex => {
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
      <link rel="stylesheet" media="all" href="https://d2rcp9ak152ke1.cloudfront.net/assets/css/widget/errorpage.min.css">
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
          <div class="sadface"><img src="https://d2rcp9ak152ke1.cloudfront.net/assets/images/face.png"></div>
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

  protected async _findInnerContainer():Promise<Element> {
    const { contentWindow } = this.frame;
    if (!contentWindow)
      throw new Error("Squatch.hs frame inner frame is empty");
    const frameDoc = contentWindow.document;

    function search(){
      const containers = frameDoc.getElementsByTagName("sqh-global-container");
      const legacyContainers = frameDoc.getElementsByClassName(
        "squatch-container"
      );
      const fallback =
        containers.length > 0
          ? containers[0]
          : legacyContainers.length > 0
            ? legacyContainers[0]
            : null;
      return fallback;
    }

    let found:Element|null = null;
    for (let i = 0; i < 50; i++){
      found = search();
      if(found) break;
      await delay(100);
    }
    if (!found){
      return frameDoc.body;
    } 
    return found;
  }
}


function delay (duration) {
  return new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve();
    }, duration)
  })
}