---
"@saasquatch/squatch-js": minor
---

**Security:** `_saasquatchExtra` auto-popup links are now only honoured for the tenant the page declares (`window.squatchTenant` or `squatch.init()`). Previously the link chose the tenant, so a crafted link could render any tenant's widget on a customer's site.

- Only `autoPopupWidgetType` is read from `_saasquatchExtra`. Other fields (`jwt`, `user`, `container`, `trigger`, `engagementMedium`, `locale`) are ignored, and auto-popup widgets always render as popups.
- Auto-popup no longer re-runs `init()`, so it can't replace a page's existing configuration.
- **Behaviour change for loader-only pages:** auto-popup widgets now require `window.squatchTenant` to be set. Pages without it log a console warning and skip the auto-popup.
