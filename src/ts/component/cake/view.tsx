import type { Cake } from 'domain/model';

export type ViewCakeProps = {
  readonly cake: Cake,
};

export function ViewCake({ cake }: ViewCakeProps) {
  return (
    <div>Preview {cake.base.type}</div>
  );
}
