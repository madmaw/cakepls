import { AbstractSynchronousComponentAdaptor } from 'base/component/adaptor';
import type { CakeInputProps } from 'component/cake/input/types';

import type { CakeInputServesProps } from './component';

export class CakeInputServesAdaptor
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
