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

export function createStatefulComponent<
  ComponentProps,
  P extends { readonly events?: never } = { readonly events?: never },
>(
    Stateless: ComponentType<
      EmittingComponentProps<EventlessComponentProps<ComponentProps> & P, EventlessComponentProps<ComponentProps>>
    >,
    initialState: Omit<ComponentProps, 'events'>,
) {
  return function (p: P) {
    const [state, setState] = useState<EventlessComponentProps<ComponentProps>>(initialState);
    const subject = useMemo(function () {
      return new Subject<ComponentProps>();
    }, []);
    useEffect(function () {
      const subscription = subject.subscribe(setState);
      return function() {
        subscription.unsubscribe();
      };
    }, [setState, subject]);
    return (
      <Stateless
        {...p}
        {...state}
        events={subject}
      />
    );
  };
}
