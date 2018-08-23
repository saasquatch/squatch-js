import "string.prototype.includes"; // Polyfill

import { doPut } from "../utils/io";
import { ConfigOptions, JWT } from "..";

/**
 *
 * The EventsApi class is a wrapper around the open endpoints of the SaaSquatch REST API.
 *
 */
export default class EventsApi {
  tenantAlias: string;
  domain: string;
  /**
   * Initialize a new {@link EventsApi} instance.
   *
   * @param {ConfigOptions} config Config details
   *
   * @example <caption>Browser example</caption>
   * var squatchApi = new squatch.EventsApi({tenantAlias:'test_12b5bo1b25125'});
   *
   * @example <caption>Browserify/Webpack example</caption>
   * var EventsApi = require('@saasquatch/squatch-js').EventsApi;
   * var squatchApi = new EventsApi({tenantAlias:'test_12b5bo1b25125'});
   *
   * @example <caption>Babel+Browserify/Webpack example</caption>
   * import {EventsApi} from '@saasquatch/squatch-js';
   * let squatchApi = new EventsApi({tenantAlias:'test_12b5bo1b25125'});
   */
  constructor({ tenantAlias, domain }: ConfigOptions) {
    if (!tenantAlias) throw new Error("tenantAlias not provided");
    this.tenantAlias = tenantAlias;
    this.domain = domain || "https://app.referralsaasquatch.com";
  }

  /**
   * Logs an event for a user
   *
   * @param {Object} params Parameters for request
   * @param {String} params.type The type of event to log
   * @param {Object?} params.fields The fields for the event
   * @param {string?} params.jwt the JSON Web Token (JWT) that is used to authenticate the user
   *
   * @return {Promise} An ID to confirm the event has been accepted for asynchronous processing
   */
  logEvent(params: { type: string; fields?: object; jwt?: JWT }) {
    const { type, fields = null, jwt } = params;
    const ta = encodeURIComponent(this.tenantAlias);
    const path = `/api/v1/${ta}/open/events/log`;
    const url = this.domain + path;

    return doPut(
      url,
      JSON.stringify({
        type,
        fields
      }),
      jwt
    );
  }
}