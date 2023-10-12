import Format from 'string-format';

export function checkExists<T>(
    t: T | null,
    message: string,
    ...args: readonly string[]
): T {
  if (t == null) {
    throw new Error(Format(message, ...args));
  }
  return t;
}
