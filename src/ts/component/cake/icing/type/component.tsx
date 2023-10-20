import type { EmittingComponentProps } from 'base/component/emitting';
import { IcingName } from 'component/cake/icing/names';
import { SelectEnum } from 'component/select';
import type { IcingType } from 'domain/model';
import { IcingTypes } from 'domain/values';

export type SelectIcingTypeProps = {
  readonly value: IcingType,
};

export function SelectIcingType({
  value,
  events,
}: EmittingComponentProps<SelectIcingTypeProps>) {
  return (
    <SelectEnum
      ValueComponent={IcingName}
      events={events}
      options={Object.values(IcingTypes)}
      value={value}
    />
  );
}
