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

export const modalTheme = defineMultiStyleConfig({
  variants: { baseStyle, toto },
});

// bgColor={useColorModeValue(
//     'footerBGColor.lightMode',
//     'footerBGColor.darkMode'
//   )}
