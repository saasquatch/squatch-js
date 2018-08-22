/* @public
* @interface ConfigOptions
* @property {string} tenantAlias The Tenant that you're using.
* @property {string?} domain The domain for API. Defaults to `https://app.referralsaasquatch.com`
*/
declare interface ConfigOptions {
  tenantAlias: string;
  domain?: string;
  debug?: boolean;
}

declare interface WidgetResult {}
declare type User = {
  id: string;
  accountId: string;
  [key:string]: any;
};
declare type CookieUser = {
  [key:string]: any;
}
declare type EngagementMedium = string;
declare type WidgetType = string;
declare type ShareMedium = string;
declare type JWT = string;
