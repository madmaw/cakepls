import { createAdaptorComponent } from 'base/component/adaptor';
import { AbstractSynchronousComponentAdaptor } from 'base/component/adaptor';
import type { CakeInputProps } from 'component/cake/input/types';
import type { Observer } from 'rxjs';

import type { SelectIcingTypeProps } from '../icing/type/component';
import { SelectIcingType } from '../icing/type/component';

class CakeIcingAdaptor extends AbstractSynchronousComponentAdaptor<
  SelectIcingTypeProps,
  CakeInputProps
> {
  override transformSourceEvent(
    { value }: SelectIcingTypeProps,
    { cake }: CakeInputProps,
  ): CakeInputProps {
    return {
      cake: {
        ...cake,
        icing: {
          type: value,
        },
      },
    };
  }

  override extractSourceProps({
    cake: {
      icing: {
        type,
      },
    },
  }: CakeInputProps): SelectIcingTypeProps {
    return {
      value: type,
    };
  }
}

export const CakeInputIcing = createAdaptorComponent<SelectIcingTypeProps, CakeInputProps>(
  SelectIcingType,
  (targetEvents: Observer<CakeInputProps>) => new CakeIcingAdaptor(targetEvents),
);
