import { Widget } from './Widget';
import { domready } from '../utils/domready';
import debug from 'debug';

let _log = debug('squatch-js:POPUPwidget');

export class PopupWidget extends Widget {
  constructor(params, triggerId = 'squatchpop') {
    super(params);
    let me = this;

    me.triggerElement = document.getElementById(triggerId);

    if (!me.triggerElement) throw new Error("elementId \'" + triggerId + "\' not found.");

    me.popupdiv = document.createElement('div');
    me.popupdiv.id = 'squatchModal';
    me.popupdiv.style = 'display: none; position: fixed; z-index: 1; padding-top: 5%; left: 0; top: -2000px; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.4);';

    me.popupcontent = document.createElement('div');
    me.popupcontent.style = "margin: auto; width: 80%; max-width: 500px; position: relative;";

    me.triggerElement.onclick = function() { me.open(); };
    me.popupdiv.onclick = function(event) { me._clickedOutside(event); };
    me.eventBus.addEventListener('open_popup', function(e) { me.open(); });
    me.eventBus.addEventListener('close_popup', function(e) { me.close(); });
  }

  load() {
    let me = this;

    me.popupdiv.appendChild(me.popupcontent);
    document.body.appendChild(me.popupdiv);
    me.popupcontent.appendChild(me.frame);

    let frameDoc = me.frame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(me.content);
    frameDoc.close();
    _log('Popup template loaded into iframe');
  }

  reload(params, jwt) {
    super.reload(params, jwt);
    let me = this;

    me.widgetApi.cookieUser({
      user: {
        email: params
      },
      engagementMedium: 'POPUP',
      widgetType: me.type,
      jwt: jwt
    }).then(function(response) {
      if (response.template) {
        me.content = response.template;
        let frameDoc = me.frame.contentWindow.document;
        frameDoc.open();
        frameDoc.write(me.content);
        frameDoc.close();

        domready(frameDoc, function() {
          let ctaElement = frameDoc.getElementById('cta');

          if (ctaElement)
            ctaElement.parentNode.removeChild(ctaElement);

          me.erd.listenTo(frameDoc.getElementsByClassName('squatch-container'), function(element) {
            let height = element.offsetHeight;

            if (height > 0) me.frame.height = height;

            if (window.innerHeight > me.frame.height) {
              me.popupdiv.style.paddingTop = ((window.innerHeight - me.frame.height)/2) + "px";
            } else {
              me.popupdiv.style.paddingTop = "5px";
            }

            element.style.width = "100%";
            element.style.height = "100%";
          });

          _log("Popup reloaded");
        });
      }
    }).catch(function(ex) {
      _log('Failed to reload' + ex);
    });

  }

  open() {
    let me = this;
    let popupdiv = me.popupdiv;
    let frame = me.frame;
    let frameWindow = frame.contentWindow;
    let frameDoc = frameWindow.document;
    let erd = this.erd;
    let analyticsApi = this.analyticsApi;

    // Adjust frame height when size of body changes
    domready(frameDoc, function() {
      let _sqh = frameWindow.squatch;
      let ctaElement = frameDoc.getElementById('cta');

      if (ctaElement)
        ctaElement.parentNode.removeChild(ctaElement);

      frameDoc.body.style.overflowY = 'hidden';
      popupdiv.style.display = 'table';
      popupdiv.style.top = '0';

      frame.height = frameDoc.body.scrollHeight;

      erd.listenTo(frameDoc.getElementsByClassName('squatch-container'), function(element) {
        let height = element.scrollHeight;

        if (height > 0) frame.height = height;

        if (window.innerHeight > frame.height) {
          popupdiv.style.paddingTop = ((window.innerHeight - frame.height)/2) + "px";
        } else {
          popupdiv.style.paddingTop = "5px";
        }

        element.style.width = "100%";
        element.style.height = "100%";
      });

      me._loadEvent(_sqh);
      _log('Popup opened');
    })
  }

  close() {
    let popupdiv = this.popupdiv;
    let frameDoc = this.frame.contentWindow.document;
    let erd = this.erd;

    popupdiv.style.display = 'none';
    erd.uninstall(frameDoc.body);

    _log('Popup closed');
  }

  _clickedOutside(e) {
    let popupdiv = this.popupdiv;

    if (e.target == this.popupdiv) {
      this.close()
    }
  }

  _error(rs, mode = 'modal', style = '') {
    let _style = 'body { margin: 0; } .modal { box-shadow: none; border: 0; }'

    return super._error(rs, mode, _style);
  }
}
