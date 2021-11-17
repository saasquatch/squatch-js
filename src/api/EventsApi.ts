import { doPost } from "../utils/io";
import { ConfigOptions, JWT} from "../types";
import {
  isObject,
  assertProp,
  validateConfig,
} from "../utils/validate";

type TrackOptions = { jwt?: JWT };

interface UserEventInput {
  userId: string;
  accountId: string;
  events: UserEventDataInput[];
}

interface UserEventDataInput {
  key: string; // Require -- the name of the event
  id?: string; // Optional -- a globally unique ID for the event
  fields?: object; // Arbitrary JSON data
  dateTriggered?: number; // The date triggered
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
    const raw = config as unknown; // Flags that we need to validate anything we use from this type
    const clean = validateConfig(raw);
    this.tenantAlias = clean.tenantAlias;
    this.domain = clean.domain;
  }

  /**
   * Track an event for a user
   *
   * @param params Parameters for request
   * @param options.jwt the JSON Web Token (JWT) that is used to authenticate the user
   *
   * @return An ID to confirm the event has been accepted for asynchronous processing
   */
  track(params: UserEventInput, options?: TrackOptions): Promise<any> {
    const raw = params as unknown;
    const rawOpts = options as unknown;
    const body = _validateEvent(raw);
    const { jwt } = _validateTrackOptions(rawOpts);
    const ta = encodeURIComponent(this.tenantAlias);
    const userId = encodeURIComponent(body.userId);
    const accountId = encodeURIComponent(body.accountId);
    const path = `/api/v1/${ta}/open/account/${accountId}/user/${userId}/events`;
    const url = this.domain + path;
    return doPost(url, JSON.stringify(body), jwt);
  }
}

function _validateEvent(raw: unknown): UserEventInput {
  if (!assertProp(raw, "accountId", "events", "userId"))
    throw new Error("Fields required");
  if (!Array.isArray(raw.events))
    throw new Error("'events' should be an array");
  // TODO: Better type checking
  return raw as unknown as UserEventInput;
}

function _validateTrackOptions(raw: unknown): TrackOptions {
  if (!isObject(raw)) throw new Error("'options' should be an object");
  return raw;
}
