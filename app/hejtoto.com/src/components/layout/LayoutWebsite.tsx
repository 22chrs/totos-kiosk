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

function isSafariMobile() {
  const userAgent = navigator.userAgent;
  return (
    /iP(ad|od|hone)/i.test(userAgent) &&
    /WebKit/i.test(userAgent) &&
    !/(CriOS|FxiOS|OPiOS|mercury)/i.test(userAgent)
  );
}

const Layout = ({ children }: LayoutProps) => {
  // Calc Postion of Top for LightSwicht
  const [postionElementY, setPostionElementY] = useState(0);
  const [visibilityLightSwicht, setVisibilityLightSwicht] = useState(0);

  useEffect(() => {
    function updatePositionElementY() {
      if (!isSafariMobile()) {
        setPostionElementY(
          Math.round(
            window.innerHeight * 0.9 - getElementHeightById('themeButton')
          )
        );
      }
      if (isSafariMobile()) {
        setPostionElementY(
          Math.round(
            window.innerHeight * 0.98 - getElementHeightById('themeButton')
          )
        );
      }
    }

    if (!isSafariMobile()) {
      window.addEventListener('resize', updatePositionElementY);
    }

    updatePositionElementY();
    // update initial position

    return () => {
      if (!isSafariMobile()) {
        window.removeEventListener('resize', updatePositionElementY);
      }
    };
  }, []);

  useEffect(() => {
    const scrollHeightMax = getScrollHeight();
    const footerHeight = getElementHeightById('footer');
    const buttonHeight = getElementHeightById('themeButton');

    function updateVisibility() {
      const scrollHeight = document.documentElement.scrollTop;
      const calculation = Math.round(
        postionElementY +
          scrollHeight -
          scrollHeightMax +
          footerHeight +
          0.5 * buttonHeight
      );

      if (calculation > 0) {
        setVisibilityLightSwicht(0);
      } else {
        setVisibilityLightSwicht(1);
      }
    }

    window.addEventListener('resize', updateVisibility);
    window.addEventListener('scroll', updateVisibility);

    updateVisibility(); // get initial values

    // Cleanup function
    return () => {
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
    };
  }, [postionElementY]);

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
        opacity={visibilityLightSwicht}
      >
        <ThemeButtonNackt />
      </Box>

      <Box id='footer'>
        <Footer />
      </Box>
    </>
  );
};

export default Layout;
