import debug from 'debug';
import Widget from './Widget';
import { domready } from '../utils/domready';

const _log = debug('squatch-js:EMBEDwidget');


/**
 * An EmbedWidget is displayed inline in part of your page.
 *
 * To create an EmbedWidget use {@link Widgets}
 *
 */
export default class EmbedWidget extends Widget {

  constructor(params, elementId = 'squatchembed') {
    super(params);

    this.element = document.getElementById(elementId);

    if (!this.element) throw new Error(`elementId '${elementId}' not found.'`);
  }

  load() {
    const me = this;

    if (!me.element.firstChild || me.element.firstChild.nodeName === '#text') {
      me.element.appendChild(me.frame);
    }

    const frameDoc = me.frame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(me.content);
    frameDoc.close();

    domready(frameDoc, () => {
      const _sqh = me.frame.contentWindow.squatch;
      const ctaElement = frameDoc.getElementById('cta');

      if (ctaElement) {
        ctaElement.parentNode.removeChild(ctaElement);
      }

      me.frame.height = frameDoc.body.scrollHeight;

      // Adjust frame height when size of body changes
      me.erd.listenTo(frameDoc.getElementsByClassName('squatch-container'), (element) => {
        const height = element.offsetHeight;
        me.frame.height = height;
      });

      me._loadEvent(_sqh);
      _log('loaded');
    });
  }

  reload(params, jwt) {
    const me = this;
    const frameDoc = me.frame.contentWindow.document;

    me.widgetApi.cookieUser({
      user: {
        email: params,
      },
      engagementMedium: 'EMBED',
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

  _error(rs, mode = 'embed', style = '') {
    return super._error(rs, mode, style);
  }
}
