import type { SelectEnumEvent } from 'component/select';
import { createSelectEnum } from 'component/select';
import type { ButterCakeBaseType } from 'domain/model';
import { ButterCakeBaseSubtypes } from 'domain/values';

import { ButterCakeBaseSubtypeName } from './names';

export type EditCakeBaseSubtypeProps<S extends number> = SelectEnumEvent<S>

export type EditButterCakeBaseSubtypeProps = EditCakeBaseSubtypeProps<ButterCakeBaseType>;

export const EditButterCakeBaseSubtype = createSelectEnum(
  ButterCakeBaseSubtypeName,
  Object.values(ButterCakeBaseSubtypes),
);
