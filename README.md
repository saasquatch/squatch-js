# Referral SaaSquatch Javascript SDK

## Install the library

```ssh
# via npm
$ npm install squatch-js
# ^^ NOT SUPPORTED YET
```

To integrate our referral program to your website or web app, copy/paste this snippet of JavaScript above the `</head>` tag of your page:

```html
<script type="text/javascript">
!function(a,b){a("squatch","https://rawgit.com/jorgecgll/squatch-cdn/master/Squatch.min.js",b)}(function(a,b,c){var d,e,f;c["_"+a]={},c[a]={},c[a].ready=function(b){c["_" + a].ready =  c["_" + a].ready || [];c["_" + a].ready.push(b);},e=document.createElement("script"),e.async=1,e.src=b,f=document.getElementsByTagName("script")[0],f.parentNode.insertBefore(e,f)},this);
</script>
```

Or load the library synchronously from our CDN:

```html
<script src="https://rawgit.com/jorgecgll/squatch-cdn/master/Squatch.min.js" type="text/javascript"></script>
```


## Getting Started
The `init` function lets you configure your global squatch instance.

Unregistered users are also able to interact with your referral program using the `cookieUser` function, and later they can be registered. If `engagementMedium` is not passed in the `squatch.load()` function, Squatch.js will look for your portal settings and render the widget that's mapped to the URL where this snippet is loaded.

```html
<script type="text/javascript">
  squatch.ready(function() {

    // Always call init
    squatch.init({
      tenantAlias: "YOUR_TENANT_ALIAS",     // String (required)
    });

    var user;

    squatch.api.cookieUser({
      engagementMedium: 'DEFAULT_IS_POPUP',        // String (optional: POPUP, EMBED)
      widgetType: 'WIDGET_TYPE',                   // String (optional: REFERRER_WIDGET, CONVERSION_WIDGET)
      jwt: 'TOKEN'                                    // String (required by default, talk to support if you'd like to disable Security)
    }).then(function(response) {
      user = response.user;
      squatch.load(response, {engagementMedium: 'POPUP'});               // Optionally load the widget
    });

    // autofill
    var element = document.getElementById('my_coupon');
    element.value = user.referredBy.code;

  });
</script>
```

## Create/Upsert User
Include `user.id` and `user.accountId` in your configuration to register users.

```html
<script type="text/javascript">
  squatch.ready(function() {

    // Always call init
    squatch.init({
      tenantAlias: "YOUR_TENANT_ALIAS"      // String (required)
    });

    squatch.api.upsert({
      user: {                               // Object (required)
        id: 'USER_ID',                      // String (required)
        accountId: 'USER_ACCOUNT_ID',       // String (required)
        email: 'USER_EMAIL',                // String (optional)
        firstName: 'USER_FIRST_NAME',       // String (optional)
        lastName: 'USER_LAST_NAME',         // String (optional)
        ...
      },
      engagementMedium: 'DEFAULT_IS_POPUP', // String (optional: POPUP, EMBED)
      widgetType: 'WIDGET_TYPE',            // String (optional: REFERRER_WIDGET, CONVERSION_WIDGET)
      jwt: 'TOKEN'                          // String (required by default, talk to support if you'd like to disable Security)
    }).then(function() {
      user = response.user;
      squatch.load(response);               // Optionally load the widget
    });

  });
</script>
```

## Get referral cookie code

```html
<script type="text/javascript">
  squatch.ready(function(){

    // Always call init
    squatch.init({tenantAlias: 'YOUR_TENANT_ALIAS'});

    var code;
    // Example 1 -- use a success function
    squatch.api.squatchReferralCookie().then(function(response) {
      code = response.code;
    });

    // Example 2 -- use a selector
    squatch.autofill('#my_coupon');

  });
</script>
```

Want more control? Visit our [guide](https://github.com/saasquatch/squatch-js/blob/master/docs/docs.md).

## Contributing
This is an open source project! If you are interested in contributing please look at [contributing guidelines](CONTRIBUTING.md) first.

## Support
Shoot us an email at [support@saasqt.ch](mailto:support@saasqt.ch) if you need help!
