import { createSelectEnum } from 'examples/cakes/component/select';
import type { CakeBaseType } from 'examples/cakes/domain/model';
import { CakeBaseTypes } from 'examples/cakes/domain/values';

import { CakeBaseTypeName } from './names';

export type EditCakeBaseTypeProps = {
  readonly value: CakeBaseType,
};

export const EditCakeBaseType = createSelectEnum(CakeBaseTypeName, Object.values(CakeBaseTypes));
