export const removeTrailingSlash = (str: string): string =>
  str.split("/").filter(Boolean).join("/");
