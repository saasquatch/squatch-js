# Referral SaaSquatch Javascript SDK

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
The `init` function lets you configure your global squatch instance.

Note: `engagementMedium` is required in the `squatch.widgets()` functions if you want to load the widget. Otherwise, Squatch.js will look for your portal settings and render the widget that's mapped to the URL where this snippet is included.

```html
<script type="text/javascript">
  squatch.ready(function() {

    // Always call init
    squatch.init({
      tenantAlias: "YOUR_TENANT_ALIAS",     // String (required)
    });
  
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
      jwt: 'TOKEN'                                  // String (required by default, or disable Security in the portal)

    });
  });
</script>
```

### Declarative method for rendering widgets
As opposed to the above method which requires some manual javascript, squatchjs includes the custom Web Components: `squatch-embed` and `squatch-popup` that can render embedded and popup widgets respectively.

```html
<script type="text/javascript">
  window.squatchToken = "TOKEN"
  window.squatchTenant = "TENANT_ALIAS"

  // Optional
  window.squatchConfig = {
    ... // Custom configuration settings
  }
</script>

<squatch-embed widget="WIDGET_TYPE"><!-- Widget is rendered here --></squatch-embed>
<squatch-popup widget="WIDGET_TYPE"><!-- Widget is rendered here --></squatch-popup>
```

## Data Only Operations
You can create/upsert users without loading a widget.

```html
<script type="text/javascript">
  squatch.ready(function() {

    // Always call init
    squatch.init({
      tenantAlias: "YOUR_TENANT_ALIAS"      // String (required)
    });

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
      jwt: 'TOKEN'                                  // String (required)
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

    // Always call init
    squatch.init({tenantAlias: 'YOUR_TENANT_ALIAS'});


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

## Contributing
This is an open source project! If you are interested in contributing please look at [contributing guidelines](CONTRIBUTING.md) first.

## Support
Shoot us an email at [support@saasqt.ch](mailto:support@saasqt.ch) if you need help!
