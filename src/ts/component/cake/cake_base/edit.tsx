import { Stack } from '@mui/material';
import {
  adaptReactiveComponent,
  type ReactiveComponentProps,
} from 'base/component/reactive';
import { UnreachableError } from 'base/errors';
import {
  ButterCakeBaseType,
  type CakeBase,
  CakeBaseType,
  CarrotCakeBaseType,
  ChocolateCakeBaseType,
  SpongeCakeBaseType,
  WhiteCakeBaseType,
} from 'domain/model';
import { map } from 'rxjs';

import { EditCakeBaseSubtypeInCakeBase } from './edit_subtype';
import type { EditCakeBaseTypeProps } from './type/edit';
import { EditCakeBaseType } from './type/edit';

export type EditCakeBaseProps = {
  readonly base: CakeBase,
};

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

const EditCakeBaseTypeInCakeBase = adaptReactiveComponent<EditCakeBaseProps, EditCakeBaseTypeProps>(
  EditCakeBaseType,
  map(function ({ base: { type: value } }: EditCakeBaseProps) {
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

export function EditCakeBase(props: ReactiveComponentProps<EditCakeBaseProps>) {
  return (
    <Stack
      direction="column"
      spacing={1}
    >
      <EditCakeBaseTypeInCakeBase {...props}/>
      <EditCakeBaseSubtypeInCakeBase {...props}/>
    </Stack>
  );
}
