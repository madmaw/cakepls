import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import {
  CssBaseline,
  ThemeProvider
} from '@mui/material';
import { App } from 'app';
import { checkExists } from 'base/preconditions';
import { Fragment } from 'react';
import { createRoot } from 'react-dom/client';
import { getDesignTokens } from 'ui/theme';

window.addEventListener('load', function () {
  const elementId = 'app';
  const appNode = document.getElementById(elementId);
  const app = createRoot(checkExists(appNode, 'element with id "{0}" not found', elementId));
  const theme = getDesignTokens('light');

  // TODO
  //i18n.load('en', messages);
  i18n.activate('en');

  app.render(
    <Fragment>
      <CssBaseline/>
      <ThemeProvider theme={theme}>
        <I18nProvider i18n={i18n}>
          <App/>
        </I18nProvider>
      </ThemeProvider>
    </Fragment>
  );
});
