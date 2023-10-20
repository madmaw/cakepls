import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import type { EmittingComponentProps } from 'base/component/emitting';
import { usePartialComponent } from 'base/component/partial';
import { Display } from 'base/display';
import { CakeInputCakeBase } from 'component/cake/input/cake_base';
import type { CakeInputSection } from 'component/cake/input/component';
import { StatefulCakeInput } from 'component/cake/input/component';
import { CakeInputIcing } from 'component/cake/input/icing';
import { CakeInputServes } from 'component/cake/input/serves';
import type { CakeInputProps } from 'component/cake/input/types';
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

  const ServesComponent = usePartialComponent<EmittingComponentProps<CakeInputProps>>(
    CakeInputServes,
    {
      cake,
      events,
    },
  );

  const IcingComponent = usePartialComponent<EmittingComponentProps<CakeInputProps>>(
    CakeInputIcing,
    {
      cake,
      events
    },
  );

  const CakeBaseComponent = usePartialComponent<EmittingComponentProps<CakeInputProps>>(
    CakeInputCakeBase,
    {
      cake,
      events,
    }
  );

  // create the sections
  const sectionServes = useMemo<CakeInputSection<Key>>(function () {
    return {
      key: 'serves',
      title: _(msg`Servings`),
      Component: ServesComponent,
    };
  }, [_, ServesComponent]);

  const sectionCakeBase = useMemo<CakeInputSection<Key>>(function () {
    return {
      key: 'cake_base',
      title: _(msg`Cake Base`),
      Component: CakeBaseComponent,
    };
  }, [_, CakeBaseComponent]);

  const sectionIcing = useMemo<CakeInputSection<Key>>(function () {
    return {
      key: 'icing',
      title: _(msg`Icing`),
      Component: IcingComponent,
    };
  }, [_, IcingComponent]);

  return (
    <MasterDetail
      master={<StatefulCakeInput sections={[sectionServes, sectionCakeBase, sectionIcing]}/>}
      detail={<CakePreviewImpl cake={cake}/>}
      direction={display === Display.Comfortable ? 'row' : 'column'}
    />
  );
}
