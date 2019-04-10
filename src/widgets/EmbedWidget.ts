// @ts-check

import debug from 'debug';
import Widget, { Params } from './Widget';
import { domready } from '../utils/domready';

const _log = debug('squatch-js:EMBEDwidget');

/**
 * An EmbedWidget is displayed inline in part of your page.
 *
 * To create an EmbedWidget use {@link Widgets}
 *
 */
export default class EmbedWidget extends Widget {
  element: Element;
  
  constructor(params:Params, selector = '#squatchembed') {
    super(params);

    const element = document.querySelector(selector) || document.querySelector('.squatchembed');

    if (!element) throw new Error(`element with selector '${selector}' not found.'`);
    this.element = element;
  }

  async load() {

    if (!this.element.firstChild || this.element.firstChild.nodeName === '#text') {
      this.element.appendChild(this.frame);
    }
    const {contentWindow} = this.frame;
    if(!contentWindow){
      throw new Error("Frame needs a content window");
    }

    const frameDoc = contentWindow.document;
    frameDoc.open();
    frameDoc.write(this.content);
    frameDoc.write(`<script src="https://cdn.jsdelivr.net/npm/resize-observer-polyfill@1.5.x"></script>`);
    frameDoc.close();

    domready(frameDoc, async () => {
      const _sqh = contentWindow.squatch || contentWindow.widgetIdent;
      const ctaElement = frameDoc.getElementById('cta');

      if (ctaElement) {
        if(!ctaElement.parentNode){
          throw new Error("ctaElement needs a parentNode");
        }
        ctaElement.parentNode.removeChild(ctaElement);
      }

      // @ts-ignore -- number will be cast to string by browsers
      this.frame.height = frameDoc.body.scrollHeight;

      // Adjust frame height when size of body changes
      // @ts-ignore
      const ro = new contentWindow["ResizeObserver"]((entries) => {
        for (const entry of entries) {
          const { height } = entry.contentRect;
          // @ts-ignore -- number will be cast to string by browsers
          this.frame.height = height;
        }
      });

      ro.observe(await this._findInnerContainer());

      this._loadEvent(_sqh);
      _log('loaded');
    });

  }

  reload({email, firstName, lastName}, jwt) {
    const frameWindow = this.frame.contentWindow;

    if (!frameWindow) {
      throw new Error("Frame needs a content window");
    }

    const userType = this.context;

    if (!userType) {
      throw new Error("I don't know how this user was created, I can't process this form correctly");
    }

    //@ts-ignore -- will occasionally throw a null pointer exception at runtime
    const squatchObj = frameWindow.squatch;
    const hasAnalyticsData = squatchObj && squatchObj.analytics;

    _log(`Widget ${hasAnalyticsData ? "v1" : "v2"} reloading...`)

    //@ts-ignore -- will occasionally throw a null pointer exception at runtime
    const frameDoc = frameWindow.document;

    let userObj = {}

    if (userType === 'upsert') {
      userObj = {
        email: email || null,
        firstName: firstName || null,
        lastName: lastName || null,
        //@ts-ignore -- will occasionally throw a null pointer exception at runtime
        id: hasAnalyticsData ? squatchObj.analytics.attributes.userId : null,
        //@ts-ignore -- will occasionally throw a null pointer exception at runtime
        accountId: hasAnalyticsData ? squatchObj.analytics.attributes.accountId : null
      }
    } else if (userType === 'cookie') {
      userObj = {
        email: email || null,
        firstName: firstName || null,
        lastName: lastName || null
      }
    }

    const fn = userType === 'upsert' ? "upsertUser" : "cookieUser";

    this.widgetApi[fn]({
      // @ts-ignore this will never be called with upsertUser without having id and account id in the userObj
      user: userObj,
      engagementMedium: "EMBED",
      widgetType: this.type,
      jwt,
    }).then(({template}) => {
      if (template) {
        this.content = template;
        const showStatsBtn = frameDoc.createElement('button');
        const registerForm = frameDoc.getElementsByClassName('squatch-register')[0];

        if (registerForm) {
          showStatsBtn.className = 'btn btn-primary';
          showStatsBtn.id = 'show-stats-btn';
          showStatsBtn.textContent = (this.type === 'REFERRER_WIDGET') ? 'Show Stats' : 'Show Reward';

          showStatsBtn.setAttribute('style', 'margin-top: 10px; max-width: 130px; width: 100%;');
          showStatsBtn.onclick = () => {
            this.load();
          };

          // @ts-ignore -- expect register form to be a stylable element
          registerForm.style.paddingTop = '30px';
          registerForm.innerHTML = `<p><strong>${email}</strong><br>Has been successfully registered</p>`;
          registerForm.appendChild(showStatsBtn);
        }
      }
    }).catch(({message}) => {
      _log(`${message}`);
    });

  }

  protected _error(rs, mode = 'embed', style = '') {
    return super._error(rs, mode, style);
  }
}
