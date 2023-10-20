import type { SelectChangeEvent } from '@mui/material';
import {
  MenuItem,
  Select
} from '@mui/material';
import type { EmittingComponentProps } from 'base/component/emitting';
import {
  type ComponentType,
  useCallback
} from 'react';

export type SelectEnumEvent<T> = {
  readonly value: T,
};

export type SelectEnumProps<T> = {
  readonly options: readonly T[],
  readonly ValueComponent: ComponentType<{ readonly value: T }>,
} & SelectEnumEvent<T>;

export function SelectEnum<T extends number>({
  ValueComponent,
  events,
  value,
  options,
}: EmittingComponentProps<SelectEnumProps<T>, SelectEnumEvent<T>>) {

  // select change event is not readonly and I can't work out the rules to make it readonly
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  const onChange = useCallback(function (e: SelectChangeEvent<T>) {
    // value can be a string or T, but we know it's T
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const value = e.target.value as T;
    events.next({ value });
  }, [events]);
  return (
    <Select
      value={value}
      onChange={onChange}
    >
      {options.map(function (option) {
        return (
          <MenuItem
            value={option}
            key={option}
          >
            <ValueComponent value={option}/>
          </MenuItem>
        );
      })}
    </Select>
  );
}
