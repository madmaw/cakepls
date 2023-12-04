import type { Observable } from 'rxjs';
import {
  map,
  merge,
  withLatestFrom,
} from 'rxjs';

/**
 * Combine the two observables into a single observable that emits the latest value from both observables
 * when either observable fires
 * @param t the first observable
 * @param u the second observable
 * @returns an observable that emits the latest value from both observables when either observable fires
 */
export function mergePairwise<T, U>(t: Observable<T>, u: Observable<U>): Observable<readonly [T, U]> {
  // TODO feels like there should be a better way of doing this?
  return merge(
    t.pipe(
      withLatestFrom(u),
    ),
    u.pipe(
      withLatestFrom(t),
      map(function ([u, t]: readonly [U, T]) {
        return [t, u] as const;
      }),
    ),
  );
}
