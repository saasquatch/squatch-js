import squatch from '../../dist/squatch.js';
import chai from 'chai';
import * as promise from 'es6-promise';

promise.polyfill();

var assert = chai.assert;

const { describe, it } = intern.getPlugin('interface.bdd');
var WidgetApi = squatch.WidgetApi;

describe('Squatch.js global', function() {

  it('inits without error', function() {
    squatch.init({tenantAlias:'test_foobar'});
    var wasRun = false;
    squatch.ready(function(){
      wasRun = true;
    });
    assert.equal(wasRun, true, "Should run ready functions");
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
  
  it('should be able to get a referral cookie (or none)', async function(done){
    const cookie = await widgetApi.squatchReferralCookie();
    if(!cookie || typeof cookie !== 'object'){
      throw new Error("Expected a cookie as an object with a valid code, but got" + cookie + ", a " + typeof cookie);
    }
  })
});
