import type { ComponentType } from 'react';
import type { Observer } from 'rxjs';

/**
 * Interface describing the props for a type that does not emit events
 */
export type Eventless = {
  //readonly events?: never,
};

/**
 * Interface describing the props for a component that emits events
 */
export type EmittingComponentProps<Props extends Eventless, Events extends Eventless | undefined = Props> = Props & ({
  // TODO would be better if `Events extends never ? undefined`, but Typescript doesn't seem to be able to convert never to undefined
  readonly events: Events extends undefined ? undefined : Observer<Events>,
});

/**
 * Interface describing a component that emits events
 */
export type EmittingComponent<Props extends Eventless, Events extends Eventless | undefined = Props> = ComponentType<EmittingComponentProps<Props, Events>>;
