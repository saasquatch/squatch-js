// @ts-check

import debug from 'debug';
import ResizeObserver from 'resize-observer-polyfill';
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

  load() {

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
    frameDoc.close();

    domready(frameDoc, () => {
      const _sqh = contentWindow.squatch;
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
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { height } = entry.contentRect;
          // @ts-ignore -- number will be cast to string by browsers
          this.frame.height = height;
        }
      });

      ro.observe(this._findInnerContainer());

      this._loadEvent(_sqh);
      _log('loaded');
    });
  }

  reload({email, firstName, lastName}, jwt) {
    if(!this.frame.contentWindow){
      throw new Error("Frame needs a content window");
    }
    const frameDoc = this.frame.contentWindow.document;

    this.widgetApi.cookieUser({
      user: {
        email: email || null,
        firstName: firstName || null,
        lastName: lastName || null,
      },
      engagementMedium: 'EMBED',
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
