import Footer from '@/components/layout/menu/footer';
import Header from '@/components/layout/menu/header';

import { Box, HStack, useColorModeValue } from '@chakra-ui/react';
import { ReactNode } from 'react';

import { ThemeButtonNackt } from '@/components/buttons/ThemeButton';

import { useEffect, useState } from 'react';

import {
  getElementHeightById,
  getScrollHeight,
} from '@/components/funktions/random';

type LayoutProps = {
  children: ReactNode;
  pt?: number | string; // Add 'pt' as an optional prop
};

const Layout = ({ children }: LayoutProps) => {
  //animation

  // Calc Postion of Top for LightSwicht
  const [postionElementY, setPostionElementY] = useState(
    Math.round(window.innerHeight * 0.88)
  );
  //const [postionElementX, setPostionElementX] = useState(window.innerWidth);
  const [visibilityLightSwicht, setVisibilityLightSwicht] = useState(1);

  const [scrollCalc, setScrollCalc] = useState(0);
  useEffect(() => {
    const scrollHeightMax = getScrollHeight();
    const footerHeight = getElementHeightById('footer');
    const buttonHeight = getElementHeightById('themeButton');

    function handleScroll() {
      const scrollHeight = document.documentElement.scrollTop;
      const berechnung = Math.round(
        postionElementY +
          scrollHeight -
          scrollHeightMax +
          footerHeight +
          0.5 * buttonHeight
      );

      setScrollCalc(berechnung);
    }

    if (scrollCalc > 0) {
      setVisibilityLightSwicht(0);
    } else {
      setVisibilityLightSwicht(1);
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // get initial scroll height
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollCalc, postionElementY]);

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

      <Box
        id='themeButton'
        top={postionElementY}
        position='fixed'
        left='calc(5vw)'
        //left='calc(50vw - 1.5rem)' // mittig
        opacity={visibilityLightSwicht}
      >
        <ThemeButtonNackt />
      </Box>

      {/* <Box
        id='themeButton'
        top='88vh'
        //top='88vh'
        position='fixed'
        left='calc(10vw - 1.5rem)'
        visibility={isVisibilArrowButton}
      >
        <ArrowButton />
      </Box> */}

      <Box id='footer'>
        <Footer />
      </Box>
    </>
  );
};

export default Layout;
