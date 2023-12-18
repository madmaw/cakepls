import type { ReactiveComponentProps } from 'base/component/reactive';
import { useReactiveProps } from 'base/component/reactive';
import type { ComponentType } from 'react';

export type MasterDetailProps = {
  Master: ComponentType,
  Detail: ComponentType
};

/**
 * A generic master-detail view
 */
export function MasterDetail({
  props,
}: ReactiveComponentProps<MasterDetailProps, undefined>) {
  const p = useReactiveProps(props);
  if (p == null) {
    return null;
  }
  const {
    Master,
    Detail,
  } = p;
  return (
    <div>
      <div>
        <Master />
      </div>
      <div>
        <Detail />
      </div>
    </div>
  );
}
