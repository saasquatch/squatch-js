import cookie from "./Cookie.js";
window.cookie = cookie;


// set
// cookie('userId', 'id');
// cookie('drink', 'coffee', { path: '/' })

// get
// cookie();
//    { userId: "id", drink: "coffee"}
//
// cookie('drink');
//    "coffee"

// clear
// cookie('drink', null);
