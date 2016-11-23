var squatch = require('../dist/squatch.js');
var chai = require('chai');
var assert = chai.assert;

var WidgetApi = squatch.WidgetApi;
console.log(WidgetApi);

describe('Squatch.js global', function() {

  it('inits without error', function() {
    squatch.init({tenantAlias:'test_foobar'});
  });

  
});

describe('Widget API', function() {
  var config = {
    tenantAlias: "MY_TENANT_ALIAS"
  }

  var widgetApi = new WidgetApi(config);

  it('should be defined', function() {
    assert.equal(widgetApi.tenantAlias, config.tenantAlias);
  });

  /*
  ** TODO: Wait for Open API to accept no authorization header
  **
  it('should create a user', function() {
    var params = {
      id: "006",
      accountId: "513",
      referralCode: "BRANDONGAINS",
      email: "brandon@saasquat.ch",
      imageUrl: "https://www.example.com/profile/ab5111251125",
      firstName: "Brandon",
      lastName: "Gains",
      locale: "en_US"
    };

    var result = openApi.createUser(params);

    return result.then(function(json) {
      if (json.statusCode) {
        assert.equal(json.statusCode, 200, json.message);
      }
    });
  });

  });
  */
});
