// @ts-check
export function help(){
    console.log(`Having trouble using Squatch.js? Go to https://docs.referralsaasquatch.com/developer/ for tutorials, references and error codes.`);
}

/**
 * When you load Squatch.js you need to provide these configuration options.
 * 
 * @public
 * @interface ConfigOptions
 * @property {string} tenantAlias The Tenant that you're using.
 * @property {string?} domain The domain for API. Defaults to `https://app.referralsaasquatch.com`
 * @property {boolean?} debug Enables debug logging
 */


/**
 * When a widget is loaded using {@link Widgets} you'll get both the `user` data and the `widget` object back.
 * 
 * @interface WidgetResult
 * @property {Widget} widget The widget that was created.
 * @property {User} user The user that's in the widget.
 * 
 */

/**
 * EngagementMedium is an enum for the content of the widgets. 
 * 
 * @name EngagementMedium
 * @enum {string}
 * @readonly
 * @property {string}  POPUP    Displays the widget as a modal popup. Creates a {@link PopupWidget}
 * @property {string}  EMBED    Displays the widget embedded in the page. Create an {@link EmbedWidget}
 * @example
 *  widgetType: "POPUP"
 * 
 */
 
 
 /**
 * WidgetType is an enum for types of ways a Widget can be displayed.
 * 
 * @name WidgetType
 * @enum {string}
 * @readonly
 * @property {string}  REFERRER_WIDGET      Widget content that lets people make referrals
 * @property {string}  CONVERSION_WIDGET    Widget content that shows that someone has been referred
 * @example
 *  engagementMedium: "REFERRER_WIDGET"
 * 
 */