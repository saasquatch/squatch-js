# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.6.3] - 2024-06-10

### Fixed

- Fixed bug decoding JWT's that was causing user payloads with characters in other languages fail to load widgets

## [2.6.2] - 2024-02-06

### Added

- `sq:user-registration` event listener for Instant Access widgets to fire a Load Analytics API event on successful user registration within the widget.

## [2.6.1] - 2023-09-01

### Fixed

- Fix customElementRegistry error that occurs when multiple instances of squatchjs are loaded on the same page.

## [2.6.0] - 2023-08-23

### Added

- SquatchJS now supports declarative widget initialization

  - For rendering widgets and API calls, squatchjs respects configurations set on the following:

    - `window.squatchToken`: Signed JWT for calls to the SaaSquatch API -- [How to generate valid JWT Tokens](https://docs.saasquatch.com/topics/json-web-tokens#example-building-the-jwt)
    - `window.squatchTenant`: SaaSquatch tenant alias
    - `window.squatchConfig`: Additional configuration overrides (Optional)
      - debug: Turn on console debugging (Default: false)
    - `window.squatchOnReady`: Declarative on ready function to be run when the squatch-js module has finished loading

  - Note: If window.squatchToken is undefined, widgets will be rendered as [Instant Access widgets.](https://docs.saasquatch.com/topics/widget-types#instant-access-widgets)

- Widget components added:

  - `<squatch-embed></squatch-embed>`

    - widget: Specifies the SaaSquatch widgetType identifier of the desired widget
      - Required
      - Changing this attribute's value causes the widget to reload
    - container: A CSS selector for a container element to use as the parent of the widget's iframe
      - Default: null
      - Note, if no container is specified, the widget iframe will attach to the shadow DOM of squatch-embed
    - locale: Locale that determines the widget translation displayed. Should be of the form "xx_XX"
    - Default: Browser's current locale
    - Changing this attribute's value causes the widget to reload

  - `<squatch-popup></squatch-popup>`
    - widget: string: Specifies the SaaSquatch widgetType identifier of the desired widget
      - Required
    - open: boolean: Whether to the popup is open when loaded into the page
      - Default: false
    - container: A CSS selector for a container element to use as the parent of the widget's iframe.
      - Default: null
      - Note, if no container is specified, the widget iframe will attach to the shadow DOM of squatch-embed.
    - locale: Locale that determines the widget translation displayed. Should be of the form "xx_XX".
      - Default: Browser's current locale
      - Changing this attribute's value causes the widget to reload.

### Removed

- Deprecated api functions have been removed
  - Removed functions:
    - `squatch.api().invite()`
    - `squatch.submitEmail()`
  - Removed widgets:
    - `CtaWidget`

### Changed

- Bundle size reduced significantly thanks to the removal of deprecated features and other optimizations
  - Before: 19.75 kB
  - After: 12.06 kB

## [2.5.0] - 2023-05-16

### Removed

- Removed WidgetApi.cookieUser method and associated usage

### Changed

- Widgets.render now queries renderWidget rather than cookieUser api method
- Added squatch.widget function to render a widget without user upsert

- Example:

```js
var initObj = {
  widgetType: "<MY_WIDGET>",
  engagementMedium: "EMBED",
  container: ".myContainer",
};

squatch
  .widget(initObj)
  .then(function (response) {
    const widget = response.widget;
  })
  .catch(function (error) {
    console.log(error);
  });
```

- Added auto-popup widget support:
  - Reads `_saasquatchExtra` from the URL on load
  - Renders the encoded widget from `_saasquatchExtra` parameter as a Popup Widget on load

## [2.4.3] - 2023-04-20

### Changed

- Updated license copyright to be in line with SaaSquatch open-source policy.

## [2.4.2] - 2023-04-10

### Added

- Added value to return data `squatchReferralCookie` to retrieve the encoded cookie

- Example:

```js
squatch
  .api()
  .squatchReferralCookie()
  .then(function (response) {
    const cookie = response.encodedCookie;
  });
```

## [2.4.1] - 2022-09-23

### Added

- Added event idempotencyKey to types

## [2.4.0] - 2022-03-15

### Changed

- EmbedWidget now supports a `container` as either a selector or an HTMLElement as a parameter

  - Widget contents will be loaded in a hidden widget and can be opened and closed with `widget.open()` and `widget.close()`

- Example:

```js
var initObj = {
  id: "testUser",
  accountId: "testUser",
  widgetType: "<MY_WIDGET>",
  user: {
    id: "testUser",
    accountId: "testUser",
  },
  jwt: "<MY_JWT>",
  engagementMedium: "EMBED",
  container: ".myContainer",
};

squatch
  .widgets()
  .upsertUser(initObj)
  .then(function (response) {
    widget = response.widget;
    widget.open();
  })
  .catch(function (error) {
    console.log(error);
  });
```

- PopupWidget now supports a `trigger` as a selector

  - provides the ability to use a class other than `.squatchpop` for opening the widget

- `sq:refresh` event is sent when `.open()` is called on EmbedWidget and PopupWidget

## [2.3.1] - 2022-01-11

### Changed

- Reduced resize timeout to 500ms from 5000ms

## [2.3.0] - 2021-05-19

### Added

- Typescript definitions
- CommonJS/ES modules build for smaller bundle sizes when using squatch-js from NPM

### Changed

- `main` is now a CommonJS build instead of a UMD build

## [2.2.1] - 2020-06-17

### Changed

- Remove the need to have JS Options, so that older clients can upgrade to squatch.js v2 easily.

## [2.2.0] - 2020-06-12

### Added

- Reads `_saasquatch` from the URL and stores a 1st-party cookie on the specified landing page's domain.
- Sets `cookies` on users during an upsert **automatically**

```js
{
  user: {
     id: "abc",
     accountId: "abc",
     cookies: "SAASQUATCHCOOKIE",
     ...
}
```

- Reads the 1st-party cookie when using `autofill`

```js
squatch
  .api()
  .squatchReferralCookie()
  .then(function (response) {
    element.value = response.codes["program-id"];
  });
```

## [2.1.8] - 2020-05-25

No release notes.

## [2.1.7] - 2020-05-21

No release notes.

## [2.1.6] - 2019-04-15

No release notes.

## [2.1.5] - 2019-02-19

No release notes.

## [2.1.4] - 2019-01-03

No release notes.

## [2.1.3] - 2018-12-05

No release notes.

## [2.1.2] - 2018-10-22

No release notes.

## [2.1.1] - 2018-10-19

### Fixed

- POPUP Widget in iOS Safari is not clickable when is hidden anymore

## [2.1.0] - 2018-09-26

No release notes.

## [2.0.17] - 2017-12-21

### Fixed

- Fixed content-type detection bug

## [2.0.16] - 2017-10-24

### Fixed

- Fix scrolling issue to allow scrolling within popup modal

## [2.0.15] - 2017-10-12

### Added

- Support for scrolling popup in mobile

## [2.0.14] - 2017-10-11

### Fixed

- Fix registration form message in popup

## [2.0.13] - 2017-08-03

No release notes.

## [2.0.12] - 2017-07-18

No release notes.

## [2.0.11] - 2017-07-18

No release notes.

## [2.0.10] - 2017-06-30

No release notes.

## [2.0.9] - 2017-06-08

No release notes.

## [2.0.8] - 2017-06-08

No release notes.

## [2.0.7] - 2017-04-24

No release notes.

## [2.0.6] - 2017-02-14

### Fixed

- Fix share tracking
- Ignore CONVERSION_WIDGET widget rules when there's no referrals

### Changed

- Auto-fill content type check changed to non-case sensitive

## [2.0.5] - 2016-12-07

No release notes.

## [2.0.4] - 2016-12-06

No release notes.

## [2.0.3] - 2016-11-30

No release notes.

## [2.0.2] - 2016-11-29

No release notes.

## [2.0.1] - 2016-11-25

No release notes.

## [2.0.0] - 2016-11-25

No release notes.

[unreleased]: https://github.com/saasquatch/squatch-js/compare/@saasquatch%2Fsquatch-js@2.6.3...HEAD
[2.6.3]: https://github.com/saasquatch/squatch-js/compare/@saasquatch%2Fsquatch-js@2.5.0...@saasquatch%2Fsquatch-js@2.6.3
[2.6.2]: https://github.com/saasquatch/squatch-js/compare/@saasquatch%2Fsquatch-js@2.5.0...@saasquatch%2Fsquatch-js@2.6.2
[2.6.1]: https://github.com/saasquatch/squatch-js/compare/@saasquatch%2Fsquatch-js@2.5.0...@saasquatch%2Fsquatch-js@2.6.1
[2.6.0]: https://github.com/saasquatch/squatch-js/compare/@saasquatch%2Fsquatch-js@2.5.0...@saasquatch%2Fsquatch-js@2.6.0
[2.5.0]: https://github.com/saasquatch/squatch-js/compare/@saasquatch%2Fsquatch-js@2.4.1...@saasquatch%2Fsquatch-js@2.5.0
[2.4.3]: https://github.com/saasquatch/squatch-js/compare/@saasquatch%2Fsquatch-js@2.4.2...@saasquatch%2Fsquatch-js@2.4.3
[2.4.2]: https://github.com/saasquatch/squatch-js/compare/@saasquatch%2Fsquatch-js@2.4.1...@saasquatch%2Fsquatch-js@2.4.2
[2.4.1]: https://github.com/saasquatch/squatch-js/compare/@saasquatch%2Fsquatch-js@2.4.0...@saasquatch%2Fsquatch-js@2.4.1
[2.4.0]: https://github.com/saasquatch/squatch-js/compare/v2.3.1...@saasquatch%2Fsquatch-js@2.4.0
[2.3.1]: https://github.com/saasquatch/squatch-js/compare/v2.3.0...v2.3.1
[2.3.0]: https://github.com/saasquatch/squatch-js/compare/v2.2.1...v2.3.0
[2.2.1]: https://github.com/saasquatch/squatch-js/compare/v2.2.0...v2.2.1
[2.2.0]: https://github.com/saasquatch/squatch-js/compare/v2.1.8...v2.2.0
[2.1.8]: https://github.com/saasquatch/squatch-js/compare/v2.1.7...v2.1.8
[2.1.7]: https://github.com/saasquatch/squatch-js/compare/v2.1.6...v2.1.7
[2.1.6]: https://github.com/saasquatch/squatch-js/compare/v2.1.5...v2.1.6
[2.1.5]: https://github.com/saasquatch/squatch-js/compare/v2.1.4...v2.1.5
[2.1.4]: https://github.com/saasquatch/squatch-js/compare/v2.1.3...v2.1.4
[2.1.3]: https://github.com/saasquatch/squatch-js/compare/v2.1.2...v2.1.3
[2.1.2]: https://github.com/saasquatch/squatch-js/compare/v2.1.1...v2.1.2
[2.1.1]: https://github.com/saasquatch/squatch-js/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/saasquatch/squatch-js/compare/v2.0.17...v2.1.0
[2.0.17]: https://github.com/saasquatch/squatch-js/compare/v2.0.16...v2.0.17
[2.0.16]: https://github.com/saasquatch/squatch-js/compare/v2.0.15...v2.0.16
[2.0.15]: https://github.com/saasquatch/squatch-js/compare/v2.0.14...v2.0.15
[2.0.14]: https://github.com/saasquatch/squatch-js/compare/v2.0.13...v2.0.14
[2.0.13]: https://github.com/saasquatch/squatch-js/compare/v2.0.12...v2.0.13
[2.0.12]: https://github.com/saasquatch/squatch-js/compare/v2.0.11...v2.0.12
[2.0.11]: https://github.com/saasquatch/squatch-js/compare/v2.0.10...v2.0.11
[2.0.10]: https://github.com/saasquatch/squatch-js/compare/v2.0.9...v2.0.10
[2.0.9]: https://github.com/saasquatch/squatch-js/compare/v2.0.8...v2.0.9
[2.0.8]: https://github.com/saasquatch/squatch-js/compare/v2.0.7...v2.0.8
[2.0.7]: https://github.com/saasquatch/squatch-js/compare/v2.0.6...v2.0.7
[2.0.6]: https://github.com/saasquatch/squatch-js/compare/v2.0.5...v2.0.6
[2.0.5]: https://github.com/saasquatch/squatch-js/compare/v2.0.4...v2.0.5
[2.0.4]: https://github.com/saasquatch/squatch-js/compare/v2.0.3...v2.0.4
[2.0.3]: https://github.com/saasquatch/squatch-js/compare/v2.0.2...v2.0.3
[2.0.2]: https://github.com/saasquatch/squatch-js/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/saasquatch/squatch-js/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/saasquatch/squatch-js/releases/tag/v2.0.0
