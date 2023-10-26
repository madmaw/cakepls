import {
  AbstractSynchronousComponentAdaptor,
  createAdaptorComponent
} from 'base/component/adaptor';
import type { Observer } from 'rxjs';

import type { EditCakeProps } from './edit';
import {
  EditServes,
  type EditServesProps
} from './serves/edit';

class EditServesInCakeAdaptor extends AbstractSynchronousComponentAdaptor<
  EditServesProps,
  EditCakeProps
> {
  /**
   * @inheritdoc
   */
  override transformSourceEvent(
    { serves }: EditServesProps,
    { cake }: EditCakeProps,
  ): EditCakeProps {
    return {
      cake: {
        ...cake,
        serves,
      },
    };
  }

  /**
   * @inheritdoc
   */
  override extractSourceProps({ cake: { serves } }: EditCakeProps): EditServesProps {
    return { serves };
  }
}

export const EditServesInCake = createAdaptorComponent<EditServesProps, EditCakeProps>(
  EditServes,
  function (targetEvents: Observer<EditCakeProps>) {
    return new EditServesInCakeAdaptor(targetEvents);
  },
);
