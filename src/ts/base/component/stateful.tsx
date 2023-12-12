import {
  alwaysDefined,
  type Defines,
} from 'base/types';
import type { ComponentType } from 'react';
import { useMemo } from 'react';
import type { Subject } from 'rxjs';
import { combineLatest } from 'rxjs';
import {
  BehaviorSubject,
  map,
} from 'rxjs';

import { useConstantExpression } from './constant';
import type { Eventless } from './emitting';
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
  State extends Eventless,
  P = {},
>(
    Stateless: ReactiveComponent<State & P, State>,
    initialState: State,
): ComponentType<P> {
  // memoise the stateless component so we don't render unnecessarily
  const MemoisedStateless = safeMemo(Stateless);
  // return a Component that takes the non-event props and combines then with the current state
  return function (p: P) {
    const ps = useObservable(p);
    // create a Subject to store the incoming events
    const events = useConstantExpression(function (): Defines<State, Subject<State>> {
      return alwaysDefined<State, Subject<State>>(new BehaviorSubject<State>(initialState));
    });
    // watch for events coming from the stateless component, combine those with the passed props
    // and expose as props
    const props = useMemo(function () {
      return combineLatest([ps, events]).pipe(
        map(function ([p, event]: readonly [P, State]) {
          return {
            ...event,
            ...p,
          };
        }),
      );
    }, [ps, events]);
    // render the current state
    return (
      <MemoisedStateless
        props={props}
        events={events}
      />
    );
  };
}
