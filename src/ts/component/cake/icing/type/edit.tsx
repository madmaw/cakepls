import { IcingTypeName } from 'component/cake/icing/type/names';
import { createSelectEnum } from 'component/select';
import type { IcingType } from 'domain/model';
import { IcingTypes } from 'domain/values';

export type EditIcingTypeProps = {
  readonly value: IcingType,
};

export const EditIcingType = createSelectEnum(
  IcingTypeName,
  Object.values(IcingTypes),
);
