import type { Defines } from 'base/types';
import type { ComponentType } from 'react';
import type { Observer } from 'rxjs';

/**
 * Interface describing the props for a type that does not emit events
 */
export type Eventless = {
  // work around for weak type checking in Typescript
  // https://mariusschulz.com/blog/weak-type-detection-in-typescript#workarounds-for-weak-types
  readonly [prop: string]: unknown,
  readonly events?: never,
};

/**
 * Interface describing the props for a component that emits events
 */
export type EmittingComponentProps<
  Props extends Eventless,
  Events extends Eventless | undefined = Props
> = Props & ({
  readonly events: Defines<Events, Observer<NonNullable<Events>>>,
});

/**
 * Interface describing a component that emits events
 */
export type EmittingComponent<
  Props extends Eventless,
  Events extends Eventless | undefined = Props
> = ComponentType<EmittingComponentProps<Props, Events>>;
