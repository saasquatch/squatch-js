import OpenApi from './OpenApi.js';
import 'whatwg-fetch';

var config = {
  tenantAlias: "MY_TENANT_ALIAS",
  API_KEY: "MY_API_KEY"
}

var openAPI = new OpenApi(config);

var data = {
  id: "003",
  accountId: "321",
  referralCode: "ERICMASON",
  email: "eric@saasquat.ch",
  imageUrl: "https://www.example.com/profile/ab5111251125",
  firstName: "Eric",
  lastName: "Mason",
  locale: "en_US"
};


// openAPI.createUser(data).then(function(json) {
//   console.log('parsed json', json)
// }).catch(function(ex) {
//   console.log('parsing failed', ex)
// });


// openAPI.lookUpUser('123', '001').then(function(json) {
//   console.log('parsed json', json)
// }).catch(function(ex) {
//   console.log('parsing failed', ex)
// });

// openAPI.getUserByReferralCode('ERIKALBERS').then(function(json) {
//   console.log('parsed json', json)
// }).catch(function(ex) {
//   console.log('parsing failed', ex)
// });

// openAPI.lookUpReferralCode('JORGECONDE').then(function(json) {
//   console.log('parsed json', json)
// }).catch(function(ex) {
//   console.log('parsing failed', ex)
// });

// openAPI.applyReferralCode('ERIKALBERS', '123', '001').then(function(json) {
//   console.log('parsed json', json)
// }).catch(function(ex) {
//   console.log('parsing failed', ex)
// });

openAPI.listReferrals().then(function(json) {
  console.log('parsed json', json)
}).catch(function(ex) {
  console.log('parsing failed', ex)
});
