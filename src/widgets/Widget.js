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
 *      constructor(params,stuff) {
 *        super(params);
 *        // do stuff
 *      }
 *
 *      load() {
 *        // custom loading of widget
 *      }
 *    }
 *
 */
export class Widget {
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
  constructor(params) {
    _log('widget initializing ...');
    let me = this;
    me.eventBus = params.eventBus;
    me.content = params.content;
    me.type = params.type;
    me.widgetApi = params.api;
    me.analyticsApi = new AnalyticsApi();
    me.frame = document.createElement('iframe');
    me.frame.width = '100%';
    me.frame.style = 'border: 0; background-color: none;';
    me.erd = elementResizeDetectorMaker({ strategy: 'scroll'/*, debug: 'true'*/});


    me.eventBus.addEventListener('fb_btn_clicked', function(e, param1, param2) {
      _log("fb btn clicked");
      _log("param1", param1);
      _log("param2", param2);
      // me._shareEvent(param1,param2);
    });
    me.eventBus.addEventListener('tw_btn_clicked', function(e) {
      _log("tw btn clicked");
    });
    me.eventBus.addEventListener('email_btn_clicked', function(e) { _log("email btn clicked") });
    me.eventBus.addEventListener('copy_btn_clicked', function(e) { _log("copy btn clicked"); });
    me.eventBus.addEventListener('email_submitted', function(e, params, jwt) {
      _log("email_submitted");
      me.reload(params, jwt);
    });
  }

  reload(params, jwt) {
    _log("Reload after email - " + params + " is submitted");
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
