import { IcingTypeName } from 'examples/cakes/component/cake/icing/type/names';
import { createSelectEnum } from 'examples/cakes/component/select';
import type { IcingType } from 'examples/cakes/domain/model';
import { IcingTypes } from 'examples/cakes/domain/values';

export type EditIcingTypeProps = {
  readonly value: IcingType,
};

export const EditIcingType = createSelectEnum(
  IcingTypeName,
  Object.values(IcingTypes),
);
