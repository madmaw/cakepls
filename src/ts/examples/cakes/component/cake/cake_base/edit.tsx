import { Stack } from '@mui/material';
import type { ReactiveComponent } from 'base/component/reactive';
import {
  adaptReactiveComponent,
  type ReactiveComponentProps,
  useReactiveProps,
} from 'base/component/reactive';
import { UnreachableError } from 'base/errors';
import type { ButterCakeBase } from 'examples/cakes/domain/model';
import {
  ButterCakeBaseType,
  type CakeBase,
  CakeBaseType,
  CarrotCakeBaseType,
  ChocolateCakeBaseType,
  SpongeCakeBaseType,
  WhiteCakeBaseType,
} from 'examples/cakes/domain/model';
import { useMemo } from 'react';
import type { Observable } from 'rxjs';
import {
  filter,
  map,
} from 'rxjs';

import type { EditCakeBaseSubtypeProps } from './subtype/edit';
import { EditButterCakeBaseSubtype } from './subtype/edit';
import type { EditCakeBaseTypeProps } from './type/edit';
import { EditCakeBaseType } from './type/edit';

export type EditCakeBaseProps = {
  readonly base: CakeBase,
};

//
// type
//

function defaultCakeBase(type: CakeBaseType): CakeBase {
  switch (type) {
    case CakeBaseType.Butter:
      return {
        type,
        subtype: ButterCakeBaseType.Yellow,
      };
    case CakeBaseType.Carrot:
      return {
        type,
        subtype: CarrotCakeBaseType.Traditional,
      };
    case CakeBaseType.Chocolate:
      return {
        type,
        subtype: ChocolateCakeBaseType.Traditional,
      };
    case CakeBaseType.RedVelvet:
    case CakeBaseType.Coffee:
      return {
        type,
      };
    case CakeBaseType.Sponge:
      return {
        type,
        subtype: SpongeCakeBaseType.Traditional,
      };
    case CakeBaseType.White:
      return {
        type,
        subtype: WhiteCakeBaseType.Traditional,
      };
    default:
      throw new UnreachableError(type);
  }
}

const EditCakeBaseTypeInCakeBase = adaptReactiveComponent<
  EditCakeBaseProps,
  EditCakeBaseTypeProps,
  EditCakeBaseProps,
  EditCakeBaseTypeProps
>(
  EditCakeBaseType,
  map(function ([{ base: { type: value } }]) {
    return {
      value,
    };
  }),
  map(function ([{ value }, props]) {
    return {
      ...props,
      base: defaultCakeBase(value),
    };
  }),
);

//
// subtype
//

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
  return adaptReactiveComponent<
    EditCakeBaseSubtypeInCakeBaseProps<T, S>,
    EditCakeBaseSubtypeProps<S>,
    EditCakeBaseSubtypeInCakeBaseProps<T, S>,
    EditCakeBaseSubtypeProps<S>
  >(
    Component,
    map(function ([{ base: { subtype } }]) {
      return {
        value: subtype,
      };
    }),
    map(function ([{ value }]) {
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
  const filteredProps = useMemo(function () {
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

//
// edit
//

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
