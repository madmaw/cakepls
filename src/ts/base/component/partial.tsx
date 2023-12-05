import type { ComponentType } from 'react';
import { useCallback } from 'react';

import { useConstant } from './constant';
import { useMemoisedComponent as useMemoizedComponent } from './memoized_component';
import {
  useObservable,
  useObservableValue,
} from './observable';

/**
 * Creates a Component that is partially applied with the given props. The returned Component
 * exposes a subset of the total props, with the partially applied props supplied in this hook.
 * @param Component the component to partially apply props to
 * @param curriedProps the partially applied props
 * @returns a partially applied component that exposes the remaining props
 */
export function usePartialComponent<CurriedProps, ExposedProps = {}>(
    Component: ComponentType<CurriedProps & ExposedProps>,
    curriedProps: CurriedProps,
): ComponentType<RemainingComponentProps<ExposedProps>> {

  const MemoizedComponent = useMemoizedComponent(Component);

  // observable curried props
  const curriedPropsStream = useObservable(curriedProps);

  // use the first instance of the supplied props as the default props
  const defaultCurriedProps = useConstant(curriedProps);

  // Create a component that is partially applied with the exposed props and monitors
  // the `propsStream` for the remaining, curried props
  // TODO forwardRef
  return useCallback(function (exposedProps: RemainingComponentProps<ExposedProps>) {
    // get the latest curried props (will redraw on change)
    // this callback is a component, so hooks are fine here, eslint is just too dumb to
    // recognize that
    // eslint-disable-next-line react-hooks/rules-of-hooks
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
  }, [MemoizedComponent, curriedPropsStream, defaultCurriedProps]);
}

type RemainingComponentProps<ExposedProps> = ExposedProps & JSX.IntrinsicAttributes;
