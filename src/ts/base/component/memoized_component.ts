import type { ComponentType } from 'react';
import {
  memo,
  useMemo
} from 'react';

export function safeMemo<Props>(Component: ComponentType<Props>) {
  // Known issue with React.memo
  // https://stackoverflow.com/a/73899911
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return memo(Component) as ComponentType<Props>;
}

// get a memoized component, not immediately render the component and memoize the result
export function useMemoisedComponent<Props>(Component: ComponentType<Props>) {
  return useMemo(function () {
    return safeMemo(Component);
  }, [Component]);
}
