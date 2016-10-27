import { domready } from '../utils/domready';
import { AnalyticsApi } from '../api/AnalyticsApi';
import { WidgetApi } from '../api/WidgetApi';
import elementResizeDetectorMaker from 'element-resize-detector';
import debug from 'debug';

let _log = debug('squatch-js:widget');

/**
 *
 * The Widget class is the base class for the different widget types available
 *
 * Creating widget type:
 *    class CustomWidget extends Widget {
 *      constructor(content,eventBus,stuff) {
 *        super(content,eventBus);
 *        // do stuff
 *      }
 *
 *      load() {
 *        // custom loading of widget
 *       }
 *    }
 *
 */
class Widget {
  /**
   * Initialize a new {@link Widget} instance.
   *
   * Creates an <iframe></iframe> in which the html content of the widget gets
   * embedded.
   * Uses element-resize-detector (https://github.com/wnr/element-resize-detector)
   * for listening to the height of the widget content and make the iframe responsive.
   * The EventBus listens for events that get triggered in the widget.
   *
   * @param {string} content The html of the widget
   * @param {EventBus} eventBus (https://github.com/krasimir/EventBus.git)
   *
   */
  constructor(content, eventBus, api) {
    _log('widget initializing ...');
    let me = this;
    me.eventBus = eventBus;
    me.content = content;
    me.frame = document.createElement('iframe');
    me.frame.width = '100%';
    me.frame.style = 'border: 0; background-color: none;';
    me.erd = elementResizeDetectorMaker({ strategy: 'scroll'/*, debug: 'true'*/});
    me.analyticsApi = new AnalyticsApi();
    me.widgetApi = api;

    me.eventBus.addEventListener('fb_btn_clicked', function(e, param1, param2) {
      _log("fb btn clicked");
      _log("param1", param1);
      _log("param2", param2);
      me._shareEvent(param1,param2);
    });
    me.eventBus.addEventListener('tw_btn_clicked', function(e) {
      _log("tw btn clicked");
    });
    me.eventBus.addEventListener('email_btn_clicked', function(e) { _log("email btn clicked") });
    me.eventBus.addEventListener('copy_btn_clicked', function(e) { _log("copy btn clicked"); });
  }

  _loadEvent(sqh) {

    this.analyticsApi.pushAnalyticsLoadEvent({
      tenantAlias: sqh.analytics.attributes.tenant,
      externalAccountId: sqh.analytics.attributes.accountId,
      externalUserId: sqh.analytics.attributes.userId,
      engagementMedium: sqh.mode.widgetMode
    }).then(function(response) {
      _log(sqh.mode.widgetMode + " loaded event recorded");
    }).catch(function(ex) {
      _log(new Error('pushAnalyticsLoadEvent() ' + ex));
    });
  }

  _shareEvent(sqh, medium) {

    this.analyticsApi.pushAnalyticsShareClickedEvent({
      tenantAlias: sqh.analytics.attributes.tenant,
      externalAccountId: sqh.analytics.attributes.accountId,
      externalUserId: sqh.analytics.attributes.userId,
      engagementMedium: sqh.mode.widgetMode,
      shareMedium: medium
    }).then(function(response) {
      _log(sqh.mode.widgetMode + " share " + medium + " event recorded");
    }).catch(function(ex) {
      _log(new Error('pushAnalyticsLoadEvent() ' + ex));
    });
  }
}

export class PopupWidget extends Widget {
  constructor(content, eventBus, api, triggerId = 'squatchpop') {
    super(content, eventBus, api);
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

  reload() {
    let me = this;

    me.widgetApi.cookieUser({
      engagementMedium: 'POPUP',
      widgetType: "REFERRER_WIDGET"
    }).then(function(response) {
      _log(response);
    }).catch(function(ex) {
      _log(ex);
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

      if (ctaElement) {
        ctaElement.parentNode.removeChild(ctaElement);
      }

      frameDoc.body.style.overflowY = 'hidden';
      popupdiv.style.display = 'table';
      popupdiv.style.top = '0';

      erd.listenTo(frameDoc.getElementsByClassName('squatch-container'), function(element) {
        let height = element.offsetHeight;

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
}

export class EmbedWidget extends Widget {
  constructor(content, eventBus, api, elementId = 'squatchembed') {
    super(content, eventBus, api);
    // this.frame.id = 'someId';
    this.element = document.getElementById(elementId);

    if (!this.element) throw new Error("elementId \'" + elementId + "\' not found.");
  }

  load() {
    let me = this

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
      _log("Embed loaded");
    });
  }
}

export class CtaWidget extends PopupWidget {
  constructor(content, eventBus, api) {
    let ctaElement = document.createElement('div');
    ctaElement.id = 'cta';
    document.body.appendChild(ctaElement);

    super(content, eventBus, api, 'cta');

    let me = this;
    me.ctaFrame = document.createElement('iframe');
    me.ctaFrame.style = 'border: 0; background-color: transparent; position:absolute; bottom: 0; display: none;';
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

    // Wait for widget doc to be ready to grab the cta HTML
    domready(widgetFrameDoc, function() {
      let ctaElement = widgetFrameDoc.getElementById('cta');
      ctaElement.parentNode.removeChild(ctaElement);

      ctaFrameDoc.open();
      ctaFrameDoc.write(ctaElement.innerHTML);
      ctaFrameDoc.close();

      // Figure out size of CTA as well
      domready(ctaFrameDoc, function() {
        ctaFrame.height = ctaFrameDoc.body.offsetHeight;
        _log('height', ctaFrameDoc.body.scrollHeight);

        ctaFrame.style.display = 'block';

        _log('CTA template loaded into iframe');
      });

    });
  }
}
