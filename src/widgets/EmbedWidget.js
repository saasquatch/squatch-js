import { Widget } from './Widget';
import { domready } from '../utils/domready';
import debug from 'debug';

let _log = debug('squatch-js:EMBEDwidget');

export class EmbedWidget extends Widget {
  constructor(params, elementId = 'squatchembed') {
    super(params);

    this.element = document.getElementById(elementId);

    if (!this.element) throw new Error("elementId \'" + elementId + "\' not found.");
  }

  load() {
    let me = this

    if (!me.element.firstChild)
      me.element.appendChild(me.frame);

    let frameDoc = me.frame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(me.content);
    frameDoc.close();

    domready(frameDoc, function() {
      let _sqh = me.frame.contentWindow.squatch;
      let ctaElement = frameDoc.getElementById('cta');

      if (ctaElement) {
        ctaElement.parentNode.removeChild(ctaElement);
      }

      me.frame.height = frameDoc.body.scrollHeight;

      // Adjust frame height when size of body changes
      me.erd.listenTo(frameDoc.getElementsByClassName('squatch-container'), function(element) {
        let height = element.offsetHeight;
        me.frame.height = height;
      });

      me._loadEvent(_sqh);
      _log("loaded");
    });
  }

  reload(params, jwt) {
    super.reload(params, jwt);

    let me = this;

    me.widgetApi.cookieUser({
      user: {
        email: params
      },
      engagementMedium: 'EMBED',
      widgetType: me.type,
      jwt: jwt
    }).then(function(response) {
      if (response.template) {
        me.content = response.template
        me.load();
      };

    }).catch(function(ex) {
      _log('Failed to reload ' + ex);
    });
  }

  _error(rs, mode = 'embed', style = '') {
    return super._error(rs, mode, style);
  }
}
