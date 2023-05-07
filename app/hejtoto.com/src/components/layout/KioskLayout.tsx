// NoFooterLayout.tsx

import Header from '@/components/layout/menuKiosk/header';
import { HStack, useColorModeValue } from '@chakra-ui/react';

const NoFooterLayout = ({ children }) => {
  return (
    <>
      <Header />
      <HStack
        as='main'
        bgColor={useColorModeValue(
          'pageBGColor.lightMode',
          'pageBGColor.darkMode'
        )}
      >
        {children}
      </HStack>
    </>
  );
};

export default NoFooterLayout;
