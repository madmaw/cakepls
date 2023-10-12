import type { Cake } from 'domain/model';

export type CakePreviewProps = {
  readonly cake: Cake,
};

export function CakePreview({ cake }: CakePreviewProps) {
  return (
    <div>Preview {cake.base.type}</div>
  );
}
