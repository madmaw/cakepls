import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { createComponentAdaptor } from 'base/component/adaptor';
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

  const StatefulCakeServes = useMemo(function () {
    return createComponentAdaptor<CakeInputServesProps, CakeInputProps>(
      CakeInputServes,
      (targetEvents: Observer<CakeInputProps>) => new CakeInputServesTransformer(targetEvents),
    );
  }, []);

  // create the
  const sectionServes = useMemo<CakeInputSection<Key>>(function () {
    return {
      key: 'serves',
      title: _(msg`Servings`),
      element: (
        <StatefulCakeServes
          cake={cake}
          events={events}
        />
      ),
    };
  }, [_, StatefulCakeServes, cake, events]);

  // store which section is open
  const StatefulCakeInput = useMemo(function () {
    return createStatefulComponent<CakeInputEvents<Key>, {
      readonly sections: readonly CakeInputSection<Key>[],
      readonly events?: never,
    }>(CakeInputImpl, {
      expanded: null,
    });
  }, []);

  return (
    <MasterDetail
      master={<StatefulCakeInput sections={[sectionServes]}/>}
      detail={<CakePreviewImpl cake={cake}/>}
      direction={display === Display.Comfortable ? 'row' : 'column'}
    />
  );
}
