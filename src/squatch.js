import OpenApi from './api/OpenApi.js';
import cookie from './tracking/Cookie.js';

class Squatch {
  constructor() {
    this.loaded = 1;
  }

  push() {
    for ( var i = 0; i < arguments.length; i++) {
      console.log(arguments[i]);
    }

    return Array.prototype.push.apply(this, arguments);
  }
}

export default Squatch;
