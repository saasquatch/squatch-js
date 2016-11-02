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
    me.content = (params.content === 'error') ? me._error(params.rsCode) : params.content;
    me.type = params.type;
    me.widgetApi = params.api;
    me.analyticsApi = new AnalyticsApi();
    me.frame = document.createElement('iframe');
    me.frame.width = '100%';
    me.frame.style = 'border: 0; background-color: none;';
    me.erd = elementResizeDetectorMaker({ strategy: 'scroll'/*, debug: 'true'*/});


    me.eventBus.addEventListener('fb_btn_clicked', function(e, _sqh) {
      _log("fb btn clicked");
      me._shareEvent(_sqh, 'FACEBOOK');
    });

    me.eventBus.addEventListener('tw_btn_clicked', function(e, _sqh) {
      _log("tw btn clicked");
      me._shareEvent(_sqh, 'TWITTER');
    });

    me.eventBus.addEventListener('email_btn_clicked', function(e, _sqh) {
      _log("email btn clicked");
      me._shareEvent(_sqh, 'EMAIL');
    });

    me.eventBus.addEventListener('copy_btn_clicked', function(e, _sqh) {
      _log("copy btn clicked");
      me._shareEvent(_sqh, 'DIRECT');
    });

    me.eventBus.addEventListener('email_submitted', function(e, params, jwt) {
      _log("email_submitted");
      me.reload(params, jwt);
    });
  }

  reload(params, jwt) {
    _log("Reload after email - " + params + " is submitted");
  }

  _loadEvent(sqh) {

    if (sqh) {
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
  }

  _shareEvent(sqh, medium) {

    if (sqh) {
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

  _error(rs, mode = 'modal', style = '') {

    return `<!DOCTYPE html>
    <!--[if IE 7]><html class="ie7 oldie" lang="en"><![endif]-->
    <!--[if IE 8]><html class="ie8 oldie" lang="en"><![endif]-->
    <!--[if gt IE 8]><!--><html lang="en"><!--<![endif]-->
    <head>
    	<link rel="stylesheet" media="all" href="https://d35vcmgdka52pk.cloudfront.net/assets/css/widget/errorpage.min.css">
      <style>
        ${style}
      </style>
    </head>
    <body>

      <div class="squatch-container ${mode}">
        <div class="errorheader">
          <button type="button" class="close" onclick="window.parent.squatch.eventBus.dispatch('close_popup');">&times;</button>
          <p class="errortitle">Error</p>
        </div>
        <div class="errorbody">
          <div class="sadface"><img src="https://d35vcmgdka52pk.cloudfront.net/assets/images/face.png"></div>
          <h4>Our referral program is temporarily unavailable.</h4><br>
          <p>Please reload the page or check back later.</p>
          <p>If the persists please contact our support team.</p>
          <br>
          <br>
          <div class="right-align errtxt">
            Error Code: ${rs}
          </div>
        </div>
      </div>
    </body>
    </html>`;
  }
}
