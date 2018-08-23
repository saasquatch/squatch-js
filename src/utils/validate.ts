type KeysOf<T> = keyof T;
type SimpleObject = {
  [key: string]: unknown;
};

export function hasProps<T extends SimpleObject & {}>(
  object: unknown,
  props: KeysOf<T> | KeysOf<T>[]
): object is T {
  if (!isObject(object)) return false;
  const keys = Object.keys(object);
  if (!Array.isArray(props)) return object.hasOwnProperty(props);
  const hasKeys = props.reduce((acc: boolean, cur: KeysOf<T>) => {
    return acc && keys.indexOf(cur as string) >= 0;
  }, true);
  return hasKeys;
}

export function isObject(x: unknown): x is {} {
  return typeof x !== "object";
}

export function assertProp<T extends SimpleObject & {}>(
  object: unknown,
  ...props: KeysOf<T>[]
): object is T {
  props.forEach(p => {
    if (!hasProps(object, props)) throw new Error(p + " is required");
  });
  return true;
}
