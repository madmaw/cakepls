import { useConstantExpression } from 'base/component/constant';
import type { EmittingComponentProps } from 'base/component/emitting';
import { createPartialReactiveComponent } from 'base/component/partial';
import type { ReactiveComponent } from 'base/component/reactive';
import {
  adaptReactiveComponent,
  toReactiveComponent,
} from 'base/component/reactive';
import { UnreachableError } from 'base/errors';
import { pause } from 'base/pause';
import { mapAsyncGenerator } from 'base/rxjs/map_generator';
import type { ChangeEvent } from 'react';
import { useCallback } from 'react';
import type { Subject } from 'rxjs';
import {
  BehaviorSubject,
  map,
} from 'rxjs';

import type { ListEvents } from './list';
import { List } from './list';
import type { MasterDetailProps } from './master_detail';
import { MasterDetail } from './master_detail';
import type {
  Todo,
  TodoContent,
} from './service';
import { TodoService } from './service';

const service = new TodoService();

type TodoAddItemEvents = {
  type: 'add',
} | {
  type: 'edit',
  text: string,
};

type TodoAddItemProps = {
  text: string,
  disabled: boolean,
}

const TodoAddItem = toReactiveComponent(function ({
  events,
  text,
  disabled,
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
        disabled={disabled}
      />
      <button
        onClick={onAdd}
        disabled={disabled}
      >Add</button>
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

const enum TodoLineItemState {
  Ok,
  Dirty,
  Saving,
  Error,
}

type TodoLineItemProps = {
  readonly item: TodoContent,
  readonly state: TodoLineItemState,
};

const TodoLineItem = toReactiveComponent(function ({
  // eslint-disable-next-line destructuring-newline/object-property-newline
  item: {
    completed,
    text,
  },
  state,
  events,
}: EmittingComponentProps<TodoLineItemProps, TodoLineItemEvents>) {
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
      <button
        onClick={onDelete}
      >Delete</button>
      <> {state}</>
    </div>
  );
});

type TodoListProps = { readonly items: readonly Todo[] };

type TodoLineItemPropsWithId = TodoLineItemProps & { id: number };
type TodoLineItemListProps = { readonly items: readonly TodoLineItemPropsWithId[] };
type TodoLineItemListDefinition = typeof List<TodoLineItemPropsWithId, TodoLineItemEvents>;

// Todo list with all parameters
const TodoList1: TodoLineItemListDefinition = List;
// curry ItemComponent parameter as it will never change
const TodoList2 = createPartialReactiveComponent<
  {
    readonly ItemComponent: ReactiveComponent<TodoLineItemProps, TodoLineItemEvents>,
  },
  TodoLineItemListProps,
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
  TodoLineItemListProps,
  TodoListProps,
  ListEvents<TodoLineItemEvents, number>,
  Readonly<Record<number, TodoLineItemState>>
>(
  TodoList2,
  map(function ([
    {
      items: todos,
    },
    state,
  ]) {
    const lineItems = todos.map<TodoLineItemPropsWithId>(function (item) {
      return {
        id: item.id,
        item,
        // eslint completely misunderstanding the implications of having a numeric key in a record here
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        state: state[item.id] ?? TodoLineItemState.Ok,
      };
    });
    return {
      items: lineItems,
    };
  }),
  map(function ([
    {
      event,
      id,
    },
    {
      items,
    },
    state,
  ]) {
    switch (event.type) {
      case 'delete':
        return [
          {
            items: items.filter(function (item) {
              return item.id !== id;
            }),
          }, state,
        ];
      case 'toggle':
        return [
          {
            items: items.map(function (item) {
              if (item.id !== id) {
                return item;
              }
              return {
                ...item,
                completed: event.to,
              };
            }),
          }, state,
        ];
      case 'edit':
        return [
          {
            items: items.map(function (item) {
              if (item.id !== id) {
                return item;
              }
              return {
                ...item,
                text: event.text,
              };
            }),
          }, state,
        ];
      default:
        throw new UnreachableError(event);
    }
  }),
  {},
);

const enum TodoAddItemState {
  Ok,
  Saving,
  Error,
}

const TodoAddItem1 = adaptReactiveComponent<
  TodoListProps,
  TodoAddItemProps,
  TodoListProps,
  TodoAddItemEvents,
  {
    text: string,
    nextId: number,
    state: TodoAddItemState,
  }
>(
  TodoAddItem,
  map(function ([
    _1,
    {
      text,
      state,
    },
  ]): TodoAddItemProps {
    return {
      text,
      disabled: state === TodoAddItemState.Saving,
    };
  }),
  mapAsyncGenerator(async function* ([
    targetEvent,
    { items },
    {
      text,
      nextId,
    },
  ]) {
    switch (targetEvent.type) {
      case 'add':
        yield [
          { items },
          {
            text,
            nextId,
            state: TodoAddItemState.Saving,
          },
        ];
        await pause(1000);
        yield [
          {
            items: [
              ...items,
              {
                id: nextId,
                text,
                completed: false,
              },
            ],
          },
          {
            text: '',
            nextId: nextId + 1,
            state: TodoAddItemState.Ok,
          },
        ];
        break;
      case 'edit':
        yield [
          {
            items,
          },
          {
            text: targetEvent.text,
            nextId,
            state: TodoAddItemState.Ok,
          },
        ];
        break;
      default:
        throw new UnreachableError(targetEvent);
    }
  }),
  {
    text: '',
    nextId: 1,
    state: TodoAddItemState.Ok,
  },
);
export function App() {
  const todoList = useConstantExpression<Subject<TodoListProps>>(function () {
    return new BehaviorSubject<TodoListProps>({
      items: [
        {
          completed: false,
          id: 0,
          text: 'test',
        },
      ],
    });
  });

  const TodoList4 = useCallback(function () {
    return (
      <TodoList3
        props={todoList}
        events={todoList}
      />
    );
  }, [todoList]);
  const TodoAddItem2 = useCallback(function () {
    return (
      <TodoAddItem1
        props={todoList}
        events={todoList}
      />
    );
  }, [todoList]);

  const masterDetailUi = useConstantExpression<Subject<MasterDetailProps>>(function () {
    return new BehaviorSubject<MasterDetailProps>({
      Master: TodoAddItem2,
      Detail: TodoList4,
    });
  });

  return (
    <MasterDetail
      props={masterDetailUi}
      // TODO optional
      events={undefined}
    />
  );
}
