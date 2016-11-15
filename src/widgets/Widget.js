import debug from 'debug';
import elementResizeDetectorMaker from 'element-resize-detector';
import AnalyticsApi from '../api/AnalyticsApi';

const _log = debug('squatch-js:widget');

/*
 *
 * The Widget class is the base class for the different widget types available
 *
 * @example <caption>Custom Widget example</caption>
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
export default class Widget {

  /**
   * Initialize a new {@link Widget} instance.
   *
   * Creates an `iframe` in which the html content of the widget gets embedded.
   * Uses element-resize-detector (https://github.com/wnr/element-resize-detector)
   * for listening to the height of the widget content and make the iframe responsive.
   *
   * @private
   * @param {Object} params -> document this object
   *
   */
  constructor(params) {
    _log('widget initializing ...');
    const me = this;
    me.content = (params.content === 'error') ? me._error(params.rsCode) : params.content;
    me.type = params.type;
    me.widgetApi = params.api || '';
    me.analyticsApi = new AnalyticsApi();
    me.frame = document.createElement('iframe');
    me.frame.squatchJsApi = me;
    me.frame.width = '100%';
    me.frame.style = 'border: 0; background-color: none;';
    me.erd = elementResizeDetectorMaker({ strategy: 'scroll' /* ,debug: 'true'*/ });
  }

  _loadEvent(sqh) {
    if (sqh) {
      this.analyticsApi.pushAnalyticsLoadEvent({
        tenantAlias: sqh.analytics.attributes.tenant,
        externalAccountId: sqh.analytics.attributes.accountId,
        externalUserId: sqh.analytics.attributes.userId,
        engagementMedium: sqh.mode.widgetMode,
      }).then((response) => {
        _log(`${sqh.mode.widgetMode} loaded event recorded. ${response}`);
      }).catch((ex) => {
        _log(new Error(`pushAnalyticsLoadEvent() ${ex}`));
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
        shareMedium: medium,
      }).then((response) => {
        _log(`${sqh.mode.widgetMode} share ${medium} event recorded. ${response}`);
      }).catch((ex) => {
        _log(new Error(`pushAnalyticsLoadEvent() ${ex}`));
      });
    }
  }

  _error(rs, mode = 'modal', style = '') {
    const me = this;

    me.errorTemplate = `<!DOCTYPE html>
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
          <button type="button" class="close" onclick="window.frameElement.squatchJsApi.close();">&times;</button>
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

    return me.errorTemplate;
  }
}
