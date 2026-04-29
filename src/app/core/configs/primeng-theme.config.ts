import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const defaultPreset = definePreset(Aura, {
  semantic: {
    primary: {
      500: 'var(--blue-500)',
      600: 'var(--blue-600)',
      700: 'var(--blue-700)',
      contrastColor: 'var(--color-white-0)',
    },

    colorScheme: {
      light: {
        surface: {
          0: 'var(--surface-0)',
          50: 'var(--surface-50)',
          100: 'var(--surface-100)',
          200: 'var(--surface-200)',
        },

        formField: {
          border: 'var(--surface-100)',
          hoverBorderColor: 'var(--blue-500)',
          focusBorderColor: 'var(--blue-500)',
        },
      },
    },
  },

  components: {
    button: {
      colorScheme: {
        light: {
          outlined: {
            primary: {
              color: '{primary.500}',
              borderColor: '{primary.500}',
              hoverBackground: '{surface.50}',
              activeBackground: '{surface.100}',
            },
          },
        },
        dark: {
          outlined: {
            primary: {
              color: '{primary.500}',
              borderColor: '{primary.500}',
            },
          },
        },
      },
    },
  },
});
