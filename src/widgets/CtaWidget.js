import { PopupWidget } from './PopupWidget';
import { domready } from '../utils/domready';
import debug from 'debug';

let _log = debug('squatch-js:CTAwidget');

export class CtaWidget extends PopupWidget {
  constructor(params, opts) {
    let ctaElement = document.createElement('div');
    ctaElement.id = 'cta';
    document.body.appendChild(ctaElement);

    super(params, 'cta');

    let me = this;

    if (opts.position === 'middle') {
      me.position = 'top: ' + (window.innerHeight / 2) + 'px;';
      me.side = opts.side + ': -10px;'
      _log(me.position);
    } else {
      me.position = opts.position + ': -10px;'
      me.side = opts.side + ': 5px;';
    }
    me.positionClass = opts.position;

    me.ctaFrame = document.createElement('iframe');
    me.ctaFrame.style = 'border: 0; background-color: transparent; position:absolute; display: none;' + me.side + me.position;
    _log(me.ctaFrame.style);

    me.eventBus.addEventListener('cta_btn_clicked', function(e) {
      _log("cta btn clicked");
      me.open();
    });
    document.body.appendChild(this.ctaFrame);
  }

  load() {
    super.load();

    let widgetFrameDoc = this.frame.contentWindow.document;
    let ctaFrame = this.ctaFrame;
    let ctaFrameDoc = this.ctaFrame.contentWindow.document;
    let positionClass = ' ' + this.positionClass;
    let erd = this.erd;

    // Wait for widget doc to be ready to grab the cta HTML
    domready(widgetFrameDoc, function() {
      let ctaElement = widgetFrameDoc.getElementById('cta');

      if (ctaElement) {
        ctaElement.parentNode.removeChild(ctaElement);

        ctaFrameDoc.open();
        ctaFrameDoc.write(ctaElement.innerHTML);
        ctaFrameDoc.close();

        // Figure out size of CTA as well
        domready(ctaFrameDoc, function() {
          ctaFrame.height = ctaFrameDoc.body.offsetHeight;
          ctaFrame.width = ctaFrameDoc.body.scrollWidth;

          ctaFrame.style.display = 'block';

          let ctaContainer = ctaFrameDoc.getElementsByClassName('cta-container')[0];
          ctaContainer.className += positionClass;

          erd.listenTo(ctaContainer, function(element) {
            let height = element.offsetHeight;
            let width = element.offsetWidth;
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

  reload(params, jwt) {
    super.reload(params, jwt);
  }
}
