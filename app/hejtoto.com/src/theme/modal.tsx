import { colors } from '@/theme/colors';
import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  // define the part you're going to style
  overlay: {
    //bg: 'blackAlpha.200', //change the background
  },
  dialog: {
    //borderRadius: 'md',
    //bg: `purple.100`,
  },
});

const toto = definePartsStyle({
  dialog: {
    //autoFocus: 'false',
    border: '2px',
    borderRadius: '0',
    pt: '5',
    pb: '10',
    px: '0',

    // Let's also provide dark mode alternatives
    _dark: {
      borderColor: colors.primaryFontColor.darkMode,
      bgColor: colors.footerBGColor.darkMode,

      color: colors.primaryFontColor.darkMode,
    },
    _light: {
      borderColor: colors.primaryFontColor.lightMode,
      bgColor: colors.footerBGColor.lightMode,

      color: colors.primaryFontColor.lightMode,
    },
  },
  overlay: { bg: 'blackAlpha.100', backdropFilter: 'blur(12px)' },
  //backdropInvert='60%'
  //backdropBlur='2px'
  dialogContainer: { px: '0' },
  header: { px: '0' },
});

const kiosk = definePartsStyle({
  dialog: {
    //autoFocus: 'false',
    borderWidth: '0.2rem',
    pt: '5',
    pb: '10',
    //px: '10vw',

    // Let's also provide dark mode alternatives
    _dark: {
      borderColor: colors.primaryFontColor.darkMode,
      bgColor: colors.footerBGColor.darkMode,

      color: colors.primaryFontColor.darkMode,
    },
    _light: {
      borderColor: colors.primaryFontColor.lightMode,
      bgColor: colors.footerBGColor.lightMode,

      color: colors.primaryFontColor.lightMode,
    },
  },
  overlay: { bg: 'blackAlpha.100', backdropFilter: 'blur(12px)' },
  //backdropInvert='60%'
  //backdropBlur='2px'
  dialogContainer: { px: '0' },
});

const kioskLanguage = definePartsStyle({
  dialog: {
    //autoFocus: 'false',
    borderWidth: '0',
    p: '0',

    //px: '10vw',

    // Let's also provide dark mode alternatives
    _dark: {
      borderColor: colors.primaryFontColor.darkMode,
      bgColor: 'transparent',

      color: colors.primaryFontColor.darkMode,
    },
    _light: {
      borderColor: colors.primaryFontColor.lightMode,
      bgColor: 'transparent',

      color: colors.primaryFontColor.lightMode,
    },
  },
  overlay: { bg: 'blackAlpha.600', backdropFilter: 'blur(12px)' },
  p: '0',
  //backdropInvert='60%'
  //backdropBlur='2px'
  dialogContainer: { px: '0' },
});

export const modalTheme = defineMultiStyleConfig({
  variants: { baseStyle, toto, kiosk, kioskLanguage },
});

// bgColor={useColorModeValue(
//     'footerBGColor.lightMode',
//     'footerBGColor.darkMode'
//   )}
