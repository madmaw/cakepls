import { adaptReactiveComponent } from 'base/component/reactive';
import { map } from 'rxjs';

import type { EditCakeProps } from './edit';
import {
  EditServes,
  type EditServesProps,
} from './serves/edit';

export const EditServesInCake = adaptReactiveComponent<EditCakeProps, EditServesProps>(
  EditServes,
  map(function ({ cake: { serves } }: EditCakeProps) {
    return { serves };
  }),
  map(function ([{ serves }, { cake }]) {
    return {
      cake: {
        ...cake,
        serves,
      },
    };
  }),
);
