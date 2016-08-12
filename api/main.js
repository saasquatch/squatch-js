import Open from './Open.js';
import 'whatwg-fetch';

var config = {
  tenantAlias: "MY_TENANT_ALIAS",
  API_KEY: "MY API KEY"
}

var open = new Open(config);

var data = {
  id: "002",
  accountId: "123",
  referralCode: "ERIKALBERS",
  email: "erik@saasquat.ch",
  imageUrl: "https://www.example.com/profile/ab5111251125",
  firstName: "Erik",
  lastName: "Albers",
  locale: "en_US"
};



// open.createUser(data).then(function(json) {
//   console.log('parsed json', json)
// }).catch(function(ex) {
//   console.log('parsing failed', ex)
// });


// open.lookUpUser('123', '001').then(function(json) {
//   console.log('parsed json', json)
// }).catch(function(ex) {
//   console.log('parsing failed', ex)
// });
