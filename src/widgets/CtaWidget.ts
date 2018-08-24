import * as debug from 'debug';
import ResizeObserver from 'resize-observer-polyfill';

import PopupWidget from './PopupWidget';
import { domready } from '../utils/domready';
import { Params } from './Widget';

const _log = debug('squatch-js:CTAwidget');

/**
 * A CtaWidget is displayed on top of your page
 *
 * To create a CtaWidget use {@link Widgets}
 *
 */
export default class CtaWidget extends PopupWidget {

  position: string;
  side: string;
  positionClass: string;
  ctaFrame: HTMLIFrameElement;

  constructor(params:Params, opts) {
    _log('CTA constructor');
    const ctaElement = document.createElement('div');
    ctaElement.id = 'cta';
    document.body.appendChild(ctaElement);

    super(params, '#cta');

    if (!opts.side && !opts.position) {
      opts.position = 'bottom';
      opts.side = 'right';
    }

    if (opts.position === 'middle') {
      this.position = 'top: 45%;';
      this.side = (opts.side === 'center') ? 'right: 45%;' : `${opts.side}: -10px;`;
    } else {
      this.position = `${opts.position}: -10px;`;
      this.side = (opts.side === 'center') ? 'right: 45%;' : `${opts.side}: 20px;`;
    }

    this.positionClass = opts.position;

    this.ctaFrame = document.createElement('iframe');
    // @ts-ignore - we are creating this pass-through
    this.ctaFrame.squatchJsApi = this;
    this.ctaFrame.scrolling = 'no';
    this.ctaFrame.setAttribute('style', `border:0; background-color:transparent; position:fixed; display:none;${this.side}${this.position}`);

    document.body.appendChild(this.ctaFrame);
    _log('ctaframe appended to body');
  }

  load() {
    super.load();

    if(!this.frame.contentWindow){
      throw new Error("frame requires a contentWindow");
    }
    const widgetFrameDoc = this.frame.contentWindow.document;
    const ctaFrame = this.ctaFrame;
    const positionClass = this.positionClass;

    // Wait for widget doc to be ready to grab the cta HTML
    domready(widgetFrameDoc, () => {
      const ctaElement = widgetFrameDoc.getElementById('cta');

      if (ctaElement) {
        if(!ctaElement.parentNode){
          throw new Error("ctaElement requires a parentNode");
        }
        ctaElement.parentNode.removeChild(ctaElement);

        if(!ctaFrame.contentWindow){
          throw new Error("ctaFrame requires a contentWindow");
        }
        const ctaFrameDoc = ctaFrame.contentWindow.document;
        ctaFrameDoc.open();
        ctaFrameDoc.write(ctaElement.innerHTML);
        ctaFrameDoc.close();

        // Figure out size of CTA as well
        domready(ctaFrameDoc, () => {
          const ctaContainer = ctaFrameDoc.getElementsByClassName('cta-container')[0];
          // @ts-ignore - Assume it's a stylable element, die otherwise
          ctaContainer.style.position = 'fixed';
          // @ts-ignore - Assume it's an element with offsetHeight
          ctaFrame.height = ctaContainer.offsetHeight;
          // @ts-ignore - Browser will cast from number to string (we hope)
          ctaFrame.width = ctaContainer.scrollWidth;

          ctaFrame.style.display = 'block';

          if (!ctaContainer.classList.contains(positionClass)) {
            ctaContainer.className += ` ${positionClass}`;
          }

          // Adjust frame height when size of body changes
          const ro = new ResizeObserver((entries) => {
            for (const entry of entries) {
              const { height, width } = entry.contentRect;
              // @ts-ignore - Browser will cast from number to string (we hope)
              ctaFrame.height = height;
              // @ts-ignore - Browser will cast from number to string (we hope)
              ctaFrame.width = width;
            }
          });

          ro.observe(ctaContainer);

          _log('CTA template loaded into iframe');
        });
      } else {
        _log(new Error('CTA element not found in theme'));
      }
    });
  }

  /**
   *  @inheritdoc
   */
  open() {
    super.open();
  }
  /**
   *  @inheritdoc
   */
  close() {
    super.close();
  }
}
