import type { ComponentType } from 'react';

export type InputSequenceStep<T> = {
  readonly key: T,
  readonly title: string | JSX.Element,
  readonly Component: ComponentType,
};

export type InputSequenceProps<T> = {
  readonly steps: readonly InputSequenceStep<T>[],
};
