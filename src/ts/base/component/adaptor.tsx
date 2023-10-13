import {
  useEffect,
  useMemo
} from 'react';
import type { Observer } from 'rxjs';
import {
  Subject,
  withLatestFrom,
} from 'rxjs';

import type {
  EmittingComponent,
  EmittingComponentProps,
  EventlessComponentProps
} from './emitting';
import type { ComponentTransformer } from './transformer';

export function createComponentAdaptor<
  SourceProps,
  TargetProps,
  SourceEvents = SourceProps,
  TargetEvents = TargetProps,
>(
    Source: EmittingComponent<
      SourceProps,
      SourceEvents
    >,
    transformerFactory: (targetEvents: Observer<TargetEvents>) => ComponentTransformer<
      SourceProps,
      EventlessComponentProps<EmittingComponentProps<TargetProps, TargetEvents>>,
      SourceEvents
    >,
): EmittingComponent<TargetProps, TargetEvents> {
  // TODO creates compiler errors
  //const MemoisedSource = memo(Source);
  return function ({
    events,
    ...targetProps
  }: EmittingComponentProps<TargetProps, TargetEvents> ) {
    const transformer = useMemo(function () {
      return transformerFactory(events);
    }, [events]);
    const sourceProps = useMemo(function () {
      return transformer.extractSourceProps(targetProps);
    }, [targetProps, transformer]);
    const sourceEvents = useMemo(function () {
      return new Subject<SourceEvents>();
    }, []);
    const targetPropsSubject = useMemo(function () {
      return new Subject<EventlessComponentProps<EmittingComponentProps<TargetProps, TargetEvents>>>();
    }, []);

    const sourceEventsAndTargetPropsObservable = useMemo(function () {
      return sourceEvents.pipe(
        withLatestFrom(targetPropsSubject),
      );
    }, [sourceEvents, targetPropsSubject]);

    useEffect(function () {
      function consumer (
          args: readonly [
            SourceEvents,
            EventlessComponentProps<EmittingComponentProps<TargetProps, TargetEvents>>,
          ],
      ) {
        transformer.consumeSourceEvent(...args);
      }
      const subscription = sourceEventsAndTargetPropsObservable.subscribe(consumer);
      return subscription.unsubscribe.bind(subscription);
    }, [sourceEventsAndTargetPropsObservable, transformer]);

    // NOTE: has to be done after being subscribed to otherwise pipe doesn't
    // remember the first render
    useEffect(function () {
      targetPropsSubject.next(targetProps);
    }, [targetPropsSubject, targetProps]);

    return (
      <Source
        {...sourceProps}
        events={sourceEvents}
      />
    );

  };
}
