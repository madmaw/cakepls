import { AbstractSynchronousComponentTransformer } from 'base/component/transformer';

import type {
  CakeInputEvents,
  CakeInputSectionProps
} from '../component';
import type { CakeInputServesProps } from './component';

export class CakeInputServesTransformer
  extends AbstractSynchronousComponentTransformer<
    CakeInputServesProps,
    CakeInputServesProps,
    CakeInputSectionProps,
    CakeInputEvents
  > {

  override transformSourceEvent(
    { serves }: CakeInputServesProps,
    { cake }: CakeInputEvents,
  ): CakeInputEvents {
    return {
      cake: {
        ...cake,
        serves,
      }
    };
  }

  override extractSourceProps({ cake: { serves } }: CakeInputEvents): CakeInputServesProps {
    return { serves };
  }
}
