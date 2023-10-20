import type { EmittingComponentProps } from 'base/component/emitting';
import { ButterCakeBaseName } from 'component/cake/cake_base/names';
import { SelectEnum } from 'component/select';
import type { ButterCakeBaseType } from 'domain/model';
import { ButterCakeBaseSubtypes } from 'domain/values';

export type SelectCakeBaseSubtypeProps<T extends number> = {
  readonly value: T,
};

export function SelectButterCakeBaseSubtype({
  value,
  events,
}: EmittingComponentProps<SelectCakeBaseSubtypeProps<ButterCakeBaseType>>) {
  return (
    <SelectEnum
      ValueComponent={ButterCakeBaseName}
      events={events}
      options={Object.values(ButterCakeBaseSubtypes)}
      value={value}
    />
  );
}
