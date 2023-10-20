import { createAdaptorComponent } from 'base/component/adaptor';
import { AbstractSynchronousComponentAdaptor } from 'base/component/adaptor';
import type { Observer } from 'rxjs';

import type { CakeInputCakeBaseProps } from '../cake_base/component';
import { CakeInputCakeBase as CakeInputCakeBaseImpl } from '../cake_base/component';
import type { CakeInputProps } from './types';

class CakeInputCakeBaseAdaptor extends AbstractSynchronousComponentAdaptor<
  CakeInputCakeBaseProps,
  CakeInputProps
>{
  override transformSourceEvent(
    { base }: CakeInputCakeBaseProps,
    { cake }: CakeInputProps,
  ): CakeInputProps {
    return {
      cake: {
        ...cake,
        base,
      }
    };
  }

  override extractSourceProps(
    { cake: { base } }: CakeInputProps,
  ): CakeInputCakeBaseProps {
    return {
      base,
    };
  }
}

export const CakeInputCakeBase = createAdaptorComponent<CakeInputCakeBaseProps, CakeInputProps>(
  CakeInputCakeBaseImpl,
  (targetEvents: Observer<CakeInputProps>) => new CakeInputCakeBaseAdaptor(targetEvents),
);
