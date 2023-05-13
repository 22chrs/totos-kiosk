import Logo from '@/components/logo/Logo';
import LogoQuer from '@/components/logo/LogoQuer';

import { Box, useColorModeValue } from '@chakra-ui/react';

const LogoUniversal = ({ logoType, height, top }) => {
  const colorFont = useColorModeValue('#F7FAFC', 'black'); //#2D3748
  const colorBG = useColorModeValue('#2D3748', '#F7FAFC');

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

export default LogoUniversal;
