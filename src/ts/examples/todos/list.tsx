import type { Eventless } from 'base/component/emitting';
import { useObserverPipe } from 'base/component/observable';
import type {
  ReactiveComponent,
  ReactiveComponentProps,
} from 'base/component/reactive';
import { useReactiveProps } from 'base/component/reactive';
import type { Defines } from 'base/types';
import type {
  Key,
  ReactNode,
} from 'react';
import {
  useCallback,
  useMemo,
} from 'react';
import { map } from 'rxjs';

export type ListEvents<E, K> = {
  readonly event: E,
  readonly id: K,
};

export type ListProps<T, E extends Eventless | undefined> = {
  readonly items: readonly T[],
  readonly ItemComponent: ReactiveComponent<Omit<T, 'id'>, E>,
};

/**
 * A generic list component that renders a list of items using the supplied ItemComponent
 */
export function List<T extends { id: K }, E extends Eventless | undefined, K extends Key = T['id']>({
  props,
  events,
}: ReactiveComponentProps<ListProps<T, E>, Defines<E, ListEvents<E, K>>>): ReactNode {
  const p = useReactiveProps(props);
  const ItemComponent = p?.ItemComponent;
  const ListItemComponent = useCallback(function ({
    index,
    id,
  }: {
    index: number,
    id: K,
  }) {
    // eslint can't handle useMemo in useCallback
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const itemProps = useMemo(function () {
      return props.pipe(
        map(function ({ items }) {
          return items[index];
        }),
      );
      // "props" should cause a recompute, but the linter seems to be ignoring it
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      props, index,
    ]);
    // eslint can't handle useMemo in useCallback
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const itemEvents = useObserverPipe<ListEvents<E, K>, E>(
      // unfortunately the dependencies do not get reduced so we end up with Observer<Defines<E, Event>
      // where we want Defines<E, Observer<Event>>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-explicit-any
      events as any,
      map(function (event: E): ListEvents<E, K> {
        return {
          event,
          id,
        };
      }),
    );
    if (ItemComponent == null) {
      return null;
    }
    return (
      <ItemComponent
        props={itemProps}
        events={itemEvents}
      />
    );
  }, [
    ItemComponent, props, events,
  ]);

  if (p == null) {
    return null;
  }
  const {
    items,
  } = p;
  return (
    <div>
      {items.map(function (item, index) {
        return (
          <ListItemComponent
            index={index}
            id={item.id}
            key={item.id}
          />
        );
      })}
    </div>
  );
}
