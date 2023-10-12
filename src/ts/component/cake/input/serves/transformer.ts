import { AbstractSynchronousComponentTransformer } from 'base/component/transformer';
import type { CakeInputProps } from 'component/cake/input/types';

import type { CakeInputServesProps } from './component';

export class CakeInputServesTransformer
  extends AbstractSynchronousComponentTransformer<
    CakeInputServesProps,
    CakeInputServesProps,
    CakeInputProps,
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
