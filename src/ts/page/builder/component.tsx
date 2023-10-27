import type { EmittingComponentProps } from 'base/component/emitting';
import { usePartialComponent } from 'base/component/partial';
import { Display } from 'base/display';
import { EditCake } from 'component/cake/edit';
import { ViewCake } from 'component/cake/view';
import { MasterDetail } from 'component/master_detail/component';
import type { Cake } from 'domain/model';
import { memo } from 'react';

export type CakeBuilderEvents = {
  readonly cake: Cake,
};

export type CakeBuilderProps = EmittingComponentProps<
  {
    readonly display: Display,
  } & CakeBuilderEvents,
  CakeBuilderEvents
>;

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
    },
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
