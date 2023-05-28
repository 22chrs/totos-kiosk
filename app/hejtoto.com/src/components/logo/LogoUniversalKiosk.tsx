import Logo from '@/components/logo/Logo';
import LogoQuer from '@/components/logo/LogoQuer';

import { Box, useColorModeValue } from '@chakra-ui/react';

const LogoUniversalKiosk = ({ logoType, height, top }) => {
  const colorFont = useColorModeValue('#F7FAFC', 'black'); //#2D3748
  const colorBG = useColorModeValue('#171923', '#F7FAFC');

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

export default LogoUniversalKiosk;

// export const LogoKioskInverted = ({ logoType, height, top }) => {
//   const colorFont = useColorModeValue('black', '#F7FAFC');
//   const colorBG = useColorModeValue('#F7FAFC', '#2D3748');

//   const logoOutput =
//     logoType === 'Logo' ? (
//       <Logo
//         colorFont={colorFont}
//         colorBG={colorBG}
//         height={height}
//         //width={width}
//         top={top}
//       />
//     ) : (
//       <LogoQuer
//         colorFont={colorFont}
//         colorBG={colorBG}
//         height={height}
//         //width={width}
//         top={top}
//       />
//     );

//   return <Box>{logoOutput}</Box>;
// };
