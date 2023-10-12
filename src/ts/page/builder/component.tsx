import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { createComponentAdaptor } from 'base/component/adaptor';
import { Display } from 'base/display';
import type {
  CakeInputEvents,
  CakeInputSection,
  CakeInputSectionProps
} from 'component/cake/input/component';
import { CakeInput as CakeInputImpl } from 'component/cake/input/component';
import type { CakeInputServesProps } from 'component/cake/input/serves/component';
import { CakeInputServes } from 'component/cake/input/serves/component';
import { CakeInputServesTransformer } from 'component/cake/input/serves/transformer';
import { CakePreview as CakePreviewImpl } from 'component/cake/preview/component';
import { MasterDetail } from 'component/master_detail/component';
import type { Cake } from 'domain/model';
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

  const sectionServes = useMemo<CakeInputSection>(function () {
    const Component = createComponentAdaptor<CakeInputServesProps, CakeInputServesProps, CakeInputSectionProps, CakeInputEvents>(
      CakeInputServes,
      (targetEvents: Observer<CakeInputEvents>) => new CakeInputServesTransformer(targetEvents),
    );
    return {
      key: 'serves',
      title: _(msg`Servings`),
      Component,
    };
  }, [_]);

  const CakeInput = useCallback(function () {
    return (
      <CakeInputImpl
        cake={cake}
        sections={[sectionServes]}
        events={events}
      />
    );
  }, [cake, events, sectionServes]);

  const CakePreview = useCallback(function () {
    return (
      <CakePreviewImpl cake={cake}/>
    );
  }, [cake]);

  return (
    <MasterDetail
      Master={CakeInput}
      Detail={CakePreview}
      direction={display === Display.Comfortable ? 'row' : 'column'}
    />
  );
}
