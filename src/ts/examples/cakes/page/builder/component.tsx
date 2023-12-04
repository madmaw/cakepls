import {
  useObservable,
  useObservableValue,
} from 'base/component/observable';
import { usePartialComponent } from 'base/component/partial';
import { type ReactiveComponentProps } from 'base/component/reactive';
import { shallowEquals } from 'base/objects';
import { EditCake } from 'examples/cakes/component/cake/edit';
import { ViewCake } from 'examples/cakes/component/cake/view';
import type { MasterDetailProps } from 'examples/cakes/component/master_detail/component';
import { MasterDetail } from 'examples/cakes/component/master_detail/component';
import type { Cake } from 'examples/cakes/domain/model';
import { useMemo } from 'react';
import {
  distinctUntilChanged,
  map,
} from 'rxjs';

export type CakeBuilderEvents = {
  readonly cake: Cake,
};

export const enum Display {
  Compact,
  Comfortable,
}

export type CakeBuilderProps =
  {
    readonly display: Display,
  } & CakeBuilderEvents;

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
