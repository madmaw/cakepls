import type { EmittingComponentProps } from 'base/component/emitting';
import { toReactiveComponent } from 'base/component/reactive';
import type { ChangeEvent } from 'react';
import { useCallback } from 'react';

import type { TodoContent } from './service';

export type TodoLineItemEvents = {
  readonly type: 'toggle',
  readonly to: boolean,
} | {
  readonly type: 'delete',
} | {
  readonly type: 'edit',
  readonly text: string,
};

export const enum TodoLineItemState {
  Ok,
  Dirty,
  Saving,
  Error,
}

export type TodoLineItemProps = {
  readonly item: TodoContent,
  readonly state: TodoLineItemState,
};

export const TodoLineItem = toReactiveComponent(function ({
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
