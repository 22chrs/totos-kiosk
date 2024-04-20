import {
  Box,
  Icon,
  Tab,
  TabList,
  Tabs,
  VStack,
  useColorModeValue as mode,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FaAccusoft } from 'react-icons/fa';
import { KIOSK_LANG_HEIGHT } from 'src/constants';
import { LanguageRegular } from '../icons/icons';

//https://help.ubuntu.com/stable/ubuntu-help/figures/input-methods-switcher.png

export const LanguagesTabsKiosk = ({ handleOpen }) => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const availableLanguages = Array.isArray(i18n.options.supportedLngs)
    ? i18n.options.supportedLngs.filter((lang) => lang !== 'cimode')
    : [];

  // useEffect(() => {
  //   handleLanguageChange('Deutsch');
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // Function to get short name from full language name
  const getShortName = (lang) => {
    const languageMap = {
      Deutsch: 'de', //!
      English: 'en', //!
      Français: 'fr', //!
      Русский: 'ru', //!
      Español: 'es',
      Italiano: 'it', //!
      Nederlands: 'nl', //!
      Polski: 'pl',
      Українська: 'uk', //!
      Türk: 'tr', //!
      العربية: 'ar', //!
      中文: 'zh', //!
    };
    return languageMap[lang] || lang; // Return the original language name if no mapping is found
  };

  return (
    <>
      <Tabs
        _focusVisible={{ boxShadow: 'none', outline: 'none' }}
        _focus={{ boxShadow: 'none' }}
        variant='soft-rounded'
        bgColor={mode('pageBGColor.lightMode', 'pageBGColor.lightMode')}
        rounded='2xl'
        borderWidth='0.2rem'
        borderColor={mode('footerBGColor.darkMode', 'footerBGColor.darkMode')}
      >
        <TabList _focus={{ boxShadow: 'none' }}>
          <Tab
            _focusVisible={{ boxShadow: 'none', outline: 'none' }}
            _focus={{ boxShadow: 'none' }}
            aria-label='Language icon' // Accessibility label
            background='transparent!important'
          >
            <Icon
              _focusVisible={{ boxShadow: 'none', outline: 'none' }}
              _focus={{ boxShadow: 'none' }}
              //bgColor='red'
              as={LanguageRegular}
              fontSize='7xl'
              color='black'
              background='transparent!important'
            />
          </Tab>
          {availableLanguages.map((lang) => {
            const shortName = getShortName(lang);

            return (
              <Tab
                background='transparent!important'
                key={lang}
                //isDisabled={i18n.language === lang ? true : false}
                onClick={
                  i18n.language === lang
                    ? handleOpen // call handleOpen when the language is already selected
                    : () => handleLanguageChange(lang)
                }
                className={i18n.language === lang ? 'myItemFalse' : 'myItem'}
                _active={{ bg: 'transparent' }}
                _selected={{ bg: 'transparent', color: 'inherit', opacity: 1 }}
                _focus={{ outline: 'none', boxShadow: 'none' }}
                sx={{
                  ':focus': {
                    outline: 'none !important',
                  },
                }}
                px='0'
                py='0'
                width='100vw'
                height={KIOSK_LANG_HEIGHT}
              >
                <VStack
                  height='85%'
                  width='85%'
                  bg={
                    i18n.language === lang
                      ? mode(
                          ' footerBGColor.lightMode',
                          'footerBGColor.lightMode',
                        )
                      : 'transparent'
                  }
                  color={
                    i18n.language === lang
                      ? mode(
                          'primaryFontColor.lightMode',
                          'primaryFontColor.lightMode',
                        )
                      : mode(
                          'footerFontColor.lightMode',
                          'footerFontColor.lightMode',
                        )
                  }
                  fontWeight={i18n.language === lang ? '700' : '400'}
                  rounded='2xl'
                  position='relative'
                  spacing={0}
                  justifyContent='center' // centers vertically
                >
                  <Box as='span' fontSize='4xl' transform='translateY(-12%)'>
                    {shortName}
                  </Box>
                  <Box
                    as='span'
                    fontSize='sm'
                    position='absolute'
                    bottom='0'
                    transform='translateY(-30%)'
                  >
                    {lang}
                  </Box>
                </VStack>
              </Tab>
            );
          })}
        </TabList>
      </Tabs>
    </>
  );
};
