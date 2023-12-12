import {
  type Defines,
  maybeDefined,
  maybeDefinedExpression,
} from 'base/types';
import {
  type ComponentType,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { OperatorFunction } from 'rxjs';
import {
  BehaviorSubject,
  combineLatest,
  map,
  type Observable,
  type Observer,
  Subject,
  withLatestFrom,
} from 'rxjs';

import { useConstantExpression } from './constant';
import type {
  EmittingComponent,
  EmittingComponentProps,
  Eventless,
} from './emitting';
import { useObservable } from './observable';

type InternalReactiveComponentProps<Props extends Eventless, Events extends Eventless | undefined> = {
  readonly props: Observable<Props>,
  readonly events: Defines<Events, Observer<NonNullable<Events>>>,
};

export type ReactiveComponentProps<Props extends Eventless, Events extends Eventless | undefined = Props> = InternalReactiveComponentProps<Props, Events>

export type ReactiveComponent<Props extends Eventless, Events extends Eventless | undefined = Props> = ComponentType<ReactiveComponentProps<Props, Events>>;

export function useReactiveProps<Props>(props: Observable<Props>): Props | null {
  const [state, setState] = useState<Props | null>(null);
  useEffect(function () {
    const subscription = props.subscribe(function (state) {
      setState(state);
    });
    return subscription.unsubscribe.bind(subscription);
  }, [props]);
  return state;
}

export function useObserverPipe<T, U extends {} | undefined>(
    observer: Defines<U, Observer<T>>,
    operator: OperatorFunction<U, T>,
): Defines<U, Observer<U>> {
  const subject = useConstantExpression(function () {
    return new Subject<U>();
  });
  useEffect(function () {
    if (observer == null) {
      return;
    }
    const subscription = subject.pipe(
      operator,
    ).subscribe(observer);
    return subscription.unsubscribe.bind(subscription);
  }, [observer, subject, operator]);
  return maybeDefined(observer, subject);
}

export function toReactiveComponent<Props extends Eventless, Events extends Eventless | undefined = Props>(
    Component: EmittingComponent<Props, Events>,
    initialProps?: Props,
): ReactiveComponent<Props, Events> {
  return function ({
    props,
    events,
  }: ReactiveComponentProps<Props, Events>) {
    const [state, setState] = useState<Props | undefined>(initialProps);

    useEffect(function () {
      const subscription = props
          // disabled because 'subscribe' should never change, only 'props'
          // eslint-disable-next-line react/prop-types
          .subscribe(function(state: Props) {
            setState(state);
          });

      return subscription.unsubscribe.bind(subscription);
    }, [props]);

    if (state == null) {
      return null;
    }

    return (
      <Component
        {...state}
        events={events}
      />
    );
  };
}

export function fromReactiveComponent<Props extends Eventless, Events extends Eventless | undefined>(
    Component: ReactiveComponent<Props, Events>,
): EmittingComponent<Props, Events> {
  return function ({
    events,
    ...props
  }: EmittingComponentProps<Props, Events>) {

    // Props extends Eventless === Omit<Props extends Eventless & { events: x }, 'events'>
    // TODO is there a way of defining the types that removes the need for this cast?
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions
    const propsObservable = useObservable(props as any);

    return (
      <Component
        props={propsObservable}
        events={events}
      />
    );
  };
}

export function ReactiveComponentAdaptor<Props extends Eventless, Events extends Eventless>({
  Target,
  events,
  ...props
}: EmittingComponentProps<Props, Events> & { readonly Target: ReactiveComponent<Props, Events> }) {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-explicit-any
  const propsObservable = useObservable(props as any);
  return (
    <Target
      events={events}
      props={propsObservable}
    />
  );
}

// target doesn't fire events (readonly component)
export function adaptReactiveComponent<
  SourceProps extends Eventless,
  TargetProps extends Eventless,
>(
  Target: ReactiveComponent<TargetProps, undefined>,
  propsOperator: OperatorFunction<readonly [SourceProps, undefined], TargetProps>,
  eventsOperator?: undefined,
  initialState?: undefined,
): ReactiveComponent<SourceProps, undefined>;
// no state, optional source events
export function adaptReactiveComponent<
  SourceProps extends Eventless,
  TargetProps extends Eventless,
  SourceEvents extends Eventless | undefined,
  TargetEvents extends Eventless,
>(
  Target: ReactiveComponent<TargetProps, TargetEvents>,
  propsOperator: OperatorFunction<readonly [SourceProps, undefined], TargetProps>,
  eventsOperator: Defines<SourceEvents, OperatorFunction<readonly [TargetEvents, SourceProps, undefined], SourceEvents>>,
  initialState?: undefined,
): ReactiveComponent<SourceProps, SourceEvents>;
// state, but no source events
export function adaptReactiveComponent<
  SourceProps extends Eventless,
  TargetProps extends Eventless,
  SourceEvents extends undefined,
  TargetEvents extends Eventless,
  States extends Eventless,
>(
  Target: ReactiveComponent<TargetProps, TargetEvents>,
  propsOperator: OperatorFunction<readonly [SourceProps, States], TargetProps>,
  eventsOperator: OperatorFunction<readonly [TargetEvents, SourceProps, States], States>,
  initialState: States,
): ReactiveComponent<SourceProps, SourceEvents>;
// state and source events
export function adaptReactiveComponent<
  SourceProps extends Eventless,
  TargetProps extends Eventless,
  SourceEvents extends Eventless,
  TargetEvents extends Eventless,
  States extends Eventless,
>(
  Target: ReactiveComponent<TargetProps, TargetEvents>,
  propsOperator: OperatorFunction<readonly [SourceProps, States], TargetProps>,
  eventsOperator: OperatorFunction<readonly [TargetEvents, SourceProps, States], readonly [SourceEvents, States]>,
  initialState: States,
): ReactiveComponent<SourceProps, SourceEvents>;
// implementation
export function adaptReactiveComponent<
  SourceProps extends Eventless,
  TargetProps extends Eventless,
  SourceEvents extends Eventless | undefined,
  TargetEvents extends Eventless | undefined,
  States extends Eventless | undefined,
>(
    Target: ReactiveComponent<TargetProps, TargetEvents>,
    propsOperator: OperatorFunction<readonly [SourceProps, States], TargetProps>,
    eventsOperator: Defines<TargetEvents, OperatorFunction<readonly [TargetEvents, SourceProps, States], readonly [SourceEvents, States] | SourceEvents | States>>,
    initialState: States,
): ReactiveComponent<SourceProps, SourceEvents> {

  return function ({
    props: sourceProps,
    events: sourceEvents,
  }: ReactiveComponentProps<SourceProps, SourceEvents>) {
    const targetEvents = useConstantExpression(function (): Defines<TargetEvents, Subject<TargetEvents>> {
      return maybeDefined(eventsOperator, new Subject<TargetEvents>());
    });

    const states = useConstantExpression(function () {
      return new BehaviorSubject(initialState);
    });

    const targetProps = useMemo(function () {
      return combineLatest([sourceProps, states]).pipe(
        propsOperator,
      );
    }, [sourceProps, states]);
    const targetEventsAndSourcePropsAndStates = useMemo(function (): Defines<TargetEvents, Observable<[TargetEvents, SourceProps, States]>> {
      return maybeDefinedExpression(
        targetEvents,
        function (targetEvents) {
          return targetEvents.pipe(
            withLatestFrom(combineLatest([sourceProps, states])),
            // convert from [a, [b, c]] to [a, b, c]
            map(function ([a, b]) {
              return [a, ...b] as const;
            }),
          );
        },
      );
    }, [targetEvents, sourceProps, states]);

    useEffect(function () {
      if (eventsOperator && targetEventsAndSourcePropsAndStates) {
        const subscription = targetEventsAndSourcePropsAndStates
            .pipe(eventsOperator)
            .subscribe(function (sourceEventAndOrState) {
              let sourceEvent: SourceEvents | undefined;
              let state: States | undefined;
              if (Array.isArray(sourceEventAndOrState)) {
              // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                [sourceEvent, state] = sourceEventAndOrState as (readonly [SourceEvents, States]);
              } else {
                if (initialState != null) {
                  // must be a new state
                  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                  state = sourceEventAndOrState as States;
                } else {
                  // must be an event
                  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                  sourceEvent = sourceEventAndOrState as SourceEvents;
                }
              }
              if (sourceEvents != null && sourceEvent != null) {
                sourceEvents.next(sourceEvent);
              }
              if (state != null) {
                states.next(state);
              }
            });
        return subscription.unsubscribe.bind(subscription);

      }
      return;
    }, [targetEventsAndSourcePropsAndStates, sourceEvents, states]);

    return (
      <Target
        events={targetEvents}
        props={targetProps}
      />
    );
  };
}
