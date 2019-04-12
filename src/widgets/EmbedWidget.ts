// @ts-check

import debug from 'debug';
import Widget, { Params } from './Widget';
import { domready } from '../utils/domready';
import { User, CookieUser } from '../types';

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

  protected _error(rs, mode = 'embed', style = '') {
    return super._error(rs, mode, style);
  }
}
