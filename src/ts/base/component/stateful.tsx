import { useMemo } from 'react';
import {
  BehaviorSubject,
  map,
  merge,
  withLatestFrom,
} from 'rxjs';

import { useRefExpression } from './constant';
import { safeMemo } from './memoized_component';
import { useObservable } from './observable';
import type { ReactiveComponent } from './reactive';

/**
 * Creates a component that stores the incoming events from the supplied Stateless component as the
 * current state and supplies that state via props to the Stateless component on change, thus making it
 * stateful
 * @param Stateless the component to receive events from and render to
 * @param initialState the initial props to supply to the Stateless component
 * @returns a stateful component that renders the Stateless component with the current state
 */
export function createStatefulComponent<
  State extends {},
  P = {},
>(
    Stateless: ReactiveComponent<State & P, State>,
    initialState: State,
) {
  // memoise the stateless component so we don't render unnecessarily
  const MemoisedStateless = safeMemo(Stateless);
  // return a Component that takes the non-event props and combines then with the current state
  return function (p: P) {
    const ps = useObservable(p);
    // create a Subject to store the incoming events
    const events = useRefExpression(function () {
      return new BehaviorSubject<State>(initialState);
    });
    // watch for events coming from the stateless component, combine those with the passed props
    // and expose as props
    const props = useMemo(function () {
      return merge(
        ps.pipe(
          withLatestFrom(events),
          map(function ([p, state]: readonly [P, State]) {
            return {
              ...state, ...p,
            };
          }),
        ),
        events.pipe(
          withLatestFrom(ps),
          map(function ([state, p]: readonly [State, P]) {
            return {
              ...state, ...p,
            };
          }),
        ),
      );
    }, [ps, events]);
    // render the current state
    return (
      <MemoisedStateless
        props={props}
        // TODO remove the cast somehow
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
        events={events as any}
      />
    );
  };
}
