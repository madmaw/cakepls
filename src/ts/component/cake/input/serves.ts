import { createAdaptorComponent } from 'base/component/adaptor';
import { AbstractSynchronousComponentAdaptor } from 'base/component/adaptor';
import type { Observer } from 'rxjs';

import type { CakeInputServesProps } from '../serves/component';
import { CakeInputServes as CakeInputServesImpl } from '../serves/component';
import type { CakeInputProps } from './types';

class CakeInputServesAdaptor
  extends AbstractSynchronousComponentAdaptor<
    CakeInputServesProps,
    CakeInputProps
  > {

  override transformSourceEvent(
    { serves }: CakeInputServesProps,
    { cake }: CakeInputProps,
  ): CakeInputProps {
    return {
      cake: {
        ...cake,
        serves,
      }
    };
  }

  override extractSourceProps({ cake: { serves } }: CakeInputProps): CakeInputServesProps {
    return { serves };
  }
}

export const CakeInputServes = createAdaptorComponent<CakeInputServesProps, CakeInputProps>(
  CakeInputServesImpl,
  (targetEvents: Observer<CakeInputProps>) => new CakeInputServesAdaptor(targetEvents),
);
