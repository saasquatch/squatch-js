// TODO:
//  - Add JWT authentication
var window = window || "";
var chai = window ? window.chai : require('../node_modules/chai/chai');

var assert = chai.assert;

describe('Open API', function() {
  var config = {
    tenantAlias: "MY_TENANT_ALIAS",
    API_KEY: "MY_API_KEY"
  }

  it('should be defined', function() {
    assert.equal(window._sqh, null);
  });

});
