import {
  alwaysDefined,
  type Defines,
} from 'base/types';
import type { ComponentType } from 'react';
import {
  useEffect,
  useMemo,
} from 'react';
import type { OperatorFunction } from 'rxjs';
import {
  combineLatest,
  Subject,
  withLatestFrom,
} from 'rxjs';
import {
  BehaviorSubject,
  map,
} from 'rxjs';

import { useConstantExpression } from './constant';
import type { Eventless } from './emitting';
import { safeMemo } from './memoized_component';
import { useObservable } from './observable';
import type {
  ReactiveComponent,
  ReactiveComponentProps,
} from './reactive';

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

export type StatefulEvent<State, Events> = {
  event: Events,
  state: State,
};

export function createReactiveStatefulAdapter<
  SourceProps extends Eventless,
  TargetProps extends Eventless,
  SourceEvents extends Eventless | undefined = SourceProps,
  TargetEvents extends Eventless = TargetProps,
  State extends Eventless = {},
> (
    Target: ReactiveComponent<TargetProps, TargetEvents>,
    initialState: State,
    propsOperator: OperatorFunction<readonly [SourceProps, State], TargetProps>,
    eventsOperator: Defines<TargetEvents, OperatorFunction<readonly [TargetEvents, SourceProps, State], [SourceEvents, State]>>,
): ReactiveComponent<SourceProps, SourceEvents> {

  return function ({
    props: sourceProps,
    events: sourceEvents,
  }: ReactiveComponentProps<SourceProps, SourceEvents>) {
    const targetEvents = useConstantExpression(function (): Defines<TargetEvents, Subject<TargetEvents>> {
      return alwaysDefined(new Subject<TargetEvents>());
    });

    const states = useConstantExpression(function () {
      return new BehaviorSubject(initialState);
    });

    const targetProps = useMemo(function () {
      return combineLatest([sourceProps, states]).pipe(
        propsOperator,
      );
    }, [sourceProps, states]);
    const targetEventsAndSourcePropsAndStates = useMemo(function () {
      return targetEvents.pipe(
        withLatestFrom(combineLatest([sourceProps, states])),
        // convert from [a, [b, c]] to [a, b, c]
        map(function ([a, b]) {
          return [a, ...b] as const;
        }),
      );
    }, [targetEvents, sourceProps, states]);

    useEffect(function () {
      const subscription = targetEventsAndSourcePropsAndStates
          .pipe(eventsOperator)
          .subscribe(function ([sourceEvent, state]) {
            if (sourceEvents != null) {
              sourceEvents.next(sourceEvent);
            }
            states.next(state);
          });
      return subscription.unsubscribe.bind(subscription);
    }, [targetEventsAndSourcePropsAndStates, sourceEvents, states]);

    return (
      <Target
        events={targetEvents}
        props={targetProps}
      />
    );
  };
}

export function createReactiveStatefulComponent<
  State extends Eventless,
  Events extends Eventless,
  P extends Eventless = {},
>(
    Stateless: ReactiveComponent<State & P, Events>,
    initialState: State,
    eventOperator: OperatorFunction<[Events, State], State>,
): ReactiveComponent<P, StatefulEvent<State, Events>> {
  return function ({
    events,
    props,
  }: ReactiveComponentProps<P, StatefulEvent<State, Events>>) {
    const statelessEvents = useConstantExpression(function (): Defines<Events, Subject<Events>> {
      return alwaysDefined(new Subject<Events>());
    });

    const store = useConstantExpression(function () {
      return new BehaviorSubject(initialState);
    });

    const statelessProps = useMemo(function () {
      return combineLatest([props, store]).pipe(
        map(function ([p, state]) {
          return {
            ...p,
            ...state,
          };
        }),
      );
    }, [props, store]);

    const eventsAndStates = useMemo(function () {
      return statelessEvents.pipe(
        withLatestFrom(store),
      );
    }, [statelessEvents, store]);

    useEffect(function () {
      eventsAndStates.subscribe(function ([event, state]) {
        events.next({
          event,
          state,
        });
      });
    }, [eventsAndStates, events]);

    const states = useMemo(function () {
      return eventsAndStates.pipe(eventOperator);
    }, [eventsAndStates]);

    useEffect(function () {
      states.subscribe(function (state) {
        store.next(state);
      });
    }, [states, store]);

    return (
      <Stateless
        events={statelessEvents}
        props={statelessProps}
      />
    );
  };
}
