import OpenApi from './OpenApi.js';
import 'whatwg-fetch';

var config = {
  tenantAlias: "awdodmzok4ue2",
  API_KEY: "LIVE_k8wTtI1QEJmTcLggK8C34v67rVf6LYlp"
}

var openAPI = new OpenApi(config);

var user = {
  id: "005",
  accountId: "514",
  referralCode: "MIKEDOYLE",
  email: "mike@saasquat.ch",
  imageUrl: "https://www.example.com/profile/ab5111251125",
  firstName: "Mike",
  lastName: "Doyle",
  locale: "en_US"
};


// openAPI.createUser(user).then(function(json) {
//   console.log('parsed json', json)
// }).catch(function(ex) {
//   console.log('parsing failed', ex)
// });


// openAPI.lookUpUser({"id": user.id, "accountId": user.accountId}).then(function(json) {
//   console.log('parsed json', json)
// }).catch(function(ex) {
//   console.log('parsing failed', ex)
// });

// openAPI.getUserByReferralCode({"referralCode":"JORGECONDE"}).then(function(json) {
//   console.log('parsed json', json)
// }).catch(function(ex) {
//   console.log('parsing failed', ex)
// });

// openAPI.lookUpReferralCode({"referralCode":'JORGECONDE'}).then(function(json) {
//   console.log('parsed json', json)
// }).catch(function(ex) {
//   console.log('parsing failed', ex)
// });

// openAPI.applyReferralCode({"referralCode": "JORGECONDE", "id": user.id, "accountId": user.accountId}).then(function(json) {
//   console.log('parsed json', json)
// }).catch(function(ex) {
//   console.log('parsing failed', ex)
// });

openAPI.listReferrals().then(function(json) {
  console.log('parsed json', json)
}).catch(function(ex) {
  console.log('parsing failed', ex)
});
