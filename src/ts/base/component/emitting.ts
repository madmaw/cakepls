import type { ComponentType } from 'react';
import type { Observer } from 'rxjs';

export type EventlessComponentProps<Props> = Omit<Props, 'events'>;

export type EmittingComponentProps<Props, Events = Props> = EventlessComponentProps<Props> & {
  readonly events: Observer<Events>
};

export type EmittingComponent<Props, Events = Props> = ComponentType<EmittingComponentProps<Props, Events>>;
