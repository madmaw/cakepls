import type { EmittingComponentProps } from 'base/component/emitting';
import { IcingTypeName } from 'component/cake/icing/type/names';
import { SelectEnum } from 'component/select';
import type { IcingType } from 'domain/model';
import { IcingTypes } from 'domain/values';

export type EditIcingTypeProps = {
  readonly value: IcingType,
};

export function EditIcingType({
  value,
  events,
}: EmittingComponentProps<EditIcingTypeProps>) {
  return (
    <SelectEnum
      ValueComponent={IcingTypeName}
      events={events}
      options={Object.values(IcingTypes)}
      value={value}
    />
  );
}
