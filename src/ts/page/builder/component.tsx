import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { createComponentAdaptor } from 'base/component/adaptor';
import type { EmittingComponentProps } from 'base/component/emitting';
import { createStatefulComponent } from 'base/component/stateful';
import { Display } from 'base/display';
import type {
  CakeInputEvents,
  CakeInputSection
} from 'component/cake/input/component';
import { CakeInput as CakeInputImpl } from 'component/cake/input/component';
import type { CakeInputServesProps } from 'component/cake/input/serves/component';
import { CakeInputServes } from 'component/cake/input/serves/component';
import { CakeInputServesTransformer } from 'component/cake/input/serves/transformer';
import type { CakeInputProps } from 'component/cake/input/types';
import { CakePreview as CakePreviewImpl } from 'component/cake/preview/component';
import { MasterDetail } from 'component/master_detail/component';
import type { Cake } from 'domain/model';
import type { Key } from 'react';
import {
  useCallback,
  useMemo
} from 'react';
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

  // TODO simplify HoCs
  const CakeServesComponent = useMemo(function () {
    return createComponentAdaptor<CakeInputServesProps, CakeInputServesProps, CakeInputProps, CakeInputProps>(
      CakeInputServes,
      (targetEvents: Observer<CakeInputProps>) => new CakeInputServesTransformer(targetEvents),
    );
  }, []);

  // TODO don't recreate every time the cake changes
  const ServesComponent = useCallback(function () {
    return (
      <CakeServesComponent
        cake={cake}
        events={events}
      />
    );
  }, [cake, events, CakeServesComponent]);

  const sectionServes = useMemo<CakeInputSection<Key>>(function () {
    return {
      key: 'serves',
      title: _(msg`Servings`),
      Component: ServesComponent,
    };
  }, [_, ServesComponent]);

  // TODO don't recreate every time the sections change
  const CakeInput = useCallback(function ({
    expanded,
    events
  }: EmittingComponentProps<CakeInputEvents<Key>>) {
    return (
      <CakeInputImpl
        sections={[sectionServes]}
        expanded={expanded}
        events={events}
      />
    );
  }, [sectionServes]);

  const StatefulCakeInput = useMemo(function () {
    return createStatefulComponent<CakeInputEvents<Key>>(CakeInput, {
      expanded: null,
    });
  }, [CakeInput]);

  // TODO don't recreate every time the cake changes
  const CakePreview = useCallback(function () {
    return (
      <CakePreviewImpl cake={cake}/>
    );
  }, [cake]);

  return (
    <MasterDetail
      Master={StatefulCakeInput}
      Detail={CakePreview}
      direction={display === Display.Comfortable ? 'row' : 'column'}
    />
  );
}
