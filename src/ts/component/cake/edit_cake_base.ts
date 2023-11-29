import { adaptReactiveComponent } from 'base/component/reactive';
import { map } from 'rxjs';

import {
  EditCakeBase,
  type EditCakeBaseProps,
} from './cake_base/edit';
import type { EditCakeProps } from './edit';

export const EditCakeBaseInCake = adaptReactiveComponent<EditCakeProps, EditCakeBaseProps>(
  EditCakeBase,
  map(function ({ cake: { base } }: EditCakeProps) {
    return { base };
  }),
  map(function ([{ base }, { cake }]) {
    return ({
      cake: {
        ...cake,
        base,
      },
    });
  }),
);
