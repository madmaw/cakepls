import { adaptReactiveComponent } from 'base/component/reactive';
import { UnreachableError } from 'base/errors';
import type { CakeBase } from 'domain/model';
import {
  ButterCakeBaseType,
  CakeBaseType,
  CarrotCakeBaseType,
  ChocolateCakeBaseType,
  SpongeCakeBaseType,
  WhiteCakeBaseType,
} from 'domain/model';
import { map } from 'rxjs';

import type { EditCakeBaseProps } from './edit';
import {
  EditCakeBaseType,
  type EditCakeBaseTypeProps,
} from './type/edit';

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

export const EditCakeBaseTypeInCakeBase = adaptReactiveComponent<EditCakeBaseProps, EditCakeBaseTypeProps>(
  EditCakeBaseType,
  map(function({ base: { type: value } }: EditCakeBaseProps) {
    return {
      value,
    };
  }),
  map(function ([{ value }, props]: readonly [EditCakeBaseTypeProps, EditCakeBaseProps]) {
    return {
      ...props,
      base: defaultCakeBase(value),
    };
  }),
);
