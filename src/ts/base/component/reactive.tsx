import {
  type ComponentType,
  useEffect,
  useState,
} from 'react';
import type {
  Observable,
  Observer,
} from 'rxjs';

export type ReactiveComponentProps<Props, Events> = {
  readonly props: Observable<Props>,
  readonly events: Observer<Events>,
};

export type ReactiveComponent<Props, Events> = ComponentType<ReactiveComponentProps<Props, Events>>;

export function createReactiveComponent<Props extends { events: never }, Events>(
    Component: ComponentType<Props & { events: Observer<Events >}>,
    initialProps: Props,
): ReactiveComponent<Props, Events> {
  return function ({
    props,
    events,
  }: ReactiveComponentProps<Props, Events>) {
    const [state, setState] = useState(initialProps);

    useEffect(function () {
      // disabled because subscribe should never change, only props
      // eslint-disable-next-line react/prop-types
      const subscription = props.subscribe(setState);
      return subscription.unsubscribe.bind(subscription);
    }, [props]);

    return (
      <Component
        {...state}
        events={events}
      />
    );
  };
}
