import Widget from "./widgets/Widget";

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/**
 * When you load Squatch.js you need to provide these configuration options.
 *
 * @param tenantAlias The Tenant that you're using.
 * @param domain The domain for API. Defaults to `https://app.referralsaasquatch.com`
 * @param debug Enables debug logging. Defaults to `false`.
 */
export interface ConfigOptions {
  tenantAlias: string;
  domain?: string;
  npmCdn?: string;
  debug?: boolean;
}

export type DeclarativeConfigOptions = Omit<ConfigOptions, "tenantAlias">;

/**
 * Config options for loading a widget
 *
 * @param user The user details
 * @param widgetType The content of the widget.
 * @param engagementMedium  How to display the widget.
 * @param container  Element to load the widget into.
 * @param trigger Trigger element's selector for opening the popup widget
 * @param jwt the JSON Web Token (JWT) that is used
 */
export interface WidgetConfig {
  user?: User;
  widgetType?: WidgetType;
  engagementMedium?: EngagementMedium;
  container?: HTMLElement | string;
  trigger?: string;
  jwt?: JWT;
  locale?: string;
  displayOnLoad?: boolean;
}

/**
 * @param user The user details
 * @param widgetType The content of the widget.
 * @param engagementMedium  How to display the widget.
 * @param jwt the JSON Web Token (JWT) that is used
 */
export interface CookieWidgetConfig {
  user?: CookieUser;
  widgetType?: WidgetType;
  engagementMedium?: EngagementMedium;
  jwt?: JWT;
}

/**
 * When a widget is loaded using {@link Widgets} you'll get both the `user` data and the `widget` object back.
 *
 * @param widget The widget that was created.
 * @param user The user that's in the widget.
 *
 */
export interface WidgetResult {
  widget: Widget;
  user: User;
}

export type User = {
  id: string;
  accountId: string;
  [key: string]: any;
};

export type CookieUser = {
  [key: string]: any;
};

/**
 * EngagementMedium is an enum for the content of the widgets.
 *
 * @example `widgetType: "POPUP"`
 */
export type EngagementMedium =
  /**  Displays the widget as a modal popup. Creates a {@link PopupWidget} */
  | "POPUP"
  /**  Displays the widget embedded in the page. Create an {@link EmbedWidget} */
  | "EMBED";

export type UpsertWidgetContext = {
  type: "upsert";
  user?: User | null;
  engagementMedium?: EngagementMedium;
  container?: HTMLElement | string;
  trigger?: string;
};

export type BaseWidgetContext = {
  type: "cookie" | "error" | "passwordless";
  engagementMedium?: EngagementMedium;
  container?: HTMLElement | string;
  trigger?: string;
  displayOnLoad?: boolean;
};

export type WidgetContext = UpsertWidgetContext | BaseWidgetContext;
export type WidgetContextType = "upsert" | "cookie" | "error" | "passwordless";

/**
 * WidgetType is an enum for types of ways a Widget can be displayed.
 */
export type WidgetType =
  /** Widget content that lets people make referrals */
  | "REFERRER_WIDGET"
  /** Widget content that shows that someone has been referred */
  | "CONVERSION_WIDGET"
  | string;

export type ShareMedium = string;
export type JWT = string;

export type ReferralCookie = {
  codes: string[];
  encodedCookie: string;
};
