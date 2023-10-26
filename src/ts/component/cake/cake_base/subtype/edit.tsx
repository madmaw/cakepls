import type { EmittingComponentProps } from 'base/component/emitting';
import { SelectEnum } from 'component/select';
import type { ButterCakeBaseType } from 'domain/model';
import { ButterCakeBaseSubtypes } from 'domain/values';

import { ButterCakeBaseSubtypeName } from './names';

export type EditCakeBaseSubtypeProps<T extends number> = {
  readonly value: T,
};

export function EditButterCakeBaseSubtype({
  value,
  events,
}: EmittingComponentProps<EditCakeBaseSubtypeProps<ButterCakeBaseType>>) {
  return (
    <SelectEnum
      ValueComponent={ButterCakeBaseSubtypeName}
      events={events}
      options={Object.values(ButterCakeBaseSubtypes)}
      value={value}
    />
  );
}
