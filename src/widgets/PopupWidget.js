import debug from 'debug';
import Widget from './Widget';
import { domready } from '../utils/domready';

const _log = debug('squatch-js:POPUPwidget');


/**
 * The PopupWidget is used to display popups (also known as "Modals"). 
 * Popups widgets are rendered on top of other elements in a page.
 * 
 * To create a PopupWidget use {@link Widgets}
 * 
 */
export default class PopupWidget extends Widget {
  
  /**
   * @private
   */
  constructor(params, triggerId = 'squatchpop') {
    super(params);
    const me = this;

    me.triggerElement = document.getElementById(triggerId);

    if (!me.triggerElement) throw new Error(`elementId '${triggerId}' not found. Add div tag with id='squatchpop'.`);

    me.popupdiv = document.createElement('div');
    me.popupdiv.id = 'squatchModal';
    me.popupdiv.style = 'display: none; position: fixed; z-index: 1; padding-top: 5%; left: 0; top: -2000px; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.4);';

    me.popupcontent = document.createElement('div');
    me.popupcontent.style = 'margin: auto; width: 80%; max-width: 500px; position: relative;';

    me.triggerElement.onclick = () => { me.open(); };
    me.popupdiv.onclick = (event) => { me._clickedOutside(event); };
  }

  load() {
    const me = this;

    me.popupdiv.appendChild(me.popupcontent);
    document.body.appendChild(me.popupdiv);
    me.popupcontent.appendChild(me.frame);

    const frameDoc = me.frame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(me.content);
    frameDoc.close();
    _log('Popup template loaded into iframe');
  }

  reload(params, jwt) {
    const me = this;

    me.widgetApi.cookieUser({
      user: {
        email: params,
      },
      engagementMedium: 'POPUP',
      widgetType: me.type,
      jwt: jwt,
    }).then((response) => {
      if (response.template) {
        me.content = response.template;
        const frameDoc = me.frame.contentWindow.document;
        frameDoc.open();
        frameDoc.write(me.content);
        frameDoc.close();

        domready(frameDoc, () => {
          const ctaElement = frameDoc.getElementById('cta');

          if (ctaElement) {
            ctaElement.parentNode.removeChild(ctaElement);
          }

          me.erd.listenTo(frameDoc.getElementsByClassName('squatch-container'), (element) => {
            const height = element.offsetHeight;

            if (height > 0) me.frame.height = height;

            if (window.innerHeight > me.frame.height) {
              me.popupdiv.style.paddingTop = `${((window.innerHeight - me.frame.height) / 2)}px`;
            } else {
              me.popupdiv.style.paddingTop = '5px';
            }

            element.style.width = '100%';
            element.style.height = '100%';
          });

          _log('Popup reloaded');
        });
      }
    }).catch((ex) => {
      _log(`Failed to reload${ex}`);
    });
  }


  /**
   * Opens the widget.
   */
  open() {
    const me = this;
    const popupdiv = me.popupdiv;
    const frame = me.frame;
    const frameWindow = frame.contentWindow;
    const frameDoc = frameWindow.document;
    const erd = this.erd;

    // Adjust frame height when size of body changes
    domready(frameDoc, () => {
      const _sqh = frameWindow.squatch;
      const ctaElement = frameDoc.getElementById('cta');

      if (ctaElement) {
        ctaElement.parentNode.removeChild(ctaElement);
      }

      frameDoc.body.style.overflowY = 'hidden';
      popupdiv.style.display = 'table';
      popupdiv.style.top = '0';

      frame.height = frameDoc.body.scrollHeight;

      erd.listenTo(frameDoc.getElementsByClassName('squatch-container'), (element) => {
        const height = element.scrollHeight;

        if (height > 0) frame.height = height;

        if (window.innerHeight > frame.height) {
          popupdiv.style.paddingTop = `${((window.innerHeight - frame.height) / 2)}px`;
        } else {
          popupdiv.style.paddingTop = '5px';
        }

        element.style.width = '100%';
        element.style.height = '100%';
      });

      me._loadEvent(_sqh);
      _log('Popup opened');
    });
  }

  /**
   * Closes the widget
   * 
   */
  close() {
    const popupdiv = this.popupdiv;
    const frameDoc = this.frame.contentWindow.document;
    const erd = this.erd;

    popupdiv.style.display = 'none';
    erd.uninstall(frameDoc.body);

    _log('Popup closed');
  }

  _clickedOutside(e) {
    if (e.target === this.popupdiv) {
      this.close();
    }
  }

  _error(rs, mode = 'modal', style = '') {
    const _style = 'body { margin: 0; } .modal { box-shadow: none; border: 0; }';

    return super._error(rs, mode, style || _style);
  }
}
