import { ThemeButtonNackt } from '@/components/buttons/ThemeButton';
import { Box, LinkProps } from '@chakra-ui/react';

const BoxThemeButton = ({ pos, top }: LinkProps) => {
  return (
    <Box
      id='themeButton'
      w='100%'
      top={top}
      h='100%'
      position={pos}
      //top={top}
      left='calc(50vw - 1.5rem)'
    >
      <ThemeButtonNackt />
    </Box>
  );
};

export default BoxThemeButton;
