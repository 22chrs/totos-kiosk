import Logo from '@/components/logo/Logo';
import LogoQuer from '@/components/logo/LogoQuer';

import { Box, useColorMode, useColorModeValue } from '@chakra-ui/react';

const LogoKiosk = ({ logoType, height, top }) => {
  const colorFont = useColorModeValue('#F7FAFC', 'black');
  const colorBG = useColorModeValue('#2D3748', '#F7FAFC');
  const { toggleColorMode } = useColorMode();

  const logoOutput =
    logoType === 'Logo' ? (
      <Logo
        colorFont={colorFont}
        colorBG={colorBG}
        height={height}
        //width={width}
        top={top}
      />
    ) : (
      <LogoQuer
        colorFont={colorFont}
        colorBG={colorBG}
        height={height}
        //width={width}
        top={top}
      />
    );

  return <Box>{logoOutput}</Box>;
};

export default LogoKiosk;
