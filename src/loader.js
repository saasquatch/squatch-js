!((a, b) => {
  a("squatch", "./dist/Squatch.js", b);
})((a, b, c) => {
  // a = context
  // b = file
  // c = context
  // console.log(a,b,c === window);

  let d;

  let e;
  let f;
  (c[`_${a}`] = {}),
    (c[a] = {}),
    (c[a].ready = (b) => {
      c[`_${a}`].ready = c[`_${a}`].ready || [];
      c[`_${a}`].ready.push(b);
    }),
    (e = document.createElement("script")),
    (e.async = 1),
    (e.src = b),
    (f = document.getElementsByTagName("script")[0]),
    f.parentNode.insertBefore(e, f);
}, this);
