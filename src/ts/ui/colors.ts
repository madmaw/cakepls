import type { PaletteOptions } from '@mui/material';
import {
  green,
  red,
} from '@mui/material/colors';

type ModalPaletteOptions = Omit<PaletteOptions, 'mode'>;

export const lightPalette: ModalPaletteOptions = { primary: red };

export const darkPalette: PaletteOptions = { primary: green };
