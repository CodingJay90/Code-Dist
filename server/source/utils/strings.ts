export const removeTrailingSlash = (str: string) =>
    str.split('/').filter(Boolean).join('/');
