export const omitKey = <T extends Object>(
  obj: T,
  keys: string[] | string,
): Partial<T> => {
  const keysArray = Array.isArray(keys) ? keys : [keys];

  return Object.entries(obj).reduce((acc, [key, value]) => {
    return !keysArray.includes(key) ? { ...acc, [key]: value } : acc;
  }, {});
};
