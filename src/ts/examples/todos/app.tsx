import type {
  EmittingComponentProps,
  Eventless,
} from 'base/component/emitting';
import { createPartialReactiveComponent } from 'base/component/partial';
import type {
  ReactiveComponent,
  ReactiveComponentProps,
} from 'base/component/reactive';
import {
  adaptReactiveComponent,
  toReactiveComponent,
  useObserverPipe,
  useReactiveProps,
} from 'base/component/reactive';
import { createStatefulComponent } from 'base/component/stateful';
import { UnreachableError } from 'base/errors';
import type { Defines } from 'base/types';
import { exists } from 'base/types';
import type {
  ChangeEvent,
  Key,
  ReactNode,
} from 'react';
import {
  memo,
  useCallback,
  useMemo,
} from 'react';
import {
  filter,
  map,
} from 'rxjs';

type TodoContent = {
  readonly text: string,
  readonly completed: boolean,
};

type Todo = TodoContent & {
  id: number,
};

type TodoAddItemEvents = {
  type: 'add',
} | {
  type: 'edit',
  text: string,
};

type TodoAddItemProps = {
  text: string,
}

const TodoAddItem = toReactiveComponent(function ({
  events,
  text,
}: EmittingComponentProps<TodoAddItemProps, TodoAddItemEvents>) {
  const onAdd = useCallback(function () {
    events.next({
      type: 'add',
    });
  }, [events]);
  const onEdit = useCallback(function (e: ChangeEvent<HTMLInputElement>) {
    events.next({
      type: 'edit',
      text: e.target.value,
    });
  }, [events]);
  const onEnter = useCallback(function (e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      events.next({
        type: 'add',
      });
    }
  }, [events]);
  return (
    <div>
      <input
        type="text"
        onChange={onEdit}
        onKeyDown={onEnter}
        value={text}
      />
      <button onClick={onAdd}>Add</button>
    </div>
  );
});

type TodoLineItemEvents = {
  readonly type: 'toggle',
  readonly to: boolean,
} | {
  readonly type: 'delete',
} | {
  readonly type: 'edit',
  readonly text: string,
};

const TodoLineItem = toReactiveComponent(function ({
  // eslint-disable-next-line destructuring-newline/object-property-newline
  item: {
    completed,
    text,
  },
  events,
}: EmittingComponentProps<{ readonly item: TodoContent }, TodoLineItemEvents>) {
  const onDelete = useCallback(function () {
    events.next({
      type: 'delete',
    });
  }, [events]);
  const onToggle = useCallback(function (e: ChangeEvent<HTMLInputElement>) {
    events.next({
      type: 'toggle',
      to: e.target.checked,
    });
  }, [events]);
  const onEdit = useCallback(function (e: ChangeEvent<HTMLInputElement>) {
    events.next({
      type: 'edit',
      text: e.target.value,
    });
  }, [events]);
  return (
    <div>
      <input
        type="checkbox"
        checked={completed}
        onChange={onToggle}
      />
      <input
        type="text"
        value={text}
        onChange={onEdit}
      />
      <button onClick={onDelete}>Delete</button>
    </div>
  );
});

type ListEvents<E, K> = {
  readonly event: E,
  readonly id: K,
};

type ListProps<T, E extends Eventless | undefined> = {
  readonly items: readonly T[],
  readonly ItemComponent: ReactiveComponent<{ readonly item: Omit<T, 'id'> }, E>,
};

function List<T extends { id: K }, E extends Eventless | undefined, K extends Key = T['id']>({
  props,
  events,
}: ReactiveComponentProps<ListProps<T, E>, Defines<E, ListEvents<E, K>>>): ReactNode {
  const p = useReactiveProps(props);
  const ItemComponent = p?.ItemComponent;
  const ListItemComponent = useCallback(function ({
    id,
  }: {
    id: K,
  }) {
    // eslint can't handle useMemo in useCallback
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const itemProps = useMemo(function () {
      return props.pipe(
        map(function ({ items }) {
          return items.find(function (item) {
            return item.id === id;
          });
        }),
        filter(exists),
        map(function (item) {
          return { item };
        }),
      );
      // "props" should cause a recompute, but the linter seems to be ignoring it
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, id]);
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
  }, [ItemComponent, props, events]);

  if (p == null) {
    return null;
  }
  const {
    items,
  } = p;
  return (
    <div>
      {items.map(function (item) {
        return (
          <ListItemComponent
            id={item.id}
            key={item.id}
          />
        );
      })}
    </div>
  );
}

type MasterDetailProps<Props extends Eventless, Events extends Eventless | undefined> = {
  Master: ReactiveComponent<Props, Events>,
  Detail: ReactiveComponent<Props, Events>
} & Props;

function MasterDetail<Props extends Eventless, Events extends Eventless | undefined> ({
  props,
  events,
}: ReactiveComponentProps<MasterDetailProps<Props, Events>, Events>) {
  const p = useReactiveProps(props);
  if (p == null) {
    return null;
  }
  const {
    Master,
    Detail,
  } = p;
  return (
    <div>
      <div>
        <Master
          props={props}
          events={events}
        />
      </div>
      <div>
        <Detail
          props={props}
          events={events}
        />
      </div>
    </div>
  );
}

type TodoListProps = { items: readonly Todo[] };

type TodoListDefinition = typeof List<Todo, TodoLineItemEvents>;
// Todo list with all parameters
const TodoList1 = memo<TodoListDefinition>(List);
// curry ItemComponent parameter as it will never change
const TodoList2 = createPartialReactiveComponent<
  {
    readonly ItemComponent: ReactiveComponent<{ readonly item: TodoContent }, TodoLineItemEvents>,
  },
  {
    readonly items: readonly Todo[],
  },
  ListEvents<TodoLineItemEvents, number>
>(
  TodoList1,
  {
    ItemComponent: TodoLineItem,
  },
);
// convert events to be homogeneous with the state
const TodoList3 = adaptReactiveComponent<
  TodoListProps,
  TodoListProps,
  TodoListProps,
  ListEvents<TodoLineItemEvents, number>
>(
  TodoList2,
  map(function ([props]) {
    return props;
  }),
  map(function ([{
    event,
    id,
  }, { items }]) {
    switch (event.type) {
      case 'delete':
        return {
          items: items.filter(function (item) {
            return item.id !== id;
          }),
        };
      case 'toggle':
        return {
          items: items.map(function (item) {
            if (item.id !== id) {
              return item;
            }
            return {
              ...item,
              completed: event.to,
            };
          }),
        };
      case 'edit':
        return {
          items: items.map(function (item) {
            if (item.id !== id) {
              return item;
            }
            return {
              ...item,
              text: event.text,
            };
          }),
        };
      default:
        throw new UnreachableError(event);
    }
  }),
);

const TodoAddItem1 = adaptReactiveComponent<
  TodoListProps,
  TodoAddItemProps,
  TodoListProps,
  TodoAddItemEvents,
  { text: string, nextId: number }
>(
  TodoAddItem,
  map(function ([_1, { text }]): TodoAddItemProps {
    return {
      text,
    };
  }),
  map(function ([targetEvent, { items }, {
    text,
    nextId,
  }]) {
    switch (targetEvent.type) {
      case 'add':
        return [{
          items: [...items, {
            id: nextId,
            text,
            completed: false,
          }],
        }, {
          text: '',
          nextId: nextId + 1,
        }];
      case 'edit':
        return [{
          items,
        }, {
          text: targetEvent.text,
          nextId,
        }];
      default:
        throw new UnreachableError(targetEvent);
    }
  }),
  {
    text: '',
    nextId: 1,
  },
);

type TodoMasterDetailDefinition = typeof MasterDetail<TodoListProps, TodoListProps>;
const TodoMasterDetail1: TodoMasterDetailDefinition = MasterDetail;
const TodoMasterDetail2 = createPartialReactiveComponent<
  Pick<MasterDetailProps<TodoListProps, TodoListProps>, 'Master' | 'Detail'>,
  TodoListProps
> (
  TodoMasterDetail1,
  {
    Master: TodoAddItem1,
    Detail: TodoList3,
  },
);
const TodoMasterDetail3 = createStatefulComponent(
  TodoMasterDetail2,
  {
    items: [{
      completed: false,
      id: 0,
      text: 'test',
    }],
  },
);

export function App() {
  return (
    <TodoMasterDetail3/>
  );
}
