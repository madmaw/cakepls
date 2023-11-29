import { Stack } from '@mui/material';
import type { ReactiveComponentProps } from 'base/component/reactive';
import { type CakeBase } from 'domain/model';

import { EditCakeBaseSubtypeInCakeBase } from './edit_subtype';
import { EditCakeBaseTypeInCakeBase } from './edit_type';

export type EditCakeBaseProps = {
  readonly base: CakeBase,
};

export function EditCakeBase(props: ReactiveComponentProps<EditCakeBaseProps>) {
  return (
    <Stack
      direction="column"
      spacing={1}
    >
      <EditCakeBaseTypeInCakeBase {...props}/>
      <EditCakeBaseSubtypeInCakeBase {...props}/>
    </Stack>
  );
}
