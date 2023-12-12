import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { usePartialComponent } from 'base/component/partial';
import {
  adaptReactiveComponent,
  type ReactiveComponentProps,
} from 'base/component/reactive';
import { createStatefulComponent } from 'base/component/stateful';
import type { AccordionInputSequenceEvents } from 'examples/cakes/component/input_sequence/accordion_input_sequence';
import { AccordionInputSequence } from 'examples/cakes/component/input_sequence/accordion_input_sequence';
import type { InputSequenceStep } from 'examples/cakes/component/input_sequence/types';
import type { Cake } from 'examples/cakes/domain/model';
import { useMemo } from 'react';
import { map } from 'rxjs';

import type { EditCakeBaseProps } from './cake_base/edit';
import { EditCakeBase } from './cake_base/edit';
import type { EditIcingTypeProps } from './icing/type/edit';
import { EditIcingType } from './icing/type/edit';
import type { EditServesProps } from './serves/edit';
import { EditServes } from './serves/edit';

const enum SectionId {
  Serves = 'serves',
  CakeBase = 'cake_base',
  Icing = 'icing',
}

export type EditCakeProps = {
  readonly cake: Cake,
};

const EditCakeBaseInCake = adaptReactiveComponent<EditCakeProps, EditCakeBaseProps, EditCakeProps, EditCakeBaseProps>(
  EditCakeBase,
  map(function ([{ cake: { base } }]) {
    return { base };
  }),
  map(function ([{ base }, { cake }]) {
    return ({
      cake: {
        ...cake,
        base,
      },
    });
  }),
);

const EditIcingTypeInCake = adaptReactiveComponent<EditCakeProps, EditIcingTypeProps, EditCakeProps, EditIcingTypeProps>(
  EditIcingType,
  map(function ([{ cake: { icing: { type: value } } }]) {
    return {
      value,
    };
  }),
  map(function ([{ value }, { cake }]) {
    return ({
      cake: {
        ...cake,
        icing: {
          type: value,
        },
      },
    });
  }),
);

export const EditServesInCake = adaptReactiveComponent<EditCakeProps, EditServesProps, EditCakeProps, EditServesProps>(
  EditServes,
  map(function ([{ cake: { serves } }]) {
    return { serves };
  }),
  map(function ([{ serves }, { cake }]) {
    return {
      cake: {
        ...cake,
        serves,
      },
    };
  }),
);

export const StatefulAccordionInputSequence = createStatefulComponent<AccordionInputSequenceEvents<SectionId>, {
  readonly steps: readonly InputSequenceStep<SectionId>[],
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

  // create the sections
  const sectionServes = useMemo<InputSequenceStep<SectionId>>(function () {
    return {
      key: SectionId.Serves,
      title: _(msg`Servings`),
      Component: ServesComponent,
    };
  }, [_, ServesComponent]);

  const sectionCakeBase = useMemo<InputSequenceStep<SectionId>>(function () {
    return {
      key: SectionId.CakeBase,
      title: _(msg`Cake Base`),
      Component: CakeBaseComponent,
    };
  }, [_, CakeBaseComponent]);

  const sectionIcing = useMemo<InputSequenceStep<SectionId>>(function () {
    return {
      key: SectionId.Icing,
      title: _(msg`Icing`),
      Component: IcingComponent,
    };
  }, [_, IcingComponent]);

  const steps = useMemo<InputSequenceStep<SectionId>[]>(function () {
    return [sectionServes, sectionCakeBase, sectionIcing];
  }, [sectionServes, sectionCakeBase, sectionIcing]);

  return (
    <StatefulAccordionInputSequence steps={steps}/>
  );
}
