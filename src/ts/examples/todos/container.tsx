import {
  type ReactiveComponentProps,
  useReactiveProps,
} from 'base/component/reactive';
import type { PropsWithChildren } from 'react';

export type ContainerProps = PropsWithChildren;

export function Container({ props }: ReactiveComponentProps<ContainerProps, undefined>) {
  const p = useReactiveProps(props);
  if (p == null) {
    return null;
  }
  const {
    children,
  } = p;
  return (
    <div>
      {children}
    </div>
  );
}
