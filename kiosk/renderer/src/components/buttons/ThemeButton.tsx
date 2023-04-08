import {
  IconButton,
  useColorMode,
  useColorModeValue as mode,
} from '@chakra-ui/react';
import { FiMoon, FiSun } from 'react-icons/fi';
// import { VscColorMode } from 'react-icons/vsc';

export const ThemeButtonNackt = () => {
  const { toggleColorMode } = useColorMode();
  return (
    <IconButton
      //border='2px'
      //borderColor={'brand.200'}
      rounded='full'
      //size='md'
      boxSize='3rem'
      //color='brand.200'
      aria-label='Toggle color mode'
      //bgColor={mode('primaryHeadingColor.lightMode', 'footerBGColor.lightMode')}
      bgColor={mode('#2d3142', 'yellow.200')}
      color={mode(
        'primaryHeadingColor.darkMode',
        'primaryHeadingColor.lightMode'
      )}
      _hover={{
        color: mode('footerColor.darkMode', 'primaryHeadingColor.lightMode'),
        bgColor: mode('gray.600', 'yellow.400'),
      }}
      //colorScheme='brand'
      icon={mode(<FiMoon />, <FiSun />)}
      //color={mode('light', 'dark')}
      onClick={toggleColorMode}
    />
  );
};
