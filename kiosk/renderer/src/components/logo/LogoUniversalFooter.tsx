import Logo from '@/components/logo/Logo';
import LogoQuer from '@/components/logo/LogoQuer';

import { Box, useColorModeValue } from '@chakra-ui/react';

const LogoUniversalFooter = ({ logoType, height, width, top }) => {
  const colorFont = useColorModeValue('#f5f2ed', '#171923');
  const colorBG = useColorModeValue('#807a77', '#8495b3');

  const logoOutput =
    logoType === 'Logo' ? (
      <Logo
        colorFont={colorFont}
        colorBG={colorBG}
        height={height}
        width={width}
        top={top}
      />
    ) : (
      <LogoQuer
        colorFont={colorFont}
        colorBG={colorBG}
        height={height}
        width={width}
        top={top}
      />
    );

  return <Box>{logoOutput}</Box>;
};

export default LogoUniversalFooter;
