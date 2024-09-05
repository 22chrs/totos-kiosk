import { colors } from '@/theme/colors';
import { modalTheme } from '@/theme/modal';
import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { fonts, fontSizes, letterSpacings } from './fontStyle';

import { keyframes } from '@emotion/react';

const moveGradient = keyframes`
  50% {
    background-position: 100% 50%;
  }
`;

const styles = {
  global: (props) => ({
    body: {
      fontWeight: '400',
      fontSize: 'md',
      bg: mode('pageBGColor.lightMode', 'pageBGColor.darkMode')(props),
      userSelect: 'none',
    },
    ':focus, :focus-visible, *[data-focus]': {
      outline: 'none !important',
      boxShadow: 'none !important',
      // background: 'transparent!important',
      //border: 'none !important',
    },
    // You can remove the following rules as they are now redundant with the new rule above
    // '*:focus': {
    //   outline: 'none !important',
    //   boxShadow: 'none !important',
    // },
    // '*:focus-visible': {
    //   outline: 'none !important',
    //   boxShadow: 'none !important',
    // },
    // '*:focus-within': {
    //   outline: 'none !important',
    //   boxShadow: 'none !important',
    // },
  }),
};

const breakpoints = {
  sm: '30em',
  md: '40em',
  lg: '80em',
  xl: '96em',
  '2xl': '96em',
};

const components = {
  Modal: modalTheme,

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
          colors.primaryHeadingColor.darkMode,
        )(props),
        size: 'md',
        pt: '9',
        pb: '6',
        fontWeight: '700',
        px: '0px',
        h: '0px',
        variant: 'ghost',
      }),

      kiosk: (props) => ({
        bg: props.colorMode === 'dark' ? 'purple.300' : 'pink.400',
        color: props.colorMode === 'dark' ? 'white' : 'white',
        _hover: {
          bg: props.colorMode === 'dark' ? 'purple.200' : 'purple.200',
        },
        _active: {
          bg: props.colorMode === 'dark' ? 'purple.400' : 'purple.800',
        },
      }),

      kiosk_pricetag_mini: (props) => {
        const borderWidth = '0.3rem';

        return {
          color: mode(
            colors.primaryHeadingColor.lightMode,
            colors.primaryHeadingColor.darkMode,
          )(props),

          bgColor: mode(
            colors.footerBGColor.lightMode,
            colors.footerBGColor.darkMode,
          )(props),

          borderColor: mode(
            colors.primaryHeadingColor.lightMode,
            colors.primaryHeadingColor.darkMode,
          )(props),

          borderWidth: borderWidth,

          fontSize: '3xl',
          fontWeight: '700',

          px: '5',
          py: '5',
          h: '0px',
          variant: 'outline',

          position: 'relative',

          borderRadius: 'md',
        };
      },

      kiosk_pricetag_small: (props) => {
        const borderWidth = '0.2rem';

        return {
          color: mode(
            colors.primaryHeadingColor.lightMode,
            colors.primaryHeadingColor.darkMode,
          )(props),

          bgColor: mode(
            colors.footerBGColor.lightMode,
            colors.footerBGColor.darkMode,
          )(props),

          borderColor: mode(
            colors.primaryHeadingColor.lightMode,
            colors.primaryHeadingColor.darkMode,
          )(props),

          borderWidth: borderWidth,

          fontSize: '1.8rem',
          fontWeight: '700',

          px: '2',
          py: '6',
          h: '0px',
          variant: 'outline',

          position: 'relative',

          borderRadius: 'md',
        };
      },

      kiosk_nametag: (props) => {
        const borderWidth = '0.2rem';

        return {
          color: mode(
            colors.primaryHeadingColor.darkMode,
            colors.primaryHeadingColor.lightMode,
          )(props),

          bgColor: mode(
            colors.footerBGColor.darkMode,
            colors.footerBGColor.lightMode,
          )(props),

          borderColor: mode(
            colors.primaryHeadingColor.lightMode,
            colors.primaryHeadingColor.darkMode,
          )(props),

          //borderWidth: borderWidth,

          fontSize: '1.8rem',
          fontWeight: '700',

          px: '2',
          py: '6',
          h: '0px',
          variant: 'outline',

          position: 'relative',

          borderRadius: 'md',
        };
      },

      kiosk_categoryTagSelected: (props) => {
        const borderWidth = '0.2rem';

        return {
          color: mode(
            colors.primaryHeadingColor.darkMode,
            colors.primaryHeadingColor.lightMode,
          )(props),

          bgColor: mode(
            colors.footerBGColor.darkMode,
            colors.footerBGColor.lightMode,
          )(props),

          borderColor: mode(
            colors.primaryHeadingColor.darkMode,
            colors.primaryHeadingColor.lightMode,
          )(props),

          //borderWidth: borderWidth,

          fontSize: '3.09rem',
          fontWeight: '700',

          px: '2',
          py: '8',
          h: '0px',
          variant: 'outline',

          position: 'relative',

          borderRadius: 'md',
        };
      },

      kiosk_categoryTagAselected: (props) => {
        const borderWidth = '0.2rem';

        return {
          color: mode(
            colors.primaryHeadingColor.lightMode,
            colors.primaryHeadingColor.darkMode,
          )(props),

          bgColor: mode(
            colors.footerBGColor.lightMode,
            colors.footerBGColor.darkMode,
          )(props),

          borderColor: mode(
            colors.primaryHeadingColor.lightMode,
            colors.primaryHeadingColor.darkMode,
          )(props),

          //borderWidth: borderWidth,

          fontSize: '2.9rem',
          fontWeight: '700',

          px: '2',
          py: '8',
          h: '0px',
          variant: 'outline',

          position: 'relative',

          borderRadius: 'md',
        };
      },

      kiosk_pricetag_medium: (props) => {
        const borderWidth = '0.3rem';

        return {
          color: mode(
            colors.primaryHeadingColor.lightMode,
            colors.primaryHeadingColor.darkMode,
          )(props),

          bgColor: mode(
            colors.footerBGColor.lightMode,
            colors.footerBGColor.darkMode,
          )(props),

          borderColor: mode(
            colors.primaryHeadingColor.lightMode,
            colors.primaryHeadingColor.darkMode,
          )(props),

          borderWidth: borderWidth,

          fontSize: '3xl',
          fontWeight: '700',

          px: '6',
          py: '6',
          h: '0',
          variant: 'outline',

          position: 'relative',

          borderRadius: 'lg',
        };
      },

      kiosk_pricetag_big: (props) => {
        const borderWidth = '0.4rem';

        return {
          color: mode(
            colors.primaryHeadingColor.lightMode,
            colors.primaryHeadingColor.darkMode,
          )(props),

          // bgColor: mode(
          //   colors.footerBGColor.lightMode,
          //   colors.footerBGColor.darkMode
          // )(props),

          borderColor: mode(
            colors.primaryHeadingColor.lightMode,
            colors.primaryHeadingColor.darkMode,
          )(props),

          borderWidth: borderWidth,

          as: 'h1',
          fontSize: '4xl',
          fontWeight: '700',

          px: '6',

          bgColor: mode(
            colors.footerBGColor.lightMode,
            colors.footerBGColor.darkMode,
          )(props),
          py: '9',
          h: '0',
          variant: 'outline',

          position: 'relative',

          borderRadius: 'xl',
        };
      },

      kiosk_rainbow_medium: (props) => {
        const borderWidth = '0.3rem';

        return {
          color: mode(
            colors.primaryHeadingColor.lightMode,
            colors.primaryHeadingColor.darkMode,
          )(props),

          bgColor: mode(
            colors.footerBGColor.lightMode,
            colors.footerBGColor.darkMode,
          )(props),

          fontSize: '2xl',
          fontWeight: '700',
          px: '4',
          py: '6',
          h: '0px',
          variant: 'ghost',

          position: 'relative',

          borderRadius: borderWidth,

          '&::after': {
            content: '""',
            position: 'absolute',
            top: `calc(-1 * ${borderWidth})`,
            left: `calc(-1 * ${borderWidth})`,
            zIndex: -1,
            width: `calc(100% + ${borderWidth} * 2)`,
            height: `calc(100% + ${borderWidth} * 2)`,
            background: `linear-gradient(60deg, hsl(224, 85%, 66%), hsl(269, 85%, 66%), hsl(314, 85%, 66%), hsl(359, 85%, 66%), hsl(44, 85%, 66%), hsl(89, 85%, 66%), hsl(134, 85%, 66%), hsl(179, 85%, 66%))`,
            backgroundSize: '300% 300%',
            backgroundPosition: '0 50%',
            borderRadius: `calc(2 * ${borderWidth})`,
            animation: `${moveGradient} 4s alternate infinite`,
          },
        };
      },

      kiosk_rainbow_big: (props) => {
        const borderWidth = '0.4rem';

        return {
          color: mode(
            colors.primaryHeadingColor.lightMode,
            colors.primaryHeadingColor.darkMode,
          )(props),

          bgColor: mode(
            colors.footerBGColor.lightMode,
            colors.footerBGColor.darkMode,
          )(props),

          as: 'h1',
          fontSize: '3xl',
          fontWeight: '700',

          px: '6',
          py: '9',
          h: '0',
          variant: 'ghost',

          position: 'relative',

          borderRadius: borderWidth,

          '&::after': {
            content: '""',
            position: 'absolute',
            top: `calc(-1 * ${borderWidth})`,
            left: `calc(-1 * ${borderWidth})`,
            zIndex: -1,
            width: `calc(100% + ${borderWidth} * 2)`,
            height: `calc(100% + ${borderWidth} * 2)`,
            background: `linear-gradient(60deg, hsl(224, 85%, 66%), hsl(269, 85%, 66%), hsl(314, 85%, 66%), hsl(359, 85%, 66%), hsl(44, 85%, 66%), hsl(89, 85%, 66%), hsl(134, 85%, 66%), hsl(179, 85%, 66%))`,
            backgroundSize: '300% 300%',
            backgroundPosition: '0 50%',
            borderRadius: `calc(2 * ${borderWidth})`,
            animation: `${moveGradient} 4s alternate infinite`,
          },
        };
      },
    },
  },

  Progress: {
    baseStyle: (props) => ({
      track: {
        bg:
          props.colorMode === 'light'
            ? colors.pageBGColor.lightMode
            : colors.pageBGColor.darkMode,
      },
    }),
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
        colors.primaryHeadingColor.darkMode,
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
          colors.primaryHeadingColor.darkMode,
        )(props),
      }),
      h1: (props) => ({
        as: 'h1',
        fontSize: '6xl',
        fontWeight: '700',
        //mb: '2',
        color: mode(
          colors.primaryHeadingColor.lightMode,
          colors.primaryHeadingColor.darkMode,
        )(props),
      }),
      h2: (props) => ({
        as: 'h2',
        fontSize: '4xl',
        fontWeight: '700',
        mt: '13',
        mb: '5',
        color: mode(
          colors.primaryHeadingColor.lightMode,
          colors.primaryHeadingColor.darkMode,
        )(props),
      }),
      h3: (props) => ({
        as: 'h3',
        fontSize: '2xl',
        fontWeight: '700',
        mt: '6',
        mb: '3',
        color: mode(
          colors.primaryHeadingColor.lightMode,
          colors.primaryHeadingColor.darkMode,
        )(props),
      }),
      footerH1: (props) => ({
        color: mode(
          colors.footerFontColor.lightMode,
          colors.footerFontColor.darkMode,
        )(props),
        as: 'h2',
        fontSize: 'lg',
        lineHeight: '250%',
        fontWeight: '700',
      }),
      h1_Kiosk: (props) => ({
        as: 'h1',
        fontSize: '5xl',
        fontWeight: '700',
        //mb: '2',
        color: mode(
          colors.primaryHeadingColor.lightMode,
          colors.primaryHeadingColor.darkMode,
        )(props),
      }),
      h2_Kiosk: (props) => ({
        as: 'h2',
        fontSize: '4xl',
        fontWeight: '700',
        //mb: '2',
        color: mode(
          colors.primaryHeadingColor.lightMode,
          colors.primaryHeadingColor.darkMode,
        )(props),
      }),
      h3_Kiosk: (props) => ({
        as: 'h3',
        fontSize: '3xl',
        fontWeight: '700',
        //mb: '2',
        color: mode(
          colors.primaryHeadingColor.lightMode,
          colors.primaryHeadingColor.darkMode,
        )(props),
      }),

      footerH2: (props) => ({
        as: 'h3',
        fontSize: 'md',
        lineHeight: '250%',
        fontWeight: '700',
        color: mode(
          colors.footerFontColor.lightMode,
          colors.footerFontColor.darkMode,
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
        colors.primaryFontColor.darkMode,
      )(props),
    }),
    variants: {
      // used as <Text variant="secondary">
      footer: (props) => ({
        pt: '0',
        color: mode(
          colors.footerFontColor.lightMode,
          colors.footerFontColor.darkMode,
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
          colors.footerFontColor.darkMode,
        )(props),
        color: mode(
          colors.footerBGColor.lightMode,
          colors.footerBGColor.darkMode,
        )(props),
        _hover: {
          bgColor: mode(
            colors.primaryHeadingColor.lightMode,
            colors.primaryHeadingColor.darkMode,
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
          colors.footerFontColor.darkMode,
        )(props),
      }),
      logo: (props) => ({
        fontSize: '2xl',
        px: '3',
        rounded: '.2em',
        fontWeight: '700',
        bgColor: mode(
          colors.primaryHeadingColor.lightMode,
          colors.primaryHeadingColor.darkMode,
        )(props),
        color: mode(
          colors.primaryHeadingColor.darkMode,
          colors.primaryHeadingColor.lightMode,
        )(props),
        _hover: {
          bgColor: mode(
            colors.footerFontColor.darkMode,
            colors.footerFontColor.lightMode,
          )(props),
        },
      }),
      kiosk: () => ({
        fontSize: '1.7rem',
        fontWeight: '400',
        lineHeight: '1.5',
        letterSpacing: '0.02rem',
      }),
    },
  },
};

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
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
  11: '2.75rem',
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

export const theme = extendTheme({
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
