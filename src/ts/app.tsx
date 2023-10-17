import {
  useMediaQuery,
  useTheme
} from '@mui/material';
import { createStatefulComponent } from 'base/component/stateful';
import { Display } from 'base/display';
import type { Cake } from 'domain/model';
import {
  CakeBaseType,
  ChocolateCakeBaseType,
  IcingType
} from 'domain/model';
import { CakeBuilder as CakeBuilderImpl } from 'page/builder/component';
import { useMemo } from 'react';

export function App() {
  const CakeBuilder = useMemo(function () {
    return createStatefulComponent<
      {
        readonly cake: Cake,
      },
      {
        readonly display: Display,
        readonly events?: never,
      }
    > (
      CakeBuilderImpl,
      {
        cake: {
          base: {
            type: CakeBaseType.Chocolate,
            subtype: ChocolateCakeBaseType.Traditional,
          },
          additionalIngredients: [],
          decorations: [],
          icing: { type: IcingType.None },
          serves: 4,
          toppings: [],
        },
      },
    );
  }, []);

  const theme = useTheme();
  const comfortable = useMediaQuery(theme.breakpoints.up('md'));
  const display = useMemo(function () {
    return  comfortable
      ? Display.Comfortable
      : Display.Compact;
  }, [comfortable]);

  return <CakeBuilder display={display}/>;
}
