import { createSelectEnum } from 'component/select';
import type { CakeBaseType } from 'domain/model';
import { CakeBaseTypes } from 'domain/values';

import { CakeBaseTypeName } from './names';

export type EditCakeBaseTypeProps = {
  readonly value: CakeBaseType,
};

export const EditCakeBaseType = createSelectEnum(CakeBaseTypeName, Object.values(CakeBaseTypes));
