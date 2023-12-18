import type { EmittingComponentProps } from 'base/component/emitting';
import { toReactiveComponent } from 'base/component/reactive';
import type { ChangeEvent } from 'react';
import { useCallback } from 'react';

export type TodoAddItemEvents = {
  type: 'add',
} | {
  type: 'edit',
  text: string,
};

export type TodoAddItemProps = {
  text: string,
  disabled: boolean,
}

export const TodoAddItem = toReactiveComponent(function ({
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
