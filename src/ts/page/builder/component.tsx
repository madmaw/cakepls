import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { usePartialComponent } from 'base/component/partial';
import { Display } from 'base/display';
import type { CakeInputSection } from 'component/cake/input/component';
import { StatefulCakeInput } from 'component/cake/input/component';
import { CakeInputServes } from 'component/cake/input/serves';
import { CakePreview as CakePreviewImpl } from 'component/cake/preview/component';
import { MasterDetail } from 'component/master_detail/component';
import type { Cake } from 'domain/model';
import type { Key } from 'react';
import { useMemo } from 'react';
import type { Observer } from 'rxjs';

export type CakeBuilderProps = {
  readonly cake: Cake,
  readonly display: Display,
  readonly events: Observer<{ readonly cake: Cake }>,
};

export function CakeBuilder({
  cake,
  display,
  events,
}: CakeBuilderProps) {
  const { _ } = useLingui();

  const CakeInputServesCake = usePartialComponent<
    { readonly cake: Cake },
    { readonly events: Observer<{ readonly cake: Cake }>}
  >(
    CakeInputServes,
    { cake },
  );

  // create the sections
  const sectionServes = useMemo<CakeInputSection<Key>>(function () {
    return {
      key: 'serves',
      title: _(msg`Servings`),
      element: (
        <CakeInputServesCake events={events}/>
      ),
    };
  }, [_, CakeInputServesCake, events]);

  return (
    <MasterDetail
      master={<StatefulCakeInput sections={[sectionServes]}/>}
      detail={<CakePreviewImpl cake={cake}/>}
      direction={display === Display.Comfortable ? 'row' : 'column'}
    />
  );
}
