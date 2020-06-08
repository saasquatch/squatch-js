const isObject = (item: any) =>
  typeof item === "object" && !Array.isArray(item);

export const deepMerge = <A = Object, B = Object>(
  target: Object,
  source: Object
): A & B => {
  const isDeep = (prop: string) =>
    isObject(source[prop]) &&
    target.hasOwnProperty(prop) &&
    isObject(target[prop]);
  const replaced = Object.getOwnPropertyNames(source)
    .map((prop) => ({
      [prop]: isDeep(prop)
        ? deepMerge(target[prop], source[prop])
        : source[prop],
    }))
    .reduce((a, b) => ({ ...a, ...b }), {});

  return {
    ...(target as Object),
    ...(replaced as Object),
  } as A & B;
};
