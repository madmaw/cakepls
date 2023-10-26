import {
  useEffect,
  useMemo
} from 'react';
import type { Observer } from 'rxjs';
import {
  Subject,
  withLatestFrom,
} from 'rxjs';

import { useConstantExpression } from './constant';
import type {
  EmittingComponent,
  EmittingComponentProps,
  EventlessComponentProps
} from './emitting';
import { safeMemo } from './memoized_component';

/**
 * Interface describing an adaptor between two components. The adaptor is responsible for
 * marshalling props passed to the source component from the target component, and un-marshalling
 * events emitted by the source component to the target component.
 */
export type ComponentAdaptor<SourceProps, TargetProps, SourceEvents> = {

  /**
   * Consume an event emitted by the source component. The expectation is this will
   * emit an event on the target component, however it is not required to do so synchronously
   * @param sourceEvent the event emitted by the source component
   * @param targetProps the most recently rendered props passed to the target component
   */
  consumeSourceEvent(sourceEvent: SourceEvents, targetProps: TargetProps): void;

  /**
   * Convert the target component props to the source component props
   * @param targetProps the props to convert from
   * @returns the converted source props
   */
  extractSourceProps(targetProps: TargetProps): SourceProps;
};

/**
 * Helper class for an adaptor implementation that emits target events
 */
export abstract class AbstractComponentAdaptor<
  SourceProps,
  TargetProps,
  SourceEvents,
  TargetEvents
> implements ComponentAdaptor<SourceProps, TargetProps, SourceEvents> {
  /**
   * @param targetEvents the Subject to emit target events on
   */
  constructor(
    protected readonly targetEvents: Observer<TargetEvents>,
  ) {}

  /**
   * @inheritdoc
   */
  abstract consumeSourceEvent(sourceEvent: SourceEvents, targetProps: TargetProps): void;

  /**
   * @inheritdoc
   */
  abstract extractSourceProps(targetProps: TargetProps): SourceProps;
}

/**
 * Helper class for an adaptor implementation that emits target events synchronously
 */
export abstract class AbstractSynchronousComponentAdaptor<
  SourceProps,
  TargetProps,
  SourceEvents = SourceProps,
  TargetEvents = TargetProps
> extends AbstractComponentAdaptor<SourceProps, TargetProps, SourceEvents, TargetEvents> {

  /**
   * @inheritdoc
   */
  override consumeSourceEvent(sourceEvent: SourceEvents, targetProps: TargetProps): void {
    this.targetEvents.next(this.transformSourceEvent(sourceEvent, targetProps));
  }

  /**
   * Converts events from source events to target events
   * @param sourceEvent the event emitted by the source component that we want to convert
   * @param targetProps the most recently rendered props passed to the target component
   * @returns the corresponding event we want to synchronously emit from the target component
   */
  abstract transformSourceEvent(sourceEvent: SourceEvents, targetProps: TargetProps): TargetEvents;
}

/**
 * Degenerate implementation of the ComponentAdaptor interface where the source and target prop
 * and event types are the same
 */
export class PassThroughComponentAdaptor<SourceProps, SourceEvents>
  extends AbstractSynchronousComponentAdaptor<SourceProps, SourceProps, SourceEvents, SourceEvents> {

  /**
   * @inheritdoc
   */
  override transformSourceEvent(sourceEvent: SourceEvents): SourceEvents {
    return sourceEvent;
  }

  /**
   * @inheritdoc
   */
  override extractSourceProps(targetProps: SourceProps): SourceProps {
    return targetProps;
  }
}

/**
 * This function creates an adaptor from the Source to the described Target component. You can then render the
 * Source component using the Target Props and receive the Target events. It is particularly useful when
 * you want to homogenize multiple components into a single interface.
 * @param Source the component to adapt from
 * @param adaptorFactory creates a ComponentAdaptor for a given stream of Target events
 * @returns a component that meets the Target interface
 */
export function createAdaptorComponent<
  SourceProps,
  TargetProps,
  SourceEvents = SourceProps,
  TargetEvents = TargetProps,
>(
    Source: EmittingComponent<
      SourceProps,
      SourceEvents
    >,
    adaptorFactory: (targetEvents: Observer<TargetEvents>) => ComponentAdaptor<
      SourceProps,
      EventlessComponentProps<EmittingComponentProps<TargetProps, TargetEvents>>,
      SourceEvents
    >,
): EmittingComponent<TargetProps, TargetEvents> {
  // Memoize the source component as it is likely the same component will be rendered multiple times
  // with the same props given RxJS only does a pointer comparison on the events
  const MemoizedSource = safeMemo(Source);
  // Return a functional component that adapts between Source and Target
  return function ({
    events,
    ...targetProps
  }: EmittingComponentProps<TargetProps, TargetEvents> ) {
    // Create a transformer for the events coming out of the Source component
    const adaptor = useMemo(function () {
      return adaptorFactory(events);
    }, [events]);
    // Convert the Target component props to the Source component props
    const sourceProps = useMemo(function () {
      return adaptor.extractSourceProps(targetProps);
    }, [targetProps, adaptor]);
    // Create the Subject for the Source events here (as opposed to in the containing factory
    // function) as a component can be rendered in multiple places at once, thus have multiple instances
    const sourceEvents = useConstantExpression(function () {
      return new Subject<SourceEvents>();
    });
    // Want to present the Target component props alongside any Source events so the Source event
    // can reason about the current component state
    const targetPropsSubject = useConstantExpression(function () {
      return new Subject<EventlessComponentProps<EmittingComponentProps<TargetProps, TargetEvents>>>();
    });

    // Stream of Source events and Target props
    const sourceEventsAndTargetPropsObservable = useMemo(function () {
      return sourceEvents.pipe(
        withLatestFrom(targetPropsSubject),
      );
    }, [sourceEvents, targetPropsSubject]);

    // Subscribe the transformer to the Source events and Target props
    useEffect(function () {
      function consumer (
          args: readonly [
            SourceEvents,
            EventlessComponentProps<EmittingComponentProps<TargetProps, TargetEvents>>,
          ],
      ) {
        adaptor.consumeSourceEvent(...args);
      }
      const subscription = sourceEventsAndTargetPropsObservable.subscribe(consumer);
      return subscription.unsubscribe.bind(subscription);
    }, [sourceEventsAndTargetPropsObservable, adaptor]);

    // Forward the Target props to the Subject
    // NOTE: has to be done after being subscribed to otherwise sourceEvents doesn't
    // remember the first event
    useEffect(function () {
      targetPropsSubject.next(targetProps);
    }, [targetPropsSubject, targetProps]);

    return (
      <MemoizedSource
        {...sourceProps}
        events={sourceEvents}
      />
    );
  };
}
