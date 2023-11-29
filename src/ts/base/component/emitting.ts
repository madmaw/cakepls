import type { ComponentType } from 'react';
import type { Observer } from 'rxjs';

/**
 * Interface describing the props for a component that does not emit events
 */
export type EventlessComponentProps<Props> = Omit<Props, 'events'>;

/**
 * Interface describing the props for a component that emits events
 */
export type EmittingComponentProps<Props, Events = EventlessComponentProps<Props>> = EventlessComponentProps<Props> & ({
  // TODO would be better if `Events extends never ? undefined`, but Typescript doesn't seem to be able to convert never to undefined
  readonly events: Events extends undefined ? undefined : Observer<Events>,
});

/**
 * Interface describing a component that emits events
 */
export type EmittingComponent<Props, Events = Props> = ComponentType<EmittingComponentProps<Props, Events>>;
