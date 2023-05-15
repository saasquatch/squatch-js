export const RENDER_WIDGET_QUERY = `
  query renderWidget ($user: UserIdInput, $engagementMedium: UserEngagementMedium, $widgetType: WidgetType, $locale: RSLocale) {
    renderWidget(user: $user, engagementMedium: $engagementMedium, widgetType: $widgetType, locale: $locale) {
      template
      user {
        id
        accountId
      }
      jsOptions
      widgetConfig {
        values
      }
    }
  }
`;
