import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Slider } from '@mui/material';
import type { EmittingComponentProps } from 'base/component/emitting';
import { toReactiveComponent } from 'base/component/reactive';
import type { Serves } from 'domain/model';
import {
  MaxServes,
  MinServes,
} from 'domain/model';
import { useCallback } from 'react';

export type EditServesProps = { readonly serves: Serves };

function InternalEditServes({
  serves,
  events,
}: EmittingComponentProps<EditServesProps>) {
  const { _ } = useLingui();

  const onChange = useCallback(function (_1: Event, value: number | readonly number[]) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
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

export const EditServes = toReactiveComponent(InternalEditServes);
