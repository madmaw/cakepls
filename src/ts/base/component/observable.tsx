import type { Defines } from 'base/types';
import { maybeDefined } from 'base/types';
import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import type {
  Observer,
  OperatorFunction,
} from 'rxjs';
import {
  BehaviorSubject,
  distinctUntilChanged,
  type Observable,
  Subject,
} from 'rxjs';

import { useConstantExpression } from './constant';

/**
 * Gets an observable that emits the given value whenever it is called
 * @param t the value to emit
 * @returns the observable that emits the given value
 */
export function useObservable<T>(t: T) {
  const subject = useConstantExpression<Subject<T>>(function () {
    return new BehaviorSubject<T>(t);
  });
  const observable = useMemo(function () {
    return subject.pipe(
      // TODO this is probably redundant with memoised components
      distinctUntilChanged(),
    );
  }, [subject]);
  useEffect(function () {
    subject.next(t);
  }, [
    subject, t,
  ]);
  return observable;
}

/**
 * Gets the latest value emitted by the given observable. By calling this hook within a
 * component it will rerender on each event emitted by the observable.
 * @param observable the observable to watch
 * @param defaultValue the default value to use on initial render
 * @returns the latest value emitted by the observable
 */
export function useObservableValue<T>(observable: Observable<T>, defaultValue: T) {
  const [
    value, setValue,
  ] = useState(defaultValue);
  useEffect(function () {
    const subscription = observable.subscribe(function (v) {
      setValue(v);
    });
    return subscription.unsubscribe.bind(subscription);
  }, [observable]);
  return value;
}

/**
 * Pipe an observer rather than an observable
 * @param observer the observer to pipe to
 * @param operator the transformation to apply to the events to the supplied observer
 * @returns the new observer that pipes to the given observer
 */
export function useObserverPipe<T, U extends {} | undefined>(
    observer: Defines<U, Observer<T>>,
    operator: OperatorFunction<U, T>,
): Defines<U, Observer<NonNullable<U>>> {
  const subject = useConstantExpression(function () {
    return new Subject<U>();
  });
  useEffect(function () {
    if (observer == null) {
      return;
    }
    const subscription = subject.pipe(
      operator,
    ).subscribe(observer);
    return subscription.unsubscribe.bind(subscription);
  }, [
    observer, subject, operator,
  ]);
  return maybeDefined(observer, subject);
}
