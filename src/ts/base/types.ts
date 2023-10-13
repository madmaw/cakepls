type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

export type OneOf<
  T,
  V extends unknown[],
  NK extends keyof V = Exclude<keyof V, keyof unknown[]>
> = { [K in NK]: T extends V[K] ? V[K] : never }[NK];
