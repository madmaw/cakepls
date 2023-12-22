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

// doesn't cause errors, but seems to be ignored
// export type Defines<A, B> = A extends undefined
//   ? undefined
//   : A extends Defines<infer C, infer D>
//     ? C extends undefined
//       ? undefined
//       : D extends undefined
//         ? undefined
//         : B
//     : B;
// causes typescript errors
// export type Defines<A, B> = A extends undefined
//   ? undefined
//   : A extends Defines<infer C, infer D>
//     ? Defines<C | D, B>
//     : B;

export type Defines<A, B, C = undefined> = A extends undefined
  ? C
  : B;

export type Defined<B> = B extends Defines<unknown, infer C> ? C : B;
export type DefinedBy<B> = B extends Defines<infer A, unknown> ? A : NonNullable<B>;

//export function dedupeDefines<A>(a: A): Defines<A, A>;
export function dedupeDefines<A, B>(a: Defines<A, B>): Defines<A, B>;
export function dedupeDefines<A, B, C>(a: Defines<Defines<A, NonNullable<C>>, B>): Defines<A, B> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions
  return a as any;
}

export function maybeDefined<A extends {} | undefined, B>(a: A | Defines<A, unknown>, b: B): Defines<A, B> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return a != null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions
    ? b as any
    : undefined;
}

export function eitherDefined<A extends {} | undefined, B, C>(a: A, b: B, c: C): Defines<A, B, C> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return a != null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions
    ? b as any
    : c;

}

export function maybeDefinedExpression<R, A, B>(a: Defines<A, B>, f: (b: B) => R): Defines<A, R> {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-unsafe-return
  return a != null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-argument
    ? f(a as any) as any
    : undefined;
}

export function alwaysDefined<A extends {}, B>(b: B): Defines<A, B> {
  // unfortunately Typescript doesn't seem to be able to infer that A is always defined
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-explicit-any
  return b as any;
}

export function thisOrThat<A extends {} | undefined, This, That> (a: A, ths: This, tht: That): A extends undefined ? This : That {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-return
  return (a != null ? ths : tht) as any;
}

export function exists<T>(t: T | undefined | null): t is NonNullable<T> {
  return t != null;
}
