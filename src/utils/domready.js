//@ts-check
/*!
  * 1domready (c) Dustin Diaz 2014 - License MIT
  *
  */
export function domready(targetDoc, fn) {
  let fns = [], listener
    , doc = targetDoc
    , hack = doc.documentElement.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)

  if (!loaded)
  doc.addEventListener(domContentLoaded, listener = function () {
    doc.removeEventListener(domContentLoaded, listener)
    loaded = true
    while (listener = fns.shift()) listener()
  })

  return loaded ? setTimeout(fn, 0) : fns.push(fn)
}
