import type { EmittingComponentProps } from 'base/component/emitting';
import {
  useObservable,
  useObservableValue,
} from 'base/component/observable';
import { usePartialComponent } from 'base/component/partial';
import { type ReactiveComponentProps } from 'base/component/reactive';
import { Display } from 'base/display';
import { shallowEquals } from 'base/objects';
import { EditCake } from 'component/cake/edit';
import { ViewCake } from 'component/cake/view';
import type { MasterDetailProps } from 'component/master_detail/component';
import { MasterDetail } from 'component/master_detail/component';
import type { Cake } from 'domain/model';
import { useMemo } from 'react';
import {
  distinctUntilChanged,
  map,
} from 'rxjs';

export type CakeBuilderEvents = {
  readonly cake: Cake,
};

export type CakeBuilderProps = EmittingComponentProps<
  {
    readonly display: Display,
  } & CakeBuilderEvents,
  CakeBuilderEvents
>;

export function CakeBuilder({
  props,
  events,
}: ReactiveComponentProps<CakeBuilderProps, CakeBuilderEvents>) {

  const cakeOnlyProps = useMemo(function() {
    return props.pipe(
      map(function ({ cake }) {
        return {
          cake,
        };
      }),
      distinctUntilChanged(shallowEquals),
    );
  }, [props]);

  const Master = usePartialComponent(
    EditCake,
    {
      props: cakeOnlyProps,
      events,
    },
  );

  const Detail = usePartialComponent(
    ViewCake,
    {
      props: cakeOnlyProps,
      events: undefined,
    },
  );

  const propValue = useObservableValue(props, null);

  const masterDetailObservable = useObservable<MasterDetailProps>({
    Master,
    Detail,
    direction: propValue?.display === Display.Comfortable ? 'row' : 'column',
  });

  if (propValue?.display == null) {
    return null;
  }

  return (
    <MasterDetail
      props={masterDetailObservable}
      events={undefined}
    />
  );
}
