
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

declare interface WidgetResult{

}
declare type User = {}
declare type EngagementMedium = "string"
declare type WidgetType = "string"