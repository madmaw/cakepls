import { adaptReactiveComponent } from 'base/component/reactive';
import { map } from 'rxjs';

import type { EditCakeProps } from './edit';
import {
  EditIcingType,
  type EditIcingTypeProps,
} from './icing/type/edit';

export const EditIcingTypeInCake = adaptReactiveComponent<EditCakeProps, EditIcingTypeProps>(
  EditIcingType,
  map(function ({ cake: { icing: { type: value } } }: EditCakeProps) {
    return {
      value,
    };
  }),
  map(function ([{ value }, { cake }]) {
    return ({
      cake: {
        ...cake,
        icing: {
          type: value,
        },
      },
    });
  }),
);
