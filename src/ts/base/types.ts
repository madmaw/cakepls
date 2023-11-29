type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

export type OneOf<
  T,
  V extends unknown[],
  NK extends keyof V = Exclude<keyof V, keyof unknown[]>
> = { [K in NK]: T extends V[K] ? V[K] : never }[NK];

export type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
}

export function createDefinesFactory<A, B, C>(factory: (c: NonNullable<C>) => B): (c: Defines<A, C>) => Defines<A, B>;
export function createDefinesFactory<A, B, C, D>(factory: (c: NonNullable<C>, d: NonNullable<D>) => B): (c: Defines<A, C>, d: D) => Defines<A, B>;
export function createDefinesFactory<A, B, C, D>(factory: (c: NonNullable<C>, d: NonNullable<D>) => B): (c: Defines<A, C>, d: Defines<A, D>) => Defines<A, B>;
export function createDefinesFactory<A, B, C, D>(factory: (c: NonNullable<C>, d?: D) => B) {
  return function (c: Defines<A, C>, d: Defines<A, D>) {
    // if C exists, D should exist
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return (exists(c) ? factory(c, d as D) : undefined) as Defines<A, B>;
  };
}

export type Defines<A, B> = A extends undefined ? undefined : B;

export function exists<T>(t: T | undefined | null): t is NonNullable<T> {
  return t != null;
}
