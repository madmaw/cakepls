import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import type { EmittingComponentProps } from 'base/component/emitting';
import { usePartialComponent } from 'base/component/partial';
import { StatefulAccordionInputSequence } from 'component/input_sequence/accordion_input_sequence';
import type { InputSequenceStep } from 'component/input_sequence/types';
import type { Cake } from 'domain/model';
import type { Key } from 'react';
import { useMemo } from 'react';

import { EditCakeBaseInCake } from './edit_cake_base';
import { EditIcingTypeInCake } from './edit_icing_type';
import { EditServesInCake } from './edit_serves';

export type EditCakeProps = {
  readonly cake: Cake,
};

export function EditCake({
  cake,
  events,
}: EmittingComponentProps<EditCakeProps>) {

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
      events,
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
  const sectionServes = useMemo<InputSequenceStep<Key>>(function () {
    return {
      key: 'serves',
      title: _(msg`Servings`),
      Component: ServesComponent,
    };
  }, [_, ServesComponent]);

  const sectionCakeBase = useMemo<InputSequenceStep<Key>>(function () {
    return {
      key: 'cake_base',
      title: _(msg`Cake Base`),
      Component: CakeBaseComponent,
    };
  }, [_, CakeBaseComponent]);

  const sectionIcing = useMemo<InputSequenceStep<Key>>(function () {
    return {
      key: 'icing',
      title: _(msg`Icing`),
      Component: IcingComponent,
    };
  }, [_, IcingComponent]);

  const steps = useMemo<InputSequenceStep<Key>[]>(function () {
    return [sectionServes, sectionCakeBase, sectionIcing];
  }, [sectionServes, sectionCakeBase, sectionIcing]);

  return (
    <StatefulAccordionInputSequence steps={steps}/>
  );
}
