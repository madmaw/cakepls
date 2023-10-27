import { usePartialComponent } from 'base/component/partial';
import { Display } from 'base/display';
import { EditCake } from 'component/cake/edit';
import { ViewCake } from 'component/cake/view';
import { MasterDetail } from 'component/master_detail/component';
import type { Cake } from 'domain/model';
import { memo } from 'react';
import type { Observer } from 'rxjs';

export type CakeBuilderProps = {
  readonly cake: Cake,
  readonly display: Display,
  readonly events: Observer<{ readonly cake: Cake }>,
};

const MemoizedMasterDetail = memo(MasterDetail);

export function CakeBuilder({
  cake,
  display,
  events,
}: CakeBuilderProps) {

  const Master = usePartialComponent(
    EditCake,
    {
      cake,
      events,
    }
  );

  const Detail = usePartialComponent(
    ViewCake,
    {
      cake,
    },
  );

  return (
    <MemoizedMasterDetail
      Master={Master}
      Detail={Detail}
      direction={display === Display.Comfortable ? 'row' : 'column'}
    />
  );
}
