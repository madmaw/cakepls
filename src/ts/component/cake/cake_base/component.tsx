import { Stack } from '@mui/material';
import type { EmittingComponentProps } from 'base/component/emitting';
import { UnreachableError } from 'base/errors';
import {
  type CakeBase,
  CakeBaseType
} from 'domain/model';

import { CakeInputSelectButterCakeBaseSubtype } from './cake_base_subtype';
import { CakeInputSelectCakeBaseType } from './cake_base_type';

export type CakeInputCakeBaseProps = {
  readonly base: CakeBase,
};

export function CakeInputCakeBase(props: EmittingComponentProps<CakeInputCakeBaseProps>) {
  return (
    <Stack direction="column">
      <CakeInputSelectCakeBaseType {...props}/>
      <CakeInputCakeBaseSubtype {...props}/>
    </Stack>
  );
}

function CakeInputCakeBaseSubtype(props: EmittingComponentProps<CakeInputCakeBaseProps>) {
  const { base: { type } } = props;
  switch (type) {
    case CakeBaseType.Butter:
      return (
        <CakeInputSelectButterCakeBaseSubtype {...props}/>
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
