export const convertValue = (_arg: string) => {
  let arg = _arg;
  if (_arg[0] === '"' && _arg === '"') arg = _arg.substring(1, _arg.length - 1);
  switch (arg) {
    case "null":
      return null;
    case "undefined":
      return undefined;
    case '""':
      return "";
    case "true" || "false":
      return arg === "true";
    default:
      return arg;
  }
};
