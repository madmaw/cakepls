import type { ComponentType } from 'react';
import { useCallback } from 'react';

import { useConstant } from './constant';
import { useMemoisedComponent as useMemoizedComponent } from './memoized_component';
import {
  useObservable,
  useObservableValue
} from './observable';

// Creates a Component that is partially applied with the given props. The returned Component
// exposes a subset of the total props, with the partially applied props supplied in this hook.
export function usePartialComponent<CurriedProps, ExposedProps>(
    Component: ComponentType<CurriedProps & ExposedProps>,
    curriedProps: CurriedProps,
): ComponentType<ExposedProps & JSX.IntrinsicAttributes> {

  const MemoizedComponent = useMemoizedComponent(Component);

  // observable curried props
  const curriedPropsStream = useObservable(curriedProps);

  // use the first instance of the supplied props as the default props
  const defaultCurriedProps = useConstant(curriedProps);

  // Create a component that is partially applied with the exposed props and monitors
  // the `propsStream` for the remaining, curried props
  // TODO forwardRef
  return useCallback(function (exposedProps: PartialComponentProps<ExposedProps>) {
    // unfortunately React/TS doesn't recognise callbacks as Components, so we need
    // to create this Component internally to force it to recognise the hooks
    // used internally then immediately render that component
    function TypedPartialComponent (
        exposedProps: PartialComponentProps<ExposedProps>,
    ) {
      // get the latest curried props (will redraw on change)
      const curriedProps = useObservableValue(
        curriedPropsStream,
        defaultCurriedProps,
      );
      return (
        <MemoizedComponent
          {...exposedProps}
          {...curriedProps}
        />
      );
    }

    return (
      <TypedPartialComponent
        {...exposedProps}
      />
    );
  }, [MemoizedComponent, curriedPropsStream, defaultCurriedProps]);
}

type PartialComponentProps<ExposedProps> = ExposedProps & Readonly<JSX.IntrinsicAttributes>;
