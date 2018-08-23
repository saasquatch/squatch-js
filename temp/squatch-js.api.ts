// @public
export function api(): WidgetApi | null;

// @public
export function autofill(selector: string): void;

// @public
interface ConfigOptions {
  // (undocumented)
  debug?: boolean;
  // (undocumented)
  domain?: string;
  // (undocumented)
  tenantAlias: string;
}

// @public
class CtaWidget extends PopupWidget {
  constructor(params: any, opts: any);
  // (undocumented)
  close(): void;
  // (undocumented)
  ctaFrame: HTMLIFrameElement;
  // (undocumented)
  load(): void;
  // (undocumented)
  open(): void;
  // (undocumented)
  position: string;
  // (undocumented)
  positionClass: string;
  // (undocumented)
  side: string;
}

// @public
class EmbedWidget extends Widget {
  constructor(params: any, selector?: string);
  // (undocumented)
  _error(rs: any, mode?: string, style?: string): string;
  // (undocumented)
  element: Element;
  // (undocumented)
  load(): void;
  // (undocumented)
  reload({ email, firstName, lastName }: {
          email: any;
          firstName: any;
          lastName: any;
      }, jwt: any): void;
}

// WARNING: Unable to find referenced export "@saasquatch/squatch-js:EventsApi"
// WARNING: Unable to find referenced export "@saasquatch/squatch-js:EventsApi"
// @public
export function events(): EventsApi | null;

// @public (undocumented)
export function help(): void;

// WARNING: Unable to find referenced export "@saasquatch/squatch-js:EventsApi"
// @public
export function init(config: ConfigOptions): void;

// @public
class PopupWidget extends Widget {
  constructor(params: any, trigger?: string);
  // (undocumented)
  _clickedOutside({ target }: {
          target: any;
      }): void;
  // (undocumented)
  _error(rs: any, mode?: string, style?: string): string;
  // (undocumented)
  _setupResizeHandler(): void;
  // (undocumented)
  close(): void;
  // (undocumented)
  load(): void;
  // (undocumented)
  open(): void;
  // (undocumented)
  popupcontent: HTMLElement;
  // (undocumented)
  popupdiv: HTMLElement;
  // (undocumented)
  reload({ email, firstName, lastName }: {
          email: any;
          firstName: any;
          lastName: any;
      }, jwt: any): void;
  // (undocumented)
  triggerElement: HTMLElement | null;
  // (undocumented)
  triggerWhenCTA: HTMLElement | null;
}

// @public
export function ready(fn: () => any): void;

// @public
export function submitEmail(fn: (target: any, widget: any, email: any) => any): void;

// @public
class WidgetApi {
  constructor({ tenantAlias, domain }: ConfigOptions);
  cookieUser(params: {
          widgetType: WidgetType;
          engagementMedium: EngagementMedium;
          user: CookieUser;
          jwt: JWT;
      }): Promise<any>;
  // (undocumented)
  domain: string;
  invite({ emailList, userId, accountId, tenantAlias }: {
          emailList: string[];
          userId: string;
          accountId: string;
          tenantAlias: string;
      }): Promise<any>;
  render(params: {
          user: User;
          widgetType?: WidgetType;
          engagementMedium?: EngagementMedium;
          jwt?: JWT;
      }): Promise<any>;
  squatchReferralCookie(): Promise<object>;
  // (undocumented)
  tenantAlias: string;
  upsertUser(params: {
          widgetType?: WidgetType;
          engagementMedium?: EngagementMedium;
          jwt?: JWT;
          user: User;
      }): Promise<any>;
}

// @public
interface WidgetResult {
}

// @public
export function widgets(): Widgets | null;

// @public
class Widgets {
  constructor(config: any);
  // (undocumented)
  api: WidgetApi;
  autofill(selector: any): void;
  // (undocumented)
  static cb(target: any, widget: any, params: any): void;
  createCookieUser(config: any): Promise<WidgetResult>;
  // (undocumented)
  domain: string;
  // (undocumented)
  static matchesUrl(rule: any): boolean;
  render(config: any): Promise<WidgetResult>;
  // (undocumented)
  static renderErrorWidget({ apiErrorCode, rsCode, message }: {
          apiErrorCode: any;
          rsCode: any;
          message: any;
      }, em?: string): void;
  // (undocumented)
  renderWidget(response: any, config?: {
          widgetType: string;
          engagementMedium: string;
      }): any;
  submitEmail(fn: any): void;
  // (undocumented)
  tenantAlias: string;
  upsertUser(config: any): Promise<{
          widget: any;
          user: any;
      }>;
}

// WARNING: Unsupported export: User
// WARNING: Unsupported export: CookieUser
// WARNING: Unsupported export: EngagementMedium
// WARNING: Unsupported export: WidgetType
// WARNING: Unsupported export: ShareMedium
// WARNING: Unsupported export: JWT
// (No @packagedocumentation comment for this package)
