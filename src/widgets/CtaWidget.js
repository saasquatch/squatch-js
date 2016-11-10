import debug from 'debug';
import PopupWidget from './PopupWidget';
import { domready } from '../utils/domready';

const _log = debug('squatch-js:CTAwidget');

export default class CtaWidget extends PopupWidget {
  constructor(params, opts) {
    const ctaElement = document.createElement('div');
    ctaElement.id = 'cta';
    document.body.appendChild(ctaElement);

    super(params, 'cta');

    const me = this;

    if (!opts.side && !opts.position) {
      opts.position = 'bottom';
      opts.side = 'right';
    }

    if (opts.position === 'middle') {
      me.position = 'top: 45%;';
      me.side = (opts.side === 'center') ? 'right: 45%;' : `${opts.side}: -10px;`;
    } else {
      me.position = `${opts.position}: -10px;`;
      me.side = (opts.side === 'center') ? 'right: 45%;' : `${opts.side}: 20px;`;
    }

    me.positionClass = opts.position;

    me.ctaFrame = document.createElement('iframe');
    me.ctaFrame.squatchJsApi = me;
    me.ctaFrame.scrolling = "no";
    me.ctaFrame.style = `border:0; background-color:transparent; position:fixed; display:none;${me.side}${me.position}`;


    document.body.appendChild(this.ctaFrame);
  }

  load() {
    super.load();

    const widgetFrameDoc = this.frame.contentWindow.document;
    const ctaFrame = this.ctaFrame;
    const ctaFrameDoc = this.ctaFrame.contentWindow.document;
    const positionClass = ` ${this.positionClass}`;
    const erd = this.erd;

    // Wait for widget doc to be ready to grab the cta HTML
    domready(widgetFrameDoc, () => {
      const ctaElement = widgetFrameDoc.getElementById('cta');

      if (ctaElement) {
        ctaElement.parentNode.removeChild(ctaElement);

        ctaFrameDoc.open();
        ctaFrameDoc.write(ctaElement.innerHTML);
        ctaFrameDoc.close();

        // Figure out size of CTA as well
        domready(ctaFrameDoc, () => {
          ctaFrame.height = ctaFrameDoc.body.offsetHeight;
          ctaFrame.width = ctaFrameDoc.body.scrollWidth;

          ctaFrame.style.display = 'block';

          const ctaContainer = ctaFrameDoc.getElementsByClassName('cta-container')[0];
          ctaContainer.className += positionClass;

          erd.listenTo(ctaContainer, (element) => {
            const height = element.offsetHeight;
            const width = element.offsetWidth;
            ctaFrame.height = height;
            ctaFrame.width = width;
          });

          _log('CTA template loaded into iframe');
        });
      } else {
        _log(new Error('CTA element not found in theme'));
      }
    });
  }

  open() {
    super.open();
  }
}
