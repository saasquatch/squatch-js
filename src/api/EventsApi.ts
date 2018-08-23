import "string.prototype.includes"; // Polyfill

import { doPost } from "../utils/io";
import { ConfigOptions, JWT, User } from "..";
import { hasProps, isObject, assertProp } from "../utils/validate";

interface UserEventInput {
  userId: string;
  accountId: string;
  events: UserEventDataInput[];
}

interface UserEventDataInput {
  id: string;
  key: string;
  fields?: any;
  dateTriggered?: number;
}

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
  constructor(config: ConfigOptions) {
    const raw = config as unknown;
    if (!isObject(raw)) throw new Error("config must be an object");
    if (!hasProps(raw, "tenantAlias"))
      throw new Error("tenantAlias not provided");
    this.tenantAlias = raw.tenantAlias;
    this.domain =
      (hasProps(raw, "domain") && raw.domain) ||
      "https://app.referralsaasquatch.com";
  }

  /**
   * Logs an event for a user
   *
   * @param params Parameters for request
   * @param params.jwt the JSON Web Token (JWT) that is used to authenticate the user
   *
   * @return An ID to confirm the event has been accepted for asynchronous processing
   */
  logEvent(params: UserEventInput & { jwt?: JWT }): Promise<any> {
    const raw = params as unknown;
    if (!assertProp(raw, "accountId", "events", "userId"))
      throw new Error("Fields required");
    const { events } = raw;
    const ta = encodeURIComponent(this.tenantAlias);
    const userId = encodeURIComponent(raw.userId);
    const accountId = encodeURIComponent(raw.accountId);
    const path = `/api/v1/${ta}/open/account/${accountId}/user/${userId}/events`;
    const url = this.domain + path;
    return doPost(url, JSON.stringify(events), hasProps(raw, "jwt") && raw.jwt);
  }
}
