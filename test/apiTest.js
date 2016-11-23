var window = window || "";
var wapi = window ? window.WidgetApi : require('../dist/Squatch.WidgetApi');
var chai = window ? window.chai : require('../node_modules/chai/chai');

console.log(wapi);
var WidgetApi = wapi.default;
console.log(WidgetApi);
var assert = chai.assert;

describe('Widget API', function() {
  var config = {
    tenantAlias: "MY_TENANT_ALIAS"
  }

  var widgetApi = new WidgetApi(config);

  it('should be defined', function() {
    assert.equal(widgetApi.tenantAlias, config.tenantAlias);
  });
});
