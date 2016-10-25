// POST	/a/:tenantAlias/widgets/analytics/loaded
// pushAnalyticsLoadEvent(
//            tenantAlias: String,
//            externalAccountId: String,
//            externalUserId: String,
//            engagementMedium: String)
//
// POST	/a/:tenantAlias/widgets/analytics/shared
// pushAnalyticsShareClickedEvent(
//            tenantAlias: String,
//            externalAccountId: String,
//            externalUserId: String,
//            engagementMedium: String,
//            shareMedium: String)

import 'whatwg-fetch';

/**
 *
 * The AnalyticsApi class is a wrapper around the Analytics Endpoints of
 * the SaaSquatch REST API. Used to record Widget events.
 *
 */
 export class AnalyticsApi {
   /**
    * Initialize a new {@link WidgetApi} instance.
    *
    * @param {Object} config Config details
    * @param {string} [config.domain='https://app.referralsaasquatch.com'] The server domain.
    *    Useful if you want to use a proxy like {@link https://requestb.in/ RequestBin} or {@link https://runscope.com/ Runscope}.
    *
    * @example <caption>Browser example</caption>
    * var squatchApi = new squatch.WidgetApi({tenantAlias:'test_12b5bo1b25125');
    *
    * @example <caption>Browserify/Webpack example</caption>
    * var WidgetApi = require('squatch-js').WidgetApi;
    * var squatchApi = new WidgetApi({tenantAlias:'test_12b5bo1b25125');
    *
    * @example <caption>Babel+Browserify/Webpack example</caption>
    * import {WidgetApi} from 'squatch-js';
    * let squatchApi = new WidgetApi({tenantAlias:'test_12b5bo1b25125');
    */
    constructor(config) {
      this.domain = "https://staging.referralsaasquatch.com";
    }

    pushAnalyticsLoadEvent(params) {
      let tenant_alias = encodeURIComponent(params.tenantAlias);

      let path = `/a/${tenant_alias}/widgets/analytics/loaded`;
      let url = this.domain + path;
      return this._doPost(url, params);
    }

    pushAnalyticsShareClickedEvent(params) {
      let tenant_alias = encodeURIComponent(params.tenantAlias);

      let path = `/a/${tenant_alias}/widgets/analytics/loaded`;
      let url = this.domain + path;
      return this._doPost(url, params);
    }

   /**
    * @private
    */
   _doPost(url, data) {

     return fetch(url, {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
       },
       body: data,
       credentials: 'include'
     }).then(function(response) {
       return response.json();
     });
   }
 }
