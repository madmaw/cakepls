import { AbstractSynchronousComponentAdaptor } from 'base/component/adaptor';
import type { CakeInputProps } from 'component/cake/input/types';

import type { CakeInputIcingProps } from './component';

export class CakeInputIcingAdaptor extends AbstractSynchronousComponentAdaptor<
  CakeInputIcingProps,
  CakeInputProps
> {
  override transformSourceEvent(
    icing: CakeInputIcingProps,
    { cake }: CakeInputProps,
  ): CakeInputProps {
    return {
      cake: {
        ...cake,
        icing,
      },
    };
  }

  override extractSourceProps({
    cake: {
      icing,
    },
  }: CakeInputProps): CakeInputIcingProps {
    return icing;
  }
}
