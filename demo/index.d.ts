declare interface Sandbox {
  script: string;
  domain: string;
  tenantAlias: string;
  debug?: boolean;
  initObj: {
    widgetType: string;
    engagementMedium: string;
    user: {
      [key: string]: any;
    };
    jwt: string;
  };
}
