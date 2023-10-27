import {
  AbstractSynchronousComponentAdaptor,
  createAdaptorComponent,
} from 'base/component/adaptor';
import type { Observer } from 'rxjs';

import {
  EditCakeBase,
  type EditCakeBaseProps,
} from './cake_base/edit';
import type { EditCakeProps } from './edit';

class EditCakeBaseInCakeAdaptor extends AbstractSynchronousComponentAdaptor<
  EditCakeBaseProps,
  EditCakeProps
>{
  /**
   * @inheritdoc
   */
  override transformSourceEvent(
    { base }: EditCakeBaseProps,
    { cake }: EditCakeProps,
  ): EditCakeProps {
    return {
      cake: {
        ...cake,
        base,
      },
    };
  }

  /**
   * @inheritdoc
   */
  override extractSourceProps(
    { cake: { base } }: EditCakeProps,
  ): EditCakeBaseProps {
    return {
      base,
    };
  }
}

export const EditCakeBaseInCake = createAdaptorComponent<EditCakeBaseProps, EditCakeProps>(
  EditCakeBase,
  function (targetEvents: Observer<EditCakeProps>) {
    return new EditCakeBaseInCakeAdaptor(targetEvents);
  },
);
