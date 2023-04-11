import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { fonts, fontSizes, letterSpacings } from './fontStyle';

const styles = {
  global: (props) => ({
    body: {
      fontWeight: '400',
      fontSize: 'md',

      bg: mode('pageBGColor.lightMode', 'pageBGColor.darkMode')(props),
    },
  }),
};

const breakpoints = {
  sm: '30em',
  md: '40em',
  lg: '80em',
  xl: '96em',
  '2xl': '96em',
};

const colors = {
  brand: {
    50: '#f6e8ff',
    100: '#e3bdff',
    200: '#cd94ff',
    300: '#b46ef7',
    400: '#9a4ce7',
    500: '#7e31ce',
    600: '#641eab',
    700: '#4b1483',
    800: '#341158',
    900: '#1e0d2d',
  },

  pageBGColor: {
    lightMode: '#fff',
    darkMode: '#2d3142',
  },

  brandColor: {
    lightMode: '#641eab',
    darkMode: '#cd94ff',
  },

  brandBGColorHover: {
    lightMode: '#f6e8ff',
    darkMode: 'transparent',
  },

  primaryHeadingColor: {
    lightMode: '#2D3748',
    darkMode: '#F7FAFC',
  },

  primaryFontColor: {
    lightMode: 'black',
    darkMode: 'white',
  },

  footerFontColor: {
    lightMode: '#807a77',
    darkMode: '#8495b3',
  },

  footerBGColor: {
    lightMode: '#f5f2ed',
    darkMode: '#171923',
  },

  formFontColor: {
    lightMode: 'black',
    darkMode: 'black',
  },

  formBGColor: {
    lightMode: 'white',
    darkMode: '#F7FAFC',
  },

  formBorderColor: {
    lightMode: '#2D3748',
    darkMode: '#2D3748',
  },

  buttonNachtmodus: {
    200: '#3d4259', // BG Tagmodus aktivieren
    300: '#4c5370', // hover BG Tagmodus aktivieren
    400: 'transparent', // click Nacht -> Tag
    500: '#e3e3e3', // BG Nachtmodus aktivieren
    600: '#cccccc', // hover BG Nachtmodus aktivieren
    700: 'transparent', // click Tag -> Nacht
  },
};

const components = {
  Inputfield: {
    colorScheme: 'red',
    _placeholder: { color: 'red.500' },
  },

  Button: {
    baseStyle: (props) => ({
      lineHeight: '1.8',
      letterSpacing: '0.02rem',
    }),
    variants: {
      text: (props) => ({
        color: mode(
          colors.primaryHeadingColor.lightMode,
          colors.primaryHeadingColor.darkMode
        )(props),
        size: 'md',
        pt: '9',
        pb: '6',
        fontWeight: '700',
        px: '0px',
        h: '0px',
        variant: 'ghost',
      }),
    },
  },
  MenuButton: {
    variants: {
      MenuButton: (props) => ({
        rounded: 'full',
        bgColor: 'transparent',
      }),
    },
  },
  MenuItem: {
    variants: {
      MenuList: { justifyContent: 'flex-start', fontWeight: '700' },
    },
  },

  Heading: {
    baseStyle: (props) => ({
      color: mode(
        colors.primaryHeadingColor.lightMode,
        colors.primaryHeadingColor.darkMode
      )(props),
      letterSpacing: '0.1rem',
    }),
    variants: {
      logo: (props) => ({
        as: 'h1',
        className: 'logo',
        fontSize: '7xl',
        lineHeight: '1.1',
        fontWeight: '700',
        color: mode(
          colors.primaryHeadingColor.lightMode,
          colors.primaryHeadingColor.darkMode
        )(props),
      }),
      h1: (props) => ({
        as: 'h1',
        fontSize: '5xl',
        fontWeight: '700',
        //mb: '2',
        color: mode(
          colors.primaryHeadingColor.lightMode,
          colors.primaryHeadingColor.darkMode
        )(props),
      }),
      h2: (props) => ({
        as: 'h2',
        fontSize: 'xl',
        fontWeight: '700',
        mt: '13',
        mb: '5',
        color: mode(
          colors.primaryHeadingColor.lightMode,
          colors.primaryHeadingColor.darkMode
        )(props),
      }),
      h3: (props) => ({
        as: 'h3',
        fontSize: 'lg',
        fontWeight: '700',
        mt: '6',
        mb: '3',
        color: mode(
          colors.primaryHeadingColor.lightMode,
          colors.primaryHeadingColor.darkMode
        )(props),
      }),
      footerH1: (props) => ({
        color: mode(
          colors.footerFontColor.lightMode,
          colors.footerFontColor.darkMode
        )(props),
        as: 'h2',
        fontSize: 'lg',
        lineHeight: '250%',
        fontWeight: '700',
      }),

      footerH2: (props) => ({
        as: 'h3',
        fontSize: 'md',
        lineHeight: '250%',
        fontWeight: '700',
        color: mode(
          colors.footerFontColor.lightMode,
          colors.footerFontColor.darkMode
        )(props),
      }),
    },
  },

  Text: {
    baseStyle: (props) => ({
      lineHeight: '1.8',
      letterSpacing: '0.02rem',
      pt: '2',
      color: mode(
        colors.primaryFontColor.lightMode,
        colors.primaryFontColor.darkMode
      )(props),
    }),
    variants: {
      // used as <Text variant="secondary">
      footer: (props) => ({
        pt: '0',
        color: mode(
          colors.footerFontColor.lightMode,
          colors.footerFontColor.darkMode
        )(props),

        sx: {
          '.myItem:hover &': {
            textDecoration: 'underline',
            textDecorationThickness: '1.15rem',
            textUnderlineOffset: '1.2rem',
          },
        },
      }),
      logoFooter: (props) => ({
        fontSize: '2xl',
        px: '3',
        rounded: '.2em',
        fontWeight: '700',
        bgColor: mode(
          colors.footerFontColor.lightMode,
          colors.footerFontColor.darkMode
        )(props),
        color: mode(
          colors.footerBGColor.lightMode,
          colors.footerBGColor.darkMode
        )(props),
        _hover: {
          bgColor: mode(
            colors.primaryHeadingColor.lightMode,
            colors.primaryHeadingColor.darkMode
          )(props),
        },
      }),
      footerHeading: (props) => ({
        pt: '0',
        fontSize: 'xl',
        px: '0',
        rounded: '.2em',
        fontWeight: '700',
        color: mode(
          colors.footerFontColor.lightMode,
          colors.footerFontColor.darkMode
        )(props),
      }),
      logo: (props) => ({
        fontSize: '2xl',
        px: '3',
        rounded: '.2em',
        fontWeight: '700',
        bgColor: mode(
          colors.primaryHeadingColor.lightMode,
          colors.primaryHeadingColor.darkMode
        )(props),
        color: mode(
          colors.primaryHeadingColor.darkMode,
          colors.primaryHeadingColor.lightMode
        )(props),
        _hover: {
          bgColor: mode(
            colors.footerFontColor.darkMode,
            colors.footerFontColor.lightMode
          )(props),
        },
      }),
    },
  },
};

const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
};

const space = {
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  12: '3rem',
  13: '3.25rem',
  14: '3.5rem',
  15: '3.75rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  25: '6.2rem',
  28: '7rem',
  30: '7.5rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
  100: '30rem',
};

const borderRadius = {
  radii: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
};

const theme = extendTheme({
  breakpoints,
  fonts,
  space,
  borderRadius,
  fontSizes,
  //lineHeights,
  letterSpacings,
  config,
  styles,
  colors: colors,
  components,
});
export default theme;
