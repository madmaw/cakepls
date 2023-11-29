import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { usePartialComponent } from 'base/component/partial';
import type { ReactiveComponentProps } from 'base/component/reactive';
import { createStatefulComponent } from 'base/component/stateful';
import type { AccordionInputSequenceEvents } from 'component/input_sequence/accordion_input_sequence';
import { AccordionInputSequence } from 'component/input_sequence/accordion_input_sequence';
import type { InputSequenceStep } from 'component/input_sequence/types';
import type { Cake } from 'domain/model';
import type { Key } from 'react';
import {
  useEffect,
  useMemo,
} from 'react';

import { EditCakeBaseInCake } from './edit_cake_base';
import { EditIcingTypeInCake } from './edit_icing_type';
import { EditServesInCake } from './edit_serves';

export type EditCakeProps = {
  readonly cake: Cake,
};

export const StatefulAccordionInputSequence = createStatefulComponent<AccordionInputSequenceEvents<Key>, {
  readonly steps: readonly InputSequenceStep<Key>[],
}>(AccordionInputSequence, { expanded: null });

export function EditCake(props: ReactiveComponentProps<EditCakeProps>) {

  const { _ } = useLingui();

  const ServesComponent = usePartialComponent(
    EditServesInCake,
    props,
  );

  const IcingComponent = usePartialComponent(
    EditIcingTypeInCake,
    props,
  );

  const CakeBaseComponent = usePartialComponent(
    EditCakeBaseInCake,
    props,
  );

  useEffect(function () {
    const subscription = props.props.subscribe(function (v) {
      console.log(JSON.stringify(v));
    });
    return subscription.unsubscribe.bind(subscription);
  }, [props]);

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
