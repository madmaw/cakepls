import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { UnreachableError } from 'base/errors';
import {
  ButterCakeBaseType,
  CakeBaseType
} from 'domain/model';

export function useCakeBaseName(type: CakeBaseType) {
  const { _ } = useLingui();
  switch (type) {
    case CakeBaseType.Butter:
      return _(msg`Butter`);
    case CakeBaseType.Carrot:
      return _(msg`Carrot`);
    case CakeBaseType.Chocolate:
      return _(msg`Chocolate`);
    case CakeBaseType.Coffee:
      return _(msg`Coffee`);
    case CakeBaseType.RedVelvet:
      return _(msg`Red Velvet`);
    case CakeBaseType.Sponge:
      return _(msg`Sponge`);
    case CakeBaseType.White:
      return _(msg`White`);
    default:
      throw new UnreachableError(type);
  }
}

export function CakeBaseName({ value }: {
  readonly value: CakeBaseType
}) {
  return useCakeBaseName(value);
}

export function useButterCakeBaseName(type: ButterCakeBaseType) {
  const { _ } = useLingui();
  switch (type) {
    case ButterCakeBaseType.Chiffon:
      return _(msg`Chiffon`);
    case ButterCakeBaseType.Pound:
      return _(msg`Pound`);
    case ButterCakeBaseType.Yellow:
      return _(msg`Yellow`);
    default:
      throw new UnreachableError(type);
  }
}

export function ButterCakeBaseName({ value }: {
  readonly value: ButterCakeBaseType
}) {
  return useButterCakeBaseName(value);
}
