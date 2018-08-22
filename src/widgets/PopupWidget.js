// @ts-check

import debug from 'debug';
import ResizeObserver from 'resize-observer-polyfill';

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

  constructor(params, trigger = '.squatchpop') {
    super(params);

    this.triggerElement /* HTMLButton */ = document.querySelector(trigger);

    // Trigger is optional
    if (this.triggerElement) {
      //@ts-ignore -- we assume this is an element that can have click events
      this.triggerElement.onclick = () => { this.open(); };
    }

    // If widget is loaded with CTA, look for a 'squatchpop' element to use
    // that element as a trigger as well.
    this.triggerWhenCTA = document.querySelector('.squatchpop');

    if (trigger === '#cta' && this.triggerWhenCTA) {
      //@ts-ignore -- we assume this is an element that can have click events
      this.triggerWhenCTA.onclick = () => { this.open(); };
    }

    this.popupdiv = document.createElement('div');
    this.popupdiv.id = 'squatchModal';
    this.popupdiv.setAttribute('style', 'display: none; position: fixed; z-index: 1; padding-top: 5%; left: 0; top: -2000px; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.4);');

    this.popupcontent = document.createElement('div');
    this.popupcontent.setAttribute('style', 'margin: auto; width: 80%; max-width: 500px; position: relative;');

    this.popupdiv.onclick = (event) => { this._clickedOutside(event); };
  }

  load() {
    this.popupdiv.appendChild(this.popupcontent);
    document.body.appendChild(this.popupdiv);
    this.popupcontent.appendChild(this.frame);

    const frameDoc = this.frame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(this.content);
    frameDoc.close();
    _log('Popup template loaded into iframe');
  }

  reload(params, jwt) {
    const frameDoc = this.frame.contentWindow.document;

    this.widgetApi.cookieUser({
      user: {
        email: params.email || null,
        firstName: params.firstName || null,
        lastName: params.lastName || null,
      },
      engagementMedium: 'POPUP',
      widgetType: this.type,
      jwt: jwt,
    }).then((response) => {
      if (response.template) {
        this.content = response.template;
        const showStatsBtn = frameDoc.createElement('button');
        const registerForm = frameDoc.getElementsByClassName('squatch-register')[0];

        if (registerForm) {
          showStatsBtn.className = 'btn btn-primary';
          showStatsBtn.id = 'show-stats-btn';
          showStatsBtn.textContent = (this.type === 'REFERRER_WIDGET') ? 'Show Stats' : 'Show Reward';
          showStatsBtn.setAttribute('style', 'margin-top: 10px; max-width: 130px; width: 100%;');
          showStatsBtn.onclick = () => {
            this.load();
            this.open();
          };

          //@ts-ignore -- we assume this is an element that can be styled
          registerForm.style.paddingTop = '30px';
          registerForm.innerHTML = `<p><strong>${params.email}</strong><br>Has been successfully registered</p>`;
          registerForm.appendChild(showStatsBtn);
        }
      }
    }).catch((ex) => {
      _log(`${ex.message}`);
    });
  }

  open() {
    const popupdiv = this.popupdiv;
    const frame = this.frame;
    const frameWindow = frame.contentWindow;
    const frameDoc = frameWindow.document;

    // Adjust frame height when size of body changes
    domready(frameDoc, () => {
      // @ts-ignore -- we assume that `squatch` does exist on the window.
      const _sqh = frameWindow.squatch;
      const ctaElement = frameDoc.getElementById('cta');

      if (ctaElement) {
        ctaElement.parentNode.removeChild(ctaElement);
      }

      frameDoc.body.style.overflowY = 'hidden';
      popupdiv.style.display = 'block';
      popupdiv.style.top = '0';

      // @ts-ignore -- number will be cast to string by browsers
      frame.height = frameDoc.body.offsetHeight;

      const container = frameDoc.getElementsByTagName('sqh-global-container');
      const fallback = container.length > 0 ? container[0] : frameDoc.getElementsByClassName('squatch-container')[0];

      // Adjust frame height when size of body changes
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { height } = entry.contentRect;
          const referrals = frameDoc.getElementsByClassName('squatch-referrals')[0];
          // @ts-ignore -- we assume offsetHeight exists on referrals
          const referralsHeight = referrals ? referrals.offsetHeight : 0;
          const finalHeight = height - referralsHeight;

          if (finalHeight > 0) frame.height = finalHeight + "px";

          // TODO: Comparing number and string.
          if (window.innerHeight > frame.height) {
            popupdiv.style.paddingTop = `${((window.innerHeight - frame.height) / 2)}px`;
          } else {
            popupdiv.style.paddingTop = '5px';
          }

          // @ts-ignore -- we assume fallback is a styleable html element
          fallback.style.width = '100%';
          // @ts-ignore -- we assume fallback is a styleable html element
          fallback.style.height = `${finalHeight}px`;
        }
      });

      if (!fallback) _log('Error: no container found.');
      ro.observe(fallback);

      this._loadEvent(_sqh);
      _log('Popup opened');
    });
  }

  close() {
    this.popupdiv.style.display = 'none';
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
