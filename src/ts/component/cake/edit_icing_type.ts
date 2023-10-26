import {
  AbstractSynchronousComponentAdaptor,
  createAdaptorComponent
} from 'base/component/adaptor';
import type { Observer } from 'rxjs';

import type { EditCakeProps } from './edit';
import {
  EditIcingType,
  type EditIcingTypeProps
} from './icing/type/edit';

class EditIcingTypeInCakeAdaptor extends AbstractSynchronousComponentAdaptor<
  EditIcingTypeProps,
  EditCakeProps
> {
  /**
   * @inheritdoc
   */
  override transformSourceEvent(
    { value }: EditIcingTypeProps,
    { cake }: EditCakeProps,
  ): EditCakeProps {
    return {
      cake: {
        ...cake,
        icing: {
          type: value,
        },
      },
    };
  }

  /**
   * @inheritdoc
   */
  override extractSourceProps({
    cake: {
      icing: {
        type,
      },
    },
  }: EditCakeProps): EditIcingTypeProps {
    return {
      value: type,
    };
  }
}

export const EditIcingTypeInCake = createAdaptorComponent<EditIcingTypeProps, EditCakeProps>(
  EditIcingType,
  function (targetEvents: Observer<EditCakeProps>) {
    return new EditIcingTypeInCakeAdaptor(targetEvents);
  },
);
