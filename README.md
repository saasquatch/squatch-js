# Squatch JS

squatch.js v2

## Installation

* Install  [node](https://nodejs.org)
* run `npm install`

## Building

* `npm run watch` to start Webpack in watch mode - will recompile when you change a file.
* open `index.html` in a browser.
* Reload the browser when you have made a change.

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
^^^ REFERENCE TO FILE WILL CHANGE WHEN WE UPLOAD TO CDN
```

Or load the library synchronously from our CDN:

```html
<script src="path/to/file/squatch.min.js" type="text/javascript"></script>
```

Read our [Installation guide](link to guide) to learn about all the ways this library can fit into your workflow.


## Initialize Squatch JS
The init function lets you identify users (optionally), show them different types of referral widgets, automatically attribute referrals, track conversions and more all from one place. Unregistered users are also able to interact with your referral program, and later they can be registered with the `squatch.api.upsert` function.

```html
<script type="text/javascript">
  squatch.ready(function() {

    squatch.init({
      tenantAlias: "YOUR_TENANT_ALIAS",  // String (required)

      user: {                            // Object (optional)
        id: 'USER_ID',
        accountId: 'USER_ACCOUNT_ID',
        email: 'USER_EMAIL',
        firstName: 'USER_FIRST_NAME',
        lastName: 'USER_LAST_NAME'
      },

      engagementMedium: 'MEDIUM',        // String (optional: POPUP, EMBED)
      widgetType: 'WIDGET_TYPE',         // String (optional: REFERRER_WIDGET, CONVERSION_WIDGET)
      jwt: 'TOKEN'                       // String (required by default, talk to support if you'd like to disable Security)
    });

  });
</script>
```

## Create/Upsert User
Description goes here.

```html
<script type="text/javascript">
  squatch.ready(function(){

    squatch.init({ tenantAlias: "YOUR_TENANT_ALIAS" }); // Always call init

    squatch.api.upsert({
      user: {                            // Object (required)
        id: 'USER_ID',                   // String (required)
        accountId: 'USER_ACCOUNT_ID',    // String (required)
        email: 'USER_EMAIL',
        firstName: 'USER_FIRST_NAME',
        lastName: 'USER_LAST_NAME'
      },
      engagementMedium: 'MEDIUM',        // String (optional: POPUP, EMBED)
      widgetType: 'WIDGET_TYPE',         // String (optional: REFERRER_WIDGET, CONVERSION_WIDGET)
      jwt: 'TOKEN'
    }).then(function(response) {
      console.log(response);
    }).catch(function(err) {
      console.log(err)l
    });
  });
</script>
```

## Render Widget
Description goes here.

```html
<script type="text/javascript">
  squatch.ready(function(){

    squatch.init({ tenantAlias: "YOUR_TENANT_ALIAS" }); // Always call init

    squatch.api.render({
      user: {                            // Object (required)
        id: 'USER_ID',                   // String (required)
        accountId: 'USER_ACCOUNT_ID'     // String (required)
      },
      engagementMedium: 'MEDIUM',        // String (optional: POPUP, EMBED)
      widgetType: 'WIDGET_TYPE',         // String (optional: REFERRER_WIDGET, CONVERSION_WIDGET)
      jwt: 'TOKEN'
    }).then(function(response) {
      console.log(response);
    }).catch(function(err) {
      console.log(err)l
    });
  });
</script>
```
