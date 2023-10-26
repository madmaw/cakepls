import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { usePartialComponent } from 'base/component/partial';
import { Display } from 'base/display';
import { EditCakeBaseInCake } from 'component/cake/edit_cake_base';
import { EditIcingTypeInCake } from 'component/cake/edit_icing_type';
import { EditServesInCake } from 'component/cake/edit_serves';
import type { CakeInputSection } from 'component/cake/input/component';
import { StatefulCakeInput } from 'component/cake/input/component';
import { CakePreview } from 'component/cake/preview/component';
import { MasterDetail } from 'component/master_detail/component';
import type { Cake } from 'domain/model';
import type { Key } from 'react';
import {
  memo,
  useMemo
} from 'react';
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
  const { _ } = useLingui();

  const ServesComponent = usePartialComponent(
    EditServesInCake,
    {
      cake,
      events,
    },
  );

  const IcingComponent = usePartialComponent(
    EditIcingTypeInCake,
    {
      cake,
      events
    },
  );

  const CakeBaseComponent = usePartialComponent(
    EditCakeBaseInCake,
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

  const Master = usePartialComponent(
    StatefulCakeInput,
    {
      sections: [sectionServes, sectionCakeBase, sectionIcing],
    },
  );

  const Detail = usePartialComponent(
    CakePreview,
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
