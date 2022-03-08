import { EmbedWidget } from "./squatch";
import Widget from "./widgets/Widget";

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

export interface WidgetConfig {
  user: User; // The user details
  widgetType?: WidgetType; // The content of the widget.
  engagementMedium?: EngagementMedium; // How to display the widget.
  container?: HTMLElement | string; // Element to load the widget into.
  trigger?: string; // Trigger element's selector for opening the popup widget
  jwt?: JWT; // the JSON Web Token (JWT) that is used
}

export interface CookieWidgetConfig {
  user?: CookieUser;
  widgetType?: WidgetType; // The content of the widget.
  engagementMedium?: EngagementMedium; // How to display the widget.
  jwt?: JWT; // the JSON Web Token (JWT) that is used}
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

export type WidgetContext =
  | {
      type: "cookie" | "error";
      engagementMedium?: EngagementMedium;
      container?: HTMLElement | string;
      trigger?: string;
    }
  | {
      type: "upsert";
      user: User;
      engagementMedium?: EngagementMedium;
      container?: HTMLElement | string;
      trigger?: string;
    };
export type WidgetContextType = "upsert" | "cookie" | "error";

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
