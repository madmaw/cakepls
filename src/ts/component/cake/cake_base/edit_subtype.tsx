import {
  AbstractSynchronousComponentAdaptor,
  createAdaptorComponent
} from 'base/component/adaptor';
import type { EmittingComponentProps } from 'base/component/emitting';
import { UnreachableError } from 'base/errors';
import type {
  ButterCakeBaseType,
  CakeBase
} from 'domain/model';
import { CakeBaseType } from 'domain/model';
import type { Observer } from 'rxjs';

import {
  EditButterCakeBaseSubtype,
  type EditCakeBaseSubtypeProps
} from './subtype/edit';

type EditCakeBaseSubtypeInCakeBaseProps<T extends CakeBaseType, S extends number> = {
  readonly base: {
    readonly type: T,
    readonly subtype: S,
  }
};

class EditCakeBaseSubtypeInCakeBaseAdaptor<T extends CakeBaseType, S extends number> extends AbstractSynchronousComponentAdaptor<
  EditCakeBaseSubtypeProps<S>,
  EditCakeBaseSubtypeInCakeBaseProps<T, S>
> {
  constructor(
    targetEvents: Observer<EditCakeBaseSubtypeInCakeBaseProps<T, S>>,
    private readonly type: T,
  ) {
    super(targetEvents);
  }

  override transformSourceEvent(
    { value }: EditCakeBaseSubtypeProps<S>,
  ): EditCakeBaseSubtypeInCakeBaseProps<T, S> {
    return {
      base: {
        type: this.type,
        subtype: value,
      },
    };
  }

  override extractSourceProps(
    { base: { subtype } }: EditCakeBaseSubtypeInCakeBaseProps<T, S>,
  ): EditCakeBaseSubtypeProps<S> {
    return {
      value: subtype,
    };
  }
}

const EditButterCakeBaseSubtypeInCakeBase = createAdaptorComponent(
  EditButterCakeBaseSubtype,
  function (targetEvents: Observer<EditCakeBaseSubtypeInCakeBaseProps<CakeBaseType.Butter, ButterCakeBaseType>>) {
    return new EditCakeBaseSubtypeInCakeBaseAdaptor(targetEvents, CakeBaseType.Butter);
  },
);

export function EditCakeBaseSubtypeInCakeBase(props: EmittingComponentProps<{
  readonly base: CakeBase,
}>) {
  const { base: { type } } = props;
  switch (type) {
    case CakeBaseType.Butter:
      return (
        <EditButterCakeBaseSubtypeInCakeBase {...props}/>
      );
    case CakeBaseType.Carrot:
    case CakeBaseType.Chocolate:
    case CakeBaseType.Coffee:
    case CakeBaseType.RedVelvet:
    case CakeBaseType.Sponge:
    case CakeBaseType.White:
      return null;
    default:
      throw new UnreachableError(type);
  }
}
