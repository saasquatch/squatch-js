# Referral SaaSquatch Javascript SDK

- [Referral SaaSquatch Javascript SDK](#referral-saasquatch-javascript-sdk)
  - [Install the library](#install-the-library)
  - [Getting Started](#getting-started)
  - [Data Only Operations](#data-only-operations)
      - [Create/upsert users without loading a widget.](#createupsert-users-without-loading-a-widget)
  - [Get Referral Cookie Code](#get-referral-cookie-code)
  - [Install via NPM and Webpack (advanced)](#install-via-npm-and-webpack-advanced)
  - [Component API:](#component-api)
    - [`squatch-embed`](#squatch-embed)
    - [`squatch-popup`](#squatch-popup)
  - [Legacy](#legacy)
    - [Rendering a widget via Widgets API](#rendering-a-widget-via-widgets-api)
  - [Contributing](#contributing)
  - [Support](#support)


## Install the library

To integrate any SaaSquatch program to your website or web app, copy/paste this snippet of JavaScript above the `</head>` tag of your page:

```html
<script type="text/javascript">
!function(a,b){a("squatch","https://fast.ssqt.io/squatch-js@2",b)}(function(a,b,c){var d,e,f;c["_"+a]={},c[a]={},c[a].ready=function(b){c["_" + a].ready =  c["_" + a].ready || [];c["_" + a].ready.push(b);},e=document.createElement("script"),e.async=1,e.src=b,f=document.getElementsByTagName("script")[0],f.parentNode.insertBefore(e,f)},this);
</script>
```

Or load the library synchronously from our CDN:

```html
<script src="https://fast.ssqt.io/squatch-js@2" type="text/javascript"></script>
```


## Getting Started

Include either of the squatchjs generated web-components in your page's HTML to render your desired widget:
```html
<!-- EMBED WIDGET -->
<squatch-embed widget="WIDGET_TYPE"><!-- Widget is rendered here --></squatch-embed>

<!-- POPUP WIDGET -->
<squatch-popup widget="WIDGET_TYPE"><!-- Widget is rendered here --></squatch-popup>
```
For rendering widgets and API calls, Squatchjs respects configurations set on the following:
  - `window.squatchToken`: Signed JWT for calls to the SaaSquatch API -- [How to generate valid JWT Tokens](https://docs.saasquatch.com/topics/json-web-tokens#example-building-the-jwt)
  - `window.squatchTenant`: SaaSquatch tenant alias
  - `window.squatchConfig`: Additional configuration overrides (Optional)
    - `debug`: Turn on console debugging (Default: `false`)

**Note**: If `window.squatchToken` is undefined, widgets will be rendered as [Instant Access widgets](https://docs.saasquatch.com/topics/widget-types#instant-access-widgets).





## Data Only Operations


#### Create/upsert users without loading a widget.

```html
<script type="text/javascript">
  // Assuming window.squatchTenant, and window.squatchToken are set

  squatch.ready(function() {
    var user;

    squatch.api().upsertUser({
      user: {                               // Object (required)
        id: 'USER_ID',                      // String (required)
        accountId: 'USER_ACCOUNT_ID',       // String (required)
        email: 'USER_EMAIL',                // String (optional)
        firstName: 'USER_FIRST_NAME',       // String (optional)
        lastName: 'USER_LAST_NAME',         // String (optional)
        ...
      },
      engagementMedium: 'EMBED',                    // String (optional: POPUP, EMBED)
      widgetType: 'p/PROGRAM-ID/w/referrerWidget',  // Update PROGRAM-ID
    }).then(function(response) {
      user = response.user;
    }).catch(function(err){
      console.log(err);
    });

    // autofill
    var element = document.getElementById('my_coupon');
    element.value = user.referredBy.code;

  });
</script>
```

## Get Referral Cookie Code
You can also use the `api()` function to call the WidgetApi methods directly.

```html
<script type="text/javascript">
  squatch.ready(function(){

    var element = document.getElementById('my_coupon');

    squatch.api().squatchReferralCookie().then(function(response) {
      /* `response.codes` looks like `{"program_id":"NEWCO", "friend_program":"BOB"}` */
      
      element.value = response.codes["program-id"];
    });

  });
</script>
```

Want more control? Visit our [guide](https://github.com/saasquatch/squatch-js/blob/master/docs/docs.md).


## Install via NPM and Webpack (advanced)

Squatch.js can also be installed via NPM and bundled into your application with Webpack.

```ssh
# via npm
$ npm install @saasquatch/squatch-js
```

```js
import * as squatch from "@saasquatch/squatch-js";

// Always call init
squatch.init({
  tenantAlias: "YOUR_TENANT_ALIAS"      // String (required)
});

// Don't need to wait for .ready when importing via NPM/Webpack
squatch.api().upsertUser({...});

```

## Component API:

### `squatch-embed`
```html
<squatch-embed widget="WIDGET_TYPE" [ container="#selector" ]>
  <!-- Children of squatch-embed act as a loading state -->
  Loading...
</squatch-embed>
```

- `widget`: Specifies the SaaSquatch `widgetType` identifier of the desired widget
  - Required
- `container`: A CSS selector for a container element to use as the parent of the widget's iframe. 
  - Default: `null`
  - Note, if no container is specified, the widget iframe will attach to the shadow DOM of `squatch-embed`.


### `squatch-popup`
```html
<squatch-embed widget="WIDGET_TYPE" [ open ]>
  <!-- Clicking a child of squatch-popup opens the popup -->
  <button>Click me to open</button> 
</squatch-embed>
```

- `widget: string`: Specifies the SaaSquatch `widgetType` identifier of the desired widget
  - Required
- `open: boolean`: Whether to the popup is open when loaded into the page
  - Default: `false`

## Legacy

### Rendering a widget via Widgets API
Note: `engagementMedium` is required in the `squatch.widgets()` functions if you want to load the widget. Otherwise, Squatch.js will look for your portal settings and render the widget that's mapped to the URL where this snippet is included.

```html
<script type="text/javascript">
  squatch.ready(function() {

    squatch.widgets().upsertUser({
      user: {                               // Object (required)
        id: 'USER_ID',                      // String (required)
        accountId: 'USER_ACCOUNT_ID',       // String (required)
        email: 'USER_EMAIL',                // String (optional)
        firstName: 'USER_FIRST_NAME',       // String (optional)
        lastName: 'USER_LAST_NAME',         // String (optional)
  
        ...
      },
      engagementMedium: 'EMBED',                    // String (optional: POPUP, EMBED)
      widgetType: 'p/PROGRAM-ID/w/referrerWidget',  // Update PROGRAM-ID
    });
  });
</script>
```

## Contributing
This is an open source project! If you are interested in contributing please look at [contributing guidelines](CONTRIBUTING.md) first.

## Support
Shoot us an email at [support@saasqt.ch](mailto:support@saasqt.ch) if you need help!
