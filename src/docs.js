export function help(){
    console.log(`Having trouble using Squatch.js? Go to https://docs.referralsaasquatch.com/developer/ for tutorials, references and error codes.`);
}

/**
 * When you load Squatch.js you need to provide these configuration options.
 * 
 * @interface ConfigOptions
 * @property {string} tenantAlias The Tenant that you're using.
 * @property {string?} domain The domain for API. Defaults to `https://app.referralsaasquatch.com`
 */


/**
 * When a widget is loaded using {@link Widgets} you'll get both the `user` data and the `widget` object back.
 * 
 * @interface WidgetResult
 * @property {Widget} widget The widget that was created.
 * @property {User} user The user that's in the widget.
 * 
 */
