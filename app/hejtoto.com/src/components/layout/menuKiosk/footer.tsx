import { LanguagesTabsKiosk } from '@/components/buttons/LanguagesKiosk';
import { MagicLink } from '@/components/links/CustomLink';
import LogoKiosk from '@/components/logo/LogoKiosk';
import { Box, useColorModeValue } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

export function FooterStartPage() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const { t } = useTranslation();

  const handlePageClick = () => {
    router.push('./kiosk/shop');
  };

  return (
    <Box
      onClick={handlePageClick}
      justifyItems='center'
      px='15vw'
      //pl={isMobil ? '5vw' : '10vw'}
      //pr={isMobil ? '5vw' : '10vw'}
      pt='9'
      pb='555 '
      bgColor={useColorModeValue(
        'footerBGColor.lightMode',
        'footerBGColor.darkMode'
      )}
      color={useColorModeValue(
        'footerFontColor.lightMode',
        'footerFontColor.darkMode'
      )}
      //px='5vw'

      w='100%'
    >
      <Box onClick={(e) => e.stopPropagation()}>
        <LanguagesTabsKiosk />
      </Box>
    </Box>
  );
}

export function FooterMainPage() {
  const { i18n } = useTranslation();
  const { t } = useTranslation();

  return (
    <Box
      justifyItems='center'
      px='5vw'
      //pl={isMobil ? '5vw' : '10vw'}
      //pr={isMobil ? '5vw' : '10vw'}
      pt='9'
      pb='555 '
      bgColor={useColorModeValue(
        'footerBGColor.lightMode',
        'footerBGColor.darkMode'
      )}
      color={useColorModeValue(
        'footerFontColor.lightMode',
        'footerFontColor.darkMode'
      )}
      //px='5vw'

      w='100%'
    >
      <MagicLink href='/' as={NextLink} style={{ textDecoration: 'none' }}>
        <LogoKiosk height={60} logoType='Logo' top='0' />
      </MagicLink>
    </Box>
  );
}
