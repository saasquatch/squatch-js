export const getPath = (object: any, path: string) => {
  if (!path) return;
  const segments = path.split(".");

  if (segments.length === 0) return;
  if (segments.length === 1) return object[path];

  try {
    const prefix = segments.shift() as string;
    if (!segments.length) return object[prefix];
    return getPath(object[prefix], segments.join("."));
  } catch (e) {
    throw new Error(`Couldn't get corresponding value for ${path}`);
  }
};

export const setPath = (object: any, path: string, value: any) => {
  if (!path) return;
  const segments = path.split(".");

  if (segments.length === 0) return;
  if (segments.length === 1) return (object[path] = value);

  try {
    const prefix = segments.shift() as string;
    if (!object[prefix]) object[prefix] = {};
    return setPath(object[prefix], segments.join("."), value);
  } catch (e) {
    throw new Error(`Couldn't get corresponding value for ${path}`);
  }
};
