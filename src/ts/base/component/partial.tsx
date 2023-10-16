import type { ComponentType } from 'react';
import { useCallback } from 'react';
import type { Observable } from 'rxjs';

import { useMemoisedComponent as useMemoizedComponent } from './memoized_component';
import {
  useObservable,
  useObservableValue
} from './observable';

export function usePartialComponent<CurriedProps, ExposedProps>(
    Component: ComponentType<CurriedProps & ExposedProps>,
    props: CurriedProps,
): ComponentType<ExposedProps> {

  const MemoizedComponent = useMemoizedComponent(Component);

  const observable = useObservable(props);
  return useCallback(function (exposedProps: ExposedProps) {
    const TypedPartialComponent: ComponentType<PartialComponentProps<CurriedProps, ExposedProps>> = PartialComponent;
    return (
      <TypedPartialComponent
        {...exposedProps}
        _Component={MemoizedComponent}
        _observable={observable}
        _defaultProps={props}
      />
    );
    // NOTE the default props are intentionally only used once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MemoizedComponent, observable]);
}

type PartialComponentProps<CurriedProps, ExposedProps> = ExposedProps & {
  readonly _observable: Observable<CurriedProps>,
  readonly _Component: ComponentType<CurriedProps & ExposedProps>,
  readonly _defaultProps: CurriedProps,
};

function PartialComponent<CurriedProps, ExposedProps>(
    {
      _observable: observable,
      _Component: Component,
      _defaultProps: defaultProps,
      ...exposedProps
    }: PartialComponentProps<CurriedProps, ExposedProps>,
) {
  const curriedProps = useObservableValue(
    observable,
    defaultProps,
  );
  return (
    <Component
      // TODO can we avoid this cast with clever typing?
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      {...exposedProps as ExposedProps & JSX.IntrinsicAttributes}
      {...curriedProps}
    />
  );
}
