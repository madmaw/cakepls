import type { ComponentType } from 'react';
import {
  useEffect,
  useMemo,
  useState
} from 'react';
import { Subject } from 'rxjs';

import type {
  EmittingComponentProps,
  EventlessComponentProps
} from './emitting';
import { safeMemo } from './memoized_component';

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
  const MemoisedStateless = safeMemo(Stateless);
  return function (p: P) {
    const [state, setState] = useState<EventlessComponentProps<ComponentProps>>(initialState);
    const subject = useMemo(function () {
      return new Subject<ComponentProps>();
    }, []);
    useEffect(function () {
      const subscription = subject.subscribe(setState);
      return subscription.unsubscribe.bind(subscription);
    }, [setState, subject]);
    return (
      <MemoisedStateless
        {...p}
        {...state}
        events={subject}
      />
    );
  };
}
