import { toReactiveComponent } from 'base/component/reactive';
import type { Cake } from 'domain/model';

export type ViewCakeProps = {
  readonly cake: Cake,
};

export const ViewCake = toReactiveComponent(function ({ cake }: ViewCakeProps) {
  return (
    <div>Preview {JSON.stringify(cake, undefined, 2)}</div>
  );
});
