import {
  AbstractSynchronousComponentAdaptor,
  createAdaptorComponent
} from 'base/component/adaptor';
import { UnreachableError } from 'base/errors';
import type { CakeBase } from 'domain/model';
import {
  ButterCakeBaseType,
  CakeBaseType,
  CarrotCakeBaseType,
  ChocolateCakeBaseType,
  SpongeCakeBaseType,
  WhiteCakeBaseType
} from 'domain/model';
import type { Observer } from 'rxjs';

import type { CakeInputCakeBaseProps } from './component';
import {
  SelectCakeBaseType,
  type SelectCakeBaseTypeProps
} from './type/component';

function defaultCakeBase(type: CakeBaseType): CakeBase {
  switch (type) {
    case CakeBaseType.Butter:
      return {
        type,
        subtype: ButterCakeBaseType.Yellow,
      };
    case CakeBaseType.Carrot:
      return {
        type,
        subtype: CarrotCakeBaseType.Traditional,
      };
    case CakeBaseType.Chocolate:
      return {
        type,
        subtype: ChocolateCakeBaseType.Traditional,
      };
    case CakeBaseType.RedVelvet:
    case CakeBaseType.Coffee:
      return {
        type,
      };
    case CakeBaseType.Sponge:
      return {
        type,
        subtype: SpongeCakeBaseType.Traditional,
      };
    case CakeBaseType.White:
      return {
        type,
        subtype: WhiteCakeBaseType.Traditional,
      };
    default:
      throw new UnreachableError(type);
  }
}

class CakeInputSelectCakeBaseTypeAdaptor extends AbstractSynchronousComponentAdaptor<
  SelectCakeBaseTypeProps,
  CakeInputCakeBaseProps
> {

  /**
   * @inheritdoc
   */
  override transformSourceEvent({ value }: SelectCakeBaseTypeProps, targetProps: CakeInputCakeBaseProps): CakeInputCakeBaseProps {
    const {
      base: {
        type,
      },
    } = targetProps;
    if (value === type) {
      return targetProps;
    }
    return {
      ...targetProps,
      base: defaultCakeBase(value),
    };
  }

  /**
   * @inheritdoc
   */
  override extractSourceProps({
    base: {
      type: value,
    }
  }: CakeInputCakeBaseProps): SelectCakeBaseTypeProps {
    return {
      value,
    };
  }
}

export const CakeInputSelectCakeBaseType = createAdaptorComponent<SelectCakeBaseTypeProps, CakeInputCakeBaseProps>(
  SelectCakeBaseType,
  function (targetEvents: Observer<CakeInputCakeBaseProps>) {
    return new CakeInputSelectCakeBaseTypeAdaptor(targetEvents);
  },
);
