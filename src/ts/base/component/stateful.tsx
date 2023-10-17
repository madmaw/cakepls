import type { ComponentType } from 'react';
import {
  useEffect,
  useState
} from 'react';
import { Subject } from 'rxjs';

import { useConstantExpression } from './constant';
import type {
  EmittingComponentProps,
  EventlessComponentProps
} from './emitting';
import { safeMemo } from './memoized_component';

/**
 * Creates a component stores the incoming events from the supplied Stateless component as the
 * current state and supplies that state via props to the Stateless component on change
 * @param Stateless the component to receive events from and render to
 * @param initialState the initial props to supply to the Stateless component
 * @returns a stateful component that renders the Stateless component with the current state
 */
export function createStatefulComponent<
  ComponentProps,
  P extends { readonly events?: never } = { readonly events?: never },
>(
    Stateless: ComponentType<
      EmittingComponentProps<
        EventlessComponentProps<ComponentProps> & P,
        EventlessComponentProps<ComponentProps>
      >
    >,
    initialState: Omit<ComponentProps, 'events'>,
) {
  // memoise the stateless component so we don't render unnecessarily
  const MemoisedStateless = safeMemo(Stateless);
  // return a Component that takes the non-event props and combines then with the current state
  return function (p: P) {
    // store the state internally
    const [state, setState] = useState<EventlessComponentProps<ComponentProps>>(initialState);
    // create a Subject to store the incoming events
    const subject = useConstantExpression(function () {
      return new Subject<ComponentProps>();
    });
    // watch for events coming from the stateless component and set those
    // events as the current state
    useEffect(function () {
      const subscription = subject.subscribe(setState);
      return subscription.unsubscribe.bind(subscription);
    }, [setState, subject]);
    // render the current state
    return (
      <MemoisedStateless
        {...p}
        {...state}
        events={subject}
      />
    );
  };
}
