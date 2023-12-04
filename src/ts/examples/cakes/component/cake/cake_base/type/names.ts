import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { UnreachableError } from 'base/errors';
import { CakeBaseType } from 'examples/cakes/domain/model';

export function useCakeBaseTypeName(type: CakeBaseType) {
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

export function CakeBaseTypeName({ value }: {
  readonly value: CakeBaseType
}) {
  return useCakeBaseTypeName(value);
}
