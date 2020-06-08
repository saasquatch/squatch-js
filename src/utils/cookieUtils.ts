const isObject = (item: any) => typeof item === 'object' && !Array.isArray(item);

export const deepMerge = <A = Object, B = Object>(target: Object, source: Object): A & B => {
  const isDeep = (prop: string) =>
    isObject(source[prop]) && target.hasOwnProperty(prop) && isObject(target[prop]);
  const replaced = Object.getOwnPropertyNames(source)
    .map(prop => ({ [prop]: isDeep(prop) ? deepMerge(target[prop], source[prop]) : source[prop] }))
    .reduce((a, b) => ({ ...a, ...b }), {});

  return {
    ...(target as Object),
    ...(replaced as Object)
  } as A & B;
};

export function b64decode(input){
  return atob(input.replace(/_/g, '/').replace(/-/g, '+'))
}

export function b64encode(input){
  return btoa(input).replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")		
}

// https://stackoverflow.com/a/11319865
export function getTopDomain(){
  var i,h,
    weird_cookie='weird_get_top_level_domain=cookie',
    hostname = document.location.hostname.split('.');
  for(i=hostname.length-1; i>=0; i--) {
    h = hostname.slice(i).join('.');
    document.cookie = weird_cookie + ';domain=.' + h + ';';
    if(document.cookie.indexOf(weird_cookie)>-1){
      // We were able to store a cookie! This must be it
      document.cookie = weird_cookie.split('=')[0] + '=;domain=.' + h + ';expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      return h;
    }
  }
}