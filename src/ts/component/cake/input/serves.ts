import { createAdaptorComponent } from 'base/component/adaptor';
import type { Observer } from 'rxjs';

import { CakeInputServesAdaptor } from './serves/adaptor';
import type { CakeInputServesProps } from './serves/component';
import { CakeInputServes as CakeInputServesImpl } from './serves/component';
import type { CakeInputProps } from './types';

export const CakeInputServes = createAdaptorComponent<CakeInputServesProps, CakeInputProps>(
  CakeInputServesImpl,
  (targetEvents: Observer<CakeInputProps>) => new CakeInputServesAdaptor(targetEvents),
);
