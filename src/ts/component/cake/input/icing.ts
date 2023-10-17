import { createAdaptorComponent } from 'base/component/adaptor';
import type { Observer } from 'rxjs';

import { CakeInputIcingAdaptor } from './icing/adaptor';
import type { CakeInputIcingProps } from './icing/component';
import { CakeInputIcing as CakeInputIcingImpl } from './icing/component';
import type { CakeInputProps } from './types';

export const CakeInputIcing = createAdaptorComponent<CakeInputIcingProps, CakeInputProps>(
  CakeInputIcingImpl,
  (targetEvents: Observer<CakeInputProps>) => new CakeInputIcingAdaptor(targetEvents),
);
