import type { EmittingComponentProps } from 'base/component/emitting';
import { SelectEnum } from 'component/select';
import type { CakeBaseType } from 'domain/model';
import { CakeBaseTypes } from 'domain/values';

import { CakeBaseTypeName } from './names';

export type EditCakeBaseTypeProps = {
  readonly value: CakeBaseType,
};

export function EditCakeBaseType({
  value,
  events,
}: EmittingComponentProps<EditCakeBaseTypeProps>) {
  return (
    <SelectEnum
      ValueComponent={CakeBaseTypeName}
      events={events}
      options={Object.values(CakeBaseTypes)}
      value={value}
    />
  );
}
