import { useConstantExpression } from 'base/component/constant';
import { UnreachableError } from 'base/errors';
import {
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import type {
  Observable,
  Observer,
  Subject,
} from 'rxjs';
import {
  BehaviorSubject,
  map,
} from 'rxjs';

import { App } from './app';
import { Container } from './container';
import type { Todo } from './service';
import { TodoService } from './service';

function Loading() {
  return <>Loading...</>;
}

function Error({
  reason,
}: {
  reason: string,
}) {
  return <>Error: ${reason}</>;
}

type LoadingState<T> = {
  readonly type: 'loading',
} | {
  readonly type: 'loaded',
  readonly value: T,
} | {
  readonly type: 'error',
  readonly reason: string,
};

function useRefresh(
    installState: Observer<LoadingState<Todo[]>>,
    service: TodoService,
) {
  return useCallback(async function () {
    installState.next({
      type: 'loading',
    });
    try {
      const todos = await service.getTodos();
      installState.next({
        type: 'loaded',
        value: [...todos],
      });
    } catch (e) {
      installState.next({
        type: 'error',
        reason: 'Failed to load todos',
      });
    }
  }, [installState, service]);
}

function useContainerProps(
    installState: Observable<LoadingState<Todo[]>>,
    service: TodoService,
) {
  return useMemo(function () {
    return installState.pipe(
      map(function (state) {
        switch (state.type) {
          case 'error':
            return <Error reason={state.reason} />;
          case 'loaded':
            return (
              <App
                items={state.value}
                service={service}
              />
            );
          case 'loading':
            return <Loading />;
          default:
            throw new UnreachableError(state);
        }
      }),
      map(function (children) {
        return {
          children,
        };
      }),
    );
  }, [installState, service]);
}

export function Install() {
  const service = useConstantExpression(function () {
    return new TodoService();
  });
  const installState = useConstantExpression<Subject<LoadingState<Todo[]>>>(function () {
    return new BehaviorSubject<LoadingState<Todo[]>>({
      type: 'loading',
    });
  });
  // TODO expose manual refresh
  const refresh = useRefresh(installState, service);
  const containerProps = useContainerProps(installState, service);
  // refresh on mount
  useEffect(function () {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    refresh();
  }, [refresh]);
  return (
    <Container
      props={containerProps}
      events={undefined}
    />
  );
}
