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

  constructor(params, triggerId = 'squatchpop') {
    super(params);
    const me = this;

    me.triggerElement = document.getElementsByClassName(triggerId)[0];

    if (!me.triggerElement) throw new Error(`element '${triggerId}' not found. Add element with class='squatchpop'.`);

    // If widget is loaded with CTA, look for a 'squatchpop' element to use
    // that element as a trigger as well.
    me.triggerWhenCTA = document.getElementsByClassName('squatchpop')[0];

    if (triggerId === 'cta' && me.triggerWhenCTA) {
      me.triggerWhenCTA.onclick = () => { me.open(); };
    }

    me.triggerElement.onclick = () => { me.open(); };

    me.popupdiv = document.createElement('div');
    me.popupdiv.id = 'squatchModal';
    me.popupdiv.setAttribute('style', 'display: none; position: fixed; z-index: 1; padding-top: 5%; left: 0; top: -2000px; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.4);');

    me.popupcontent = document.createElement('div');
    me.popupcontent.setAttribute('style', 'margin: auto; width: 80%; max-width: 500px; position: relative;');

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
    const frameDoc = me.frame.contentWindow.document;

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
        const showStatsBtn = frameDoc.createElement('button');
        const registerForm = frameDoc.getElementsByClassName('squatch-register')[0];

        if (registerForm) {
          showStatsBtn.className = 'btn btn-primary';
          showStatsBtn.id = 'show-stats-btn';
          showStatsBtn.textContent = 'Show Stats';
          showStatsBtn.setAttribute('style', 'margin-top: 10px; max-width: 130px; width: 100%;');
          showStatsBtn.onclick = () => {
            me.load();
            me.open();
          };

          registerForm.style.paddingTop = '30px';
          registerForm.innerHTML = `<p><strong>${params}</strong><br>Has been successfully registered</p>`;
          registerForm.appendChild(showStatsBtn);
        }
      }
    }).catch((ex) => {
      _log(`${ex.message}`);
    });
  }

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

      frame.height = frameDoc.body.offsetHeight;

      erd.listenTo(frameDoc.getElementsByClassName('squatch-container')[0], (element) => {
        const height = element.scrollHeight;
        const referrals = frameDoc.getElementsByClassName('squatch-referrals')[0];
        const referralsHeight = referrals ? referrals.offsetHeight : 0;
        const finalHeight = height - referralsHeight;

        if (finalHeight > 0) frame.height = finalHeight;

        if (window.innerHeight > frame.height) {
          popupdiv.style.paddingTop = `${((window.innerHeight - frame.height) / 2)}px`;
        } else {
          popupdiv.style.paddingTop = '5px';
        }

        element.style.width = '100%';
        element.style.height = `${finalHeight}px`;
      });

      me._loadEvent(_sqh);
      _log('Popup opened');
    });
  }

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
