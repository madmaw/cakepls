import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { UnreachableError } from 'base/errors';
import { ButterCakeBaseType } from 'domain/model';

export function useButterCakeBaseSubtypeName(type: ButterCakeBaseType) {
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

export function ButterCakeBaseSubtypeName({ value }: {
  readonly value: ButterCakeBaseType
}) {
  return useButterCakeBaseSubtypeName(value);
}
