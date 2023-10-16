import { createComponentAdaptor } from 'base/component/adaptor';
import type { Observer } from 'rxjs';

import type { CakeInputServesProps } from './serves/component';
import { CakeInputServes as CakeInputServesImpl } from './serves/component';
import { CakeInputServesTransformer } from './serves/transformer';
import type { CakeInputProps } from './types';

export const CakeInputServes = createComponentAdaptor<CakeInputServesProps, CakeInputProps>(
  CakeInputServesImpl,
  (targetEvents: Observer<CakeInputProps>) => new CakeInputServesTransformer(targetEvents),
);
