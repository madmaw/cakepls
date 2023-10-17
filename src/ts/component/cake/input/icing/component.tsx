import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import type { SelectChangeEvent } from '@mui/material';
import {
  MenuItem,
  Select
} from '@mui/material';
import type { EmittingComponentProps } from 'base/component/emitting';
import { IcingName } from 'component/cake/icing/name';
import type { IcingType } from 'domain/model';
import { IcingTypes } from 'domain/values';
import { useCallback } from 'react';

export type CakeInputIcingProps = {
  readonly type: IcingType,
};

export function CakeInputIcing({
  type,
  events,
}: EmittingComponentProps<CakeInputIcingProps>) {
  const { _ } = useLingui();

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  const onSelect = useCallback(function (e: SelectChangeEvent<IcingType>) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const type = e.target.value as IcingType;
    events.next({
      type,
    });
  }, [events]);

  return (
    <Select
      value={type}
      label={_(msg`Icing`)}
      onChange={onSelect}
    >
      {Object.values(IcingTypes).map(function (icingType) {
        return (
          <MenuItem
            value={icingType}
            key={icingType}
          >
            <IcingName icingType={icingType}/>
          </MenuItem>
        );
      })}
    </Select>
  );
}
