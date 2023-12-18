import {
  Observable,
  type OperatorFunction,
} from 'rxjs';

// TODO is there some built in rxjs function that does this already? Because there should be
export function mapAsyncGenerator<T, R>(
    f: (value: T, index: number) => AsyncGenerator<R, void, boolean>,
): OperatorFunction<T, R> {
  return (source) => {
    return new Observable<R>((subscriber) => {
      let index = 0;
      let inProgress = false;
      source.subscribe({
        async next(value) {
          // discard any events happening while this is active
          if (!inProgress) {
            try {
              inProgress = true;
              const generator = f(value, index++);
              let result = await generator.next();
              while (!result.done) {
                subscriber.next(result.value);
                result = await generator.next();
              }
              // TODO error handling?
            } finally {
              inProgress = false;
            }
          }
        },
        error(err) {
          subscriber.error(err);
        },
        complete() {
          subscriber.complete();
        },
      });
    });
  };
}
