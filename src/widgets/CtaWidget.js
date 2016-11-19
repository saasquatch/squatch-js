import debug from 'debug';
import PopupWidget from './PopupWidget';
import { domready } from '../utils/domready';

const _log = debug('squatch-js:CTAwidget');

/**
 * A CtaWidget is displayed on top of your page
 *
 * To create a CtaWidget use {@link Widgets}
 *
 */
export default class CtaWidget extends PopupWidget {
  /**
   * @private
   */
  constructor(params, opts) {
    _log('CTA constructor');
    const ctaElement = document.createElement('div');
    ctaElement.id = 'cta';
    document.body.appendChild(ctaElement);
    _log('cta Element appended to body');

    super(params, 'cta');
    _log('called popup constructor');

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

    _log('chose position class', me.positionClass);

    me.ctaFrame = document.createElement('iframe');
    me.ctaFrame.squatchJsApi = me;
    me.ctaFrame.scrolling = 'no';
    me.ctaFrame.setAttribute('style', `border:0; background-color:transparent; position:fixed; display:none;${me.side}${me.position}`);

    _log('cta Frame defined', me.ctaFrame);

    document.body.appendChild(this.ctaFrame);
    _log('ctaframe appended to body')
  }

  load() {
    super.load();

    const widgetFrameDoc = this.frame.contentWindow.document;
    const ctaFrame = this.ctaFrame;
    const positionClass = ` ${this.positionClass}`;
    const erd = this.erd;

    // Wait for widget doc to be ready to grab the cta HTML
    domready(widgetFrameDoc, () => {
      const ctaElement = widgetFrameDoc.getElementById('cta');

      if (ctaElement) {
        ctaElement.parentNode.removeChild(ctaElement);

        const ctaFrameDoc = ctaFrame.contentWindow.document;
        ctaFrameDoc.open();
        ctaFrameDoc.write(ctaElement.innerHTML);
        ctaFrameDoc.close();

        // Figure out size of CTA as well
        domready(ctaFrameDoc, () => {
          ctaFrame.height = ctaFrameDoc.body.offsetHeight;
          ctaFrame.width = ctaFrameDoc.body.scrollWidth;
          _log('first height', ctaFrame.height);
          _log('first width', ctaFrame.width);

          ctaFrame.style.display = 'block';

          const ctaContainer = ctaFrameDoc.getElementsByClassName('cta-container')[0];
          ctaContainer.className += positionClass;

          erd.listenTo(ctaContainer, (element) => {
            const height = element.offsetHeight;
            const width = element.offsetWidth;
            ctaFrame.height = height;
            ctaFrame.width = width;
            _log('listened height', ctaFrame.height);
            _log('listened width', ctaFrame.width);
          });

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
