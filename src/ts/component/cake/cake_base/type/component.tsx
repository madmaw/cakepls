import type { EmittingComponentProps } from 'base/component/emitting';
import { CakeBaseName } from 'component/cake/cake_base/names';
import { SelectEnum } from 'component/select';
import type { CakeBaseType } from 'domain/model';
import { CakeBaseTypes } from 'domain/values';

export type SelectCakeBaseTypeProps = {
  readonly value: CakeBaseType,
};

export function SelectCakeBaseType({
  value,
  events,
}: EmittingComponentProps<SelectCakeBaseTypeProps>) {
  return (
    <SelectEnum
      ValueComponent={CakeBaseName}
      events={events}
      options={Object.values(CakeBaseTypes)}
      value={value}
    />
  );
}
