import type { ComponentType } from 'react';
import {
  memo,
  useMemo
} from 'react';

/**
 * Type safe implementation of React.memo, no change in behavior
 * @param Component the component to memoize
 * @returns a memoized component
 */
export function safeMemo<Props>(Component: ComponentType<Props>) {
  // Known issue with React.memo
  // https://stackoverflow.com/a/73899911
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return memo(Component) as ComponentType<Props>;
}

/**
 * Get a memoized component, not immediately render the component and memoize the result
 * like useMemo would do
 */
export function useMemoisedComponent<Props>(Component: ComponentType<Props>) {
  return useMemo(function () {
    return safeMemo(Component);
  }, [Component]);
}
