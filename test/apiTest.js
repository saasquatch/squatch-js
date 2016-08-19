var assert = chai.assert;
var expect = chai.expect;

var OpenAPI = window.OpenApi;

// TODO:
//  - Add JWT authentication

describe('Open API', function() {
  var config = {
    tenantAlias: "awdodmzok4ue2",
    API_KEY: "LIVE_k8wTtI1QEJmTcLggK8C34v67rVf6LYlp"
  }

  var openApi = new OpenApi(config);

  it('should be defined', function() {
    assert.equal(openApi.tenantAlias, config.tenantAlias);
    assert.equal(openApi.API_KEY, config.API_KEY);
  });

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

  it('should look up a user', function() {
    var params = {
      id: "001",
      accountId: "123",
    };

    var result = openApi.lookUpUser(params);

    return result.then(function(json) {
      if (json.statusCode) {
        assert.equal(json.statuscode, 200, json.message);
      }
      assert.equal(json.id, params.id);
    });
  });

  it('should get a user by referral code', function() {
    var params = {
      "referralCode":"JORGECONDE"
    };

    var result = openApi.getUserByReferralCode(params);

    return result.then(function(json) {
      if (json.statusCode) {
        assert.equal(json.statuscode, 200, json.message);
      }
      assert.equal(json.referralCode, params.referralCode);
    });
  });

  it('should look up a referral code', function() {
    var params = {
      "referralCode":"JORGECONDE"
    };

    var result = openApi.lookUpReferralCode(params);

    return result.then(function(json) {
      if (json.statusCode) {
        assert.equal(json.statuscode, 200, json.message);
      }
      assert.equal(json.code, params.referralCode);
    });
  });

  it('should apply a referral code', function() {
    var params = {
      "referralCode":"JORGECONDE",
      "id": "006",
      "accountId": "513"
    };

    var result = openApi.applyReferralCode(params);

    return result.then(function(json) {
      if (json.statusCode) {
        assert.equal(json.statusCode, 200, json.message);
      }
      assert.equal(json.code, params.referralCode);
    });
  });

  it('should list referrals', function() {
    var result = openApi.listReferrals();

    return result.then(function(json) {
      if (json.statusCode) {
        assert.equal(json.statuscode, 200, json.message);
      }
      assert.isNumber(json.count, "How many referrals");
      assert.isArray(json.referrals, "List of referrals");
    });
  });
});
