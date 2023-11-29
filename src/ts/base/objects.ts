export function keys<T extends {}, K extends keyof T = keyof T>(obj: T): K[] {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return Object.keys(obj) as K[];
}

export function shallowEquals<T>(a: T | undefined, b: T | undefined): boolean {
  if (a === b) {
    return true;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  if (typeof a !== 'object' || typeof b !== 'object' || a == null || b == null) {
    return false;
  }
  const aKeys = keys(a);
  const bKeys = keys(b);
  if (aKeys.length !== bKeys.length) {
    return false;
  }
  return aKeys.every(key => a[key] === b[key]);
}
