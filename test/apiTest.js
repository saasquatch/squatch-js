var squatch = require('../dist/squatch.js');
var chai = require('chai');
var assert = chai.assert;

var WidgetApi = squatch.WidgetApi;

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
  
  it('should be able to get a referral cookie (or none)', function(done){
    
    widgetApi.squatchReferralCookie().then(function(cookie){
      
      if(!cookie || !cookie.code){
        done("Expected a cookie as an object with a valid code, but got" + cookie + ", a " + typeof cookie);
      }else{
        done();
      }
    }).catch(done);
  })
});
