import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Slider } from '@mui/material';
import type { EmittingComponentProps } from 'base/component/emitting';
import type { Serves } from 'domain/model';
import {
  MaxServes,
  MinServes
} from 'domain/model';
import { useCallback } from 'react';

export type CakeInputServesProps = { readonly serves: Serves };

export function CakeInputServes({
  serves,
  events
}: EmittingComponentProps<CakeInputServesProps>) {
  const { _ } = useLingui();

  const onChange = useCallback(function (_1: Event, value: number | readonly number[]) {
    events.next({ serves: value as Serves });
  }, [events]);

  return (
    <Slider
      value={serves}
      aria-label={_(msg`Serves`)}
      marks={true}
      min={MinServes}
      max={MaxServes}
      onChange={onChange}
    />
  );
}
