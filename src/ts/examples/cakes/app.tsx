import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import {
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from '@mui/material';
import { useRefExpression } from 'base/component/constant';
import { createStatefulComponent } from 'base/component/stateful';
import type { Cake } from 'examples/cakes/domain/model';
import {
  CakeBaseType,
  ChocolateCakeBaseType,
  IcingType,
} from 'examples/cakes/domain/model';
import {
  CakeBuilder as CakeBuilderImpl,
  Display,
} from 'examples/cakes/page/builder/component';
import {
  Fragment,
  useEffect,
  useMemo,
} from 'react';

import { getDesignTokens } from './ui/theme';

export function App() {

  const theme = useRefExpression(function () {
    return getDesignTokens('light');
  });

  // TODO
  //i18n.load('en', messages);
  useEffect(function () {
    i18n.activate('en');
  });

  const CakeBuilder = useMemo(function () {
    return createStatefulComponent<
      {
        readonly cake: Cake,
      },
      {
        readonly display: Display,
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

  const comfortable = useMediaQuery(theme.breakpoints.up('md'));
  const display = useMemo(function () {
    return comfortable
      ? Display.Comfortable
      : Display.Compact;
  }, [comfortable]);

  return (
    <Fragment>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <I18nProvider i18n={i18n}>
          <CakeBuilder display={display}/>
        </I18nProvider>
      </ThemeProvider>
    </Fragment>
  );
}
