!function(a,b){
  a("squatch","./dist/Squatch.js",b)
}(function(a,b,c){
  // a = context
  // b = file
  // c = context
  // console.log(a,b,c === window);

  var d,e,f;
  c["_" + a] = {},
  c[a] = {},
  c[a].ready = function(b){
    c["_" + a].ready =  c["_" + a].ready || [];
    c["_" + a].ready.push(b);
  },

  e=document.createElement("script"),
  e.async=1,
  e.src=b,
  f=document.getElementsByTagName("script")[0],
  f.parentNode.insertBefore(e,f)
},this);
