import { shallowEquals } from 'base/objects';
import {
  createDefinesFactory,
  type Defines,
} from 'base/types';
import {
  type ComponentType,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { OperatorFunction } from 'rxjs';
import {
  distinctUntilChanged,
  type Observable,
  type Observer,
  Subject,
  withLatestFrom,
} from 'rxjs';

import { useRefExpression } from './constant';
import type {
  EmittingComponent,
  EmittingComponentProps,
  EventlessComponentProps,
} from './emitting';
import { useObservable } from './observable';

export type ReactiveComponentProps<Props, Events = EventlessComponentProps<Props>> = {
  readonly props: Observable<EventlessComponentProps<Props>>,
} & ({
  readonly events: Events extends undefined ? undefined : Observer<Events>,
});

export type ReactiveComponent<Props, Events = EventlessComponentProps<Props>> = ComponentType<ReactiveComponentProps<Props, Events>>;

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

export function toReactiveComponent<Props, Events>(
    Component: EmittingComponent<Props, Events>,
    initialProps?: EventlessComponentProps<Props>,
): ReactiveComponent<Props, Events> {
  return function ({
    props,
    events,
  }: ReactiveComponentProps<Props, Events>) {
    const [state, setState] = useState<EventlessComponentProps<Props> | undefined>(initialProps);

    useEffect(function () {
      const subscription = props
          // disabled because subscribe should never change, only props
          // eslint-disable-next-line react/prop-types
          .subscribe(function(state: EventlessComponentProps<Props>) {
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

export function fromReactiveComponent<Props, Events>(
    Component: ReactiveComponent<Props, Events>,
): EmittingComponent<Props, Events> {
  return function ({
    events,
    ...props
  }: EmittingComponentProps<Props, Events>) {

    // Exclude<Props, 'events'> === Exclude<Exclude<Props, 'events'>, 'events'>
    // TODO is there a way of defining the types that removes the need for this cast?
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const propsObservable = useObservable(props as EventlessComponentProps<Props>);

    return (
      <Component
        props={propsObservable}
        events={events}
      />
    );
  };
}

export function ReactiveComponentAdaptor<Props, Events>({
  Target,
  events,
  ...props
}: EmittingComponentProps<Props, Events> & { readonly Target: ReactiveComponent<Props, Events> }) {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const propsObservable = useObservable(props as Props);
  return (
    <Target
      events={events}
      props={propsObservable}
    />
  );
}

export function adaptReactiveComponent<
  SourceProps,
  TargetProps,
  SourceEvents = SourceProps,
  TargetEvents = TargetProps
  >(
    Target: ReactiveComponent<TargetProps, TargetEvents>,
    propsOperator: OperatorFunction<EventlessComponentProps<SourceProps>, EventlessComponentProps<TargetProps>>,
    eventsOperator: Defines<TargetEvents,  OperatorFunction<readonly [TargetEvents, EventlessComponentProps<SourceProps>], SourceEvents>>,
) {
  const targetEventsSubjectFactory = createDefinesFactory<TargetEvents, Subject<TargetEvents>, OperatorFunction<readonly [TargetEvents, EventlessComponentProps<SourceProps>], SourceEvents>>(function () {
    return new Subject<TargetEvents>();
  });

  const sourceEventsObservableFactory = createDefinesFactory<TargetEvents, Observable<SourceEvents>, Subject<TargetEvents>, Observable<EventlessComponentProps<SourceProps>>>(function (
    targetEventsSubject: Subject<TargetEvents>,
    sourceProps: Observable<EventlessComponentProps<SourceProps>>
  ) {
    // events operator is DefinedBy TargetEvents too, can we unwrap somehow?
    return targetEventsSubject.pipe(
      withLatestFrom(sourceProps),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      eventsOperator!,
    );
  });

  return function ({
    props: sourceProps,
    events: sourceEvents,
  }: ReactiveComponentProps<SourceProps, SourceEvents>) {

    const targetEventsSubject = useRefExpression(function () {
      return targetEventsSubjectFactory(eventsOperator);
    });

    const targetPropsObservable = useMemo(function () {
      return sourceProps.pipe(
        propsOperator,
        distinctUntilChanged(shallowEquals),
      );
    }, [sourceProps]);

    const sourceEventsObservable = useMemo(function () {
      return sourceEventsObservableFactory(targetEventsSubject, sourceProps);
    }, [targetEventsSubject, sourceProps]);

    useEffect(function () {
      if (sourceEvents == null || sourceEventsObservable == null) {
        return;
      }
      const subscription = sourceEventsObservable.subscribe(function (e) {
        sourceEvents.next(e);
      });
      return subscription.unsubscribe.bind(subscription);
    }, [sourceEventsObservable, sourceEvents]);

    return (
      <Target
        props={targetPropsObservable}
        events={targetEventsSubject}
      />
    );
  };
}
