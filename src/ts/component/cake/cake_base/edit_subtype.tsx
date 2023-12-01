import type {
  ReactiveComponent,
  ReactiveComponentProps,
} from 'base/component/reactive';
import {
  adaptReactiveComponent,
  useReactiveProps,
} from 'base/component/reactive';
import { UnreachableError } from 'base/errors';
import type {
  ButterCakeBase,
  CakeBase,
} from 'domain/model';
import { CakeBaseType } from 'domain/model';
import { useMemo } from 'react';
import type { Observable } from 'rxjs';
import {
  filter,
  map,
} from 'rxjs';

import type { EditCakeBaseSubtypeProps } from './subtype/edit';
import { EditButterCakeBaseSubtype } from './subtype/edit';

type EditCakeBaseSubtypeInCakeBaseProps<T extends CakeBaseType, S extends number> = {
  readonly base: {
    readonly type: T,
    readonly subtype: S,
  }
};

function createEditCakeBaseSubtypeInCakeBaseComponent<T extends CakeBaseType, S extends number>(
    Component: ReactiveComponent<EditCakeBaseSubtypeProps<S>>,
    type: T,
) {
  return adaptReactiveComponent<EditCakeBaseSubtypeInCakeBaseProps<T, S>, EditCakeBaseSubtypeProps<S>> (
    Component,
    map(function ({ base: { subtype } }: EditCakeBaseSubtypeInCakeBaseProps<T, S>) {
      return {
        value: subtype,
      };
    }),
    map(function ([{ value }]: readonly [EditCakeBaseSubtypeProps<S>, EditCakeBaseSubtypeInCakeBaseProps<T, S>]) {
      return {
        base: {
          type,
          subtype: value,
        },
      };
    }),
  );
}

const EditButterCakeBaseSubtypeInCakeBase = createEditCakeBaseSubtypeInCakeBaseComponent(
  EditButterCakeBaseSubtype,
  CakeBaseType.Butter,
);

export function EditCakeBaseSubtypeInCakeBase({
  props,
  events,
}: ReactiveComponentProps<{
  readonly base: CakeBase,
}>) {
  // TODO this pattern feels suboptimal
  const baseType = useReactiveProps(props)?.base.type;
  const filteredProps = useMemo(function() {
    return props.pipe(filter(function ({ base: { type } }) {
      return type === baseType;
    }));
  }, [baseType, props]);

  switch (baseType) {
    case undefined:
      return null;
    case CakeBaseType.Butter:
    {
      return (
        <EditButterCakeBaseSubtypeInCakeBase
          // TODO remove cast somehow
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          props={filteredProps as Observable<{ readonly base: ButterCakeBase }>}
          events={events}
        />
      );
    }
    case CakeBaseType.Carrot:
    case CakeBaseType.Chocolate:
    case CakeBaseType.Coffee:
    case CakeBaseType.RedVelvet:
    case CakeBaseType.Sponge:
    case CakeBaseType.White:
      // TODO: implement
      return null;
    default:
      throw new UnreachableError(baseType);
  }
}
