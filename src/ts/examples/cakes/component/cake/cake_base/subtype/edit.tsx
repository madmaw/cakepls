import type { SelectEnumEvent } from 'examples/cakes/component/select';
import { createSelectEnum } from 'examples/cakes/component/select';
import type { ButterCakeBaseType } from 'examples/cakes/domain/model';
import { ButterCakeBaseSubtypes } from 'examples/cakes/domain/values';

import { ButterCakeBaseSubtypeName } from './names';

export type EditCakeBaseSubtypeProps<S extends number> = SelectEnumEvent<S>

export type EditButterCakeBaseSubtypeProps = EditCakeBaseSubtypeProps<ButterCakeBaseType>;

export const EditButterCakeBaseSubtype = createSelectEnum(
  ButterCakeBaseSubtypeName,
  Object.values(ButterCakeBaseSubtypes),
);
