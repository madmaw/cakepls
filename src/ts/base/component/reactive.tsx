import { shallowEquals } from 'base/objects';
import {
  createDefinesFactory,
  type Defines,
  maybeDefined,
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

import { useConstantExpression } from './constant';
import type {
  EmittingComponent,
  EmittingComponentProps,
  Eventless,
} from './emitting';
import { useObservable } from './observable';

type InternalReactiveComponentProps<Props extends Eventless, Events extends Eventless | undefined> = {
  readonly props: Observable<Props>,
  readonly events: Defines<Events, Observer<Events>>,
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

export function adaptReactiveComponent<
  SourceProps extends Eventless,
  TargetProps extends Eventless,
  SourceEvents extends Eventless | undefined = SourceProps,
  TargetEvents extends Defines<SourceEvents, Eventless> = Defines<SourceEvents, TargetProps>
>(
    Target: ReactiveComponent<TargetProps, TargetEvents>,
    propsOperator: OperatorFunction<SourceProps, TargetProps>,
    eventsOperator: Defines<TargetEvents, OperatorFunction<readonly [TargetEvents, SourceProps], SourceEvents>>,
) {
  const targetEventsSubjectFactory = createDefinesFactory<
    TargetEvents,
    Subject<TargetEvents>,
    OperatorFunction<readonly [TargetEvents, SourceProps], SourceEvents>
  >(function () {
    return new Subject<TargetEvents>();
  });

  const sourceEventsObservableFactory = createDefinesFactory<
    TargetEvents,
    Observable<SourceEvents>,
    Subject<TargetEvents>,
    Observable<SourceProps>
  >(function (
    targetEventsSubject: Subject<TargetEvents>,
    sourceProps: Observable<SourceProps>,
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

    const targetEventsSubject = useConstantExpression(function () {
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
        // This will always be defined is sourceEventsObservable is defined
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        sourceEvents.next(e!);
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
