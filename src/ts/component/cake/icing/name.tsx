import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { UnreachableError } from 'base/errors';
import { IcingType } from 'domain/model';

export function useIcingName(icingType: IcingType): string {
  const { _ } = useLingui();
  switch (icingType) {
    case IcingType.None:
      return _(msg`None`);
    case IcingType.Boiled:
      return _(msg`Boiled`);
    case IcingType.Butterscotch:
      return _(msg`Butterscotch`);
    case IcingType.CreamCheese:
      return _(msg`Cream Cheese`);
    case IcingType.Fondant:
      return _(msg`Fondant`);
    case IcingType.Ganache:
      return _(msg`Ganache`);
    case IcingType.Glaze:
      return _(msg`Glaze`);
    case IcingType.Royal:
      return _(msg`Royal`);
    case IcingType.WhippedCream:
      return _(msg`Whipped Cream`);
    default:
      throw new UnreachableError(icingType);
  }
}

export function IcingName({ icingType }: {
  readonly icingType: IcingType
}) {
  return useIcingName(icingType);
}
