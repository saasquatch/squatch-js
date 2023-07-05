export const convertValue = (arg: string) => {
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
