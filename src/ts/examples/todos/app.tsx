import { useConstantExpression } from 'base/component/constant';
import { createPartialReactiveComponent } from 'base/component/partial';
import type { ReactiveComponent } from 'base/component/reactive';
import { adaptReactiveComponent } from 'base/component/reactive';
import { UnreachableError } from 'base/errors';
import { mapAsyncGenerator } from 'base/rxjs/map_generator';
import {
  useCallback,
  useMemo,
} from 'react';
import type { Subject } from 'rxjs';
import {
  BehaviorSubject,
  map,
} from 'rxjs';

import type {
  TodoAddItemEvents,
  TodoAddItemProps,
} from './add_item';
import { TodoAddItem } from './add_item';
import {
  TodoLineItem,
  type TodoLineItemEvents,
  type TodoLineItemProps,
  TodoLineItemState,
} from './line_item';
import type { ListEvents } from './list';
import { List } from './list';
import type { MasterDetailProps } from './master_detail';
import { MasterDetail } from './master_detail';
import type { Todo } from './service';
import type { TodoService } from './service';

type TodoListProps = { readonly items: readonly Todo[] };

type TodoLineItemPropsWithId = TodoLineItemProps & { id: number };
type TodoLineItemListProps = { readonly items: readonly TodoLineItemPropsWithId[] };

const enum TodoAddItemState {
  Ok,
  Saving,
  Error,
}

function useTodoAddItem(
    service: TodoService,
    todoList: Subject<TodoListProps>,
    TodoAddItemImpl: ReactiveComponent<TodoAddItemProps, TodoAddItemEvents> = TodoAddItem,
) {
  const TodoListAddItem = useMemo(function () {
    return adaptReactiveComponent<
      TodoListProps,
      TodoAddItemProps,
      TodoListProps,
      TodoAddItemEvents,
      {
        text: string,
        state: TodoAddItemState,
      }
    >(
      TodoAddItemImpl,
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
        },
      ]) {
        switch (targetEvent.type) {
          case 'add':
            yield [
              { items },
              {
                text,
                state: TodoAddItemState.Saving,
              },
            ];
            try {
              const todo = await service.addTodo({
                text,
              });
              yield [
                {
                  items: [
                    ...items,
                    todo,
                  ],
                },
                {
                  text: '',
                  state: TodoAddItemState.Ok,
                },
              ];
            } catch (e) {
              // TODO log error
              yield [
                { items },
                {
                  text,
                  state: TodoAddItemState.Error,
                },
              ];
            }
            break;
          case 'edit':
            yield [
              {
                items,
              },
              {
                text: targetEvent.text,
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
        state: TodoAddItemState.Ok,
      },
    );
  }, [service, TodoAddItemImpl]);
  return useCallback(function () {
    return (
      <TodoListAddItem
        props={todoList}
        events={todoList}
      />
    );
  }, [todoList, TodoListAddItem]);
}

export function useTodoList(services: TodoService, todoList: Subject<TodoListProps>) {
  // curry ItemComponent parameter as it will never change
  const TodoList1 = useMemo(function () {
    return createPartialReactiveComponent<
      {
        readonly ItemComponent: ReactiveComponent<TodoLineItemProps, TodoLineItemEvents>,
      },
      TodoLineItemListProps,
      ListEvents<TodoLineItemEvents, number>
    >(
      List,
      {
        ItemComponent: TodoLineItem,
      },
    );
  }, []);

  // convert events to be homogeneous with the state
  const TodoList2 = useMemo(function() {
    return adaptReactiveComponent<
      TodoListProps,
      TodoLineItemListProps,
      TodoListProps,
      ListEvents<TodoLineItemEvents, number>,
      Readonly<Record<number, TodoLineItemState>>
    >(
      TodoList1,
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
      // TODO need a way to combine overlapping events
      mapAsyncGenerator(async function* ([
        {
          event,
          id,
        },
        { items },
        state,
      ]) {
        switch (event.type) {
          case 'delete':
            yield [
              {
                items,
              },
              {
                ...state,
                [id]: TodoLineItemState.Saving,
              },
            ];
            try {
              await services.deleteTodo(id);
              yield [
                {
                  items: items.filter(function (item) {
                    return item.id !== id;
                  }),
                },
                // TODO delete id
                state,
              ];
            } catch (e) {
              // TODO log error
              console.error(e);
              yield [
                {
                  items,
                },
                {
                  ...state,
                  [id]: TodoLineItemState.Error,
                },
              ];
            }
            break;
          case 'toggle':
            yield [
              {
                items,
              },
              {
                ...state,
                [id]: TodoLineItemState.Saving,
              },
            ];
            try {
              await services.updateTodoCompleted(
                id,
                event.to,
              );
              yield [
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
                },
                {
                  ...state,
                  [id]: TodoLineItemState.Ok,
                },
              ];
            } catch (e) {
              // TODO log error
              console.error(e);
              yield [
                {
                  items,
                },
                {
                  ...state,
                  [id]: TodoLineItemState.Error,
                },
              ];
            }
            break;
          case 'edit':
            yield [
              {
                items,
              },
              {
                ...state,
                [id]: TodoLineItemState.Saving,
              },
            ];
            try {
              await services.updateTodoText(
                id,
                event.text,
              );
              yield [
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
                },
                {
                  ...state,
                  [id]: TodoLineItemState.Ok,
                },
              ];
            } catch (e) {
              // TODO log error
              console.error(e);
              yield [
                {
                  items,
                },
                {
                  ...state,
                  [id]: TodoLineItemState.Error,
                },
              ];
            }
            break;
          default:
            throw new UnreachableError(event);
        }
      }),
      // map(function ([
      //   {
      //     event,
      //     id,
      //   },
      //   {
      //     items,
      //   },
      //   state,
      // ]) {
      //   switch (event.type) {
      //     case 'delete':
      //       return [
      //         {
      //           items: items.filter(function (item) {
      //             return item.id !== id;
      //           }),
      //         }, state,
      //       ];
      //     case 'toggle':
      //       return [
      //         {
      //           items: items.map(function (item) {
      //             if (item.id !== id) {
      //               return item;
      //             }
      //             return {
      //               ...item,
      //               completed: event.to,
      //             };
      //           }),
      //         }, state,
      //       ];
      //     case 'edit':
      //       return [
      //         {
      //           items: items.map(function (item) {
      //             if (item.id !== id) {
      //               return item;
      //             }
      //             return {
      //               ...item,
      //               text: event.text,
      //             };
      //           }),
      //         }, state,
      //       ];
      //     default:
      //       throw new UnreachableError(event);
      //   }
      // }),
      {},
    );
  }, [TodoList1]);

  return useCallback(function () {
    return (
      <TodoList2
        props={todoList}
        events={todoList}
      />
    );
  }, [todoList, TodoList2]);
}

type AppProps = TodoListProps & {
  service: TodoService,
};

export function App({
  service,
  ...todoListProps
}: AppProps) {
  const todoList = useMemo<Subject<TodoListProps>>(function () {
    return new BehaviorSubject(todoListProps);
    // wipe whenever the props are refreshed externally
  }, [todoListProps]);

  const Master = useTodoAddItem(service, todoList);

  const Detail = useTodoList(service, todoList);

  const masterDetailUi = useConstantExpression<Subject<MasterDetailProps>>(function () {
    return new BehaviorSubject<MasterDetailProps>({
      Master,
      Detail,
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
