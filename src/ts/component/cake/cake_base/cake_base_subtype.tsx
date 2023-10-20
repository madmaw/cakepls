import {
  AbstractSynchronousComponentAdaptor,
  createAdaptorComponent
} from 'base/component/adaptor';
import type { ButterCakeBaseType } from 'domain/model';
import { CakeBaseType } from 'domain/model';
import type { Observer } from 'rxjs';

import {
  SelectButterCakeBaseSubtype,
  type SelectCakeBaseSubtypeProps
} from './subtype/component';

export type CakeBaseSelectCakeBaseSubtypeProps<T extends CakeBaseType, S extends number> = {
  readonly base: {
    readonly type: T,
    readonly subtype: S,
  }
};

class CakeBaseSelectCakeBaseSubtypeAdaptor<T extends CakeBaseType, S extends number> extends AbstractSynchronousComponentAdaptor<
  SelectCakeBaseSubtypeProps<S>,
  CakeBaseSelectCakeBaseSubtypeProps<T, S>
> {
  constructor(
    targetEvents: Observer<CakeBaseSelectCakeBaseSubtypeProps<T, S>>,
    private readonly type: T,
  ) {
    super(targetEvents);
  }

  override transformSourceEvent(
    { value }: SelectCakeBaseSubtypeProps<S>,
  ): CakeBaseSelectCakeBaseSubtypeProps<T, S> {
    return {
      base: {
        type: this.type,
        subtype: value,
      },
    };
  }

  override extractSourceProps(
    { base: { subtype } }: CakeBaseSelectCakeBaseSubtypeProps<T, S>,
  ): SelectCakeBaseSubtypeProps<S> {
    return {
      value: subtype,
    };
  }
}

export const CakeInputSelectButterCakeBaseSubtype = createAdaptorComponent(
  SelectButterCakeBaseSubtype,
  function (targetEvents: Observer<CakeBaseSelectCakeBaseSubtypeProps<CakeBaseType.Butter, ButterCakeBaseType>>) {
    return new CakeBaseSelectCakeBaseSubtypeAdaptor(targetEvents, CakeBaseType.Butter);
  },
);
