import type { ComponentType } from 'react';
import type { Observer } from 'rxjs';

/**
 * Interface describing the props for a component that does not emit events
 */
export type EventlessComponentProps<Props> = Omit<Props, 'events'>;

/**
 * Interface describing the props for a component that emits events
 */
export type EmittingComponentProps<Props, Events = Props> = EventlessComponentProps<Props> & {
  readonly events: Observer<Events>
};

/**
 * Interface describing a component that emits events
 */
export type EmittingComponent<Props, Events = Props> = ComponentType<EmittingComponentProps<Props, Events>>;
