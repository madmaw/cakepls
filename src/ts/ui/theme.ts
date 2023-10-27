import type { PaletteMode } from '@mui/material';
import { createTheme } from '@mui/material';

import {
  darkPalette,
  lightPalette,
} from './colors';

export const gridBaseline = 8;

export function getDesignTokens(mode: PaletteMode) {
  return createTheme({
    components: { MuiButtonBase: { defaultProps: { disableRipple: true } } },
    palette: {
      mode,
      ...(mode === 'light' ? lightPalette : darkPalette),
    },
  });
}
