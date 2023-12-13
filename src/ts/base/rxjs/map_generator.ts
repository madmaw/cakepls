import {
  Observable,
  type OperatorFunction,
} from 'rxjs';

// TODO is there some built in rxjs function that does this already? Because there should be
export function mapAsyncGenerator<T, R>(generator: (value: T, index: number) => AsyncGenerator<R, void, boolean>): OperatorFunction<T, R> {
  return (source) => {
    return new Observable<R>((subscriber) => {
      let index = 0;
      source.subscribe({
        async next(value) {
          // TODO block any other next calls until this one is done
          const gen = generator(value, index++);
          let result = await gen.next();
          while (!result.done) {
            subscriber.next(result.value);
            result = await gen.next();
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
