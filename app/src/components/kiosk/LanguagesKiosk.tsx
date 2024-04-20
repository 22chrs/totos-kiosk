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
import { FaAccusoft, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { KIOSK_LANG_HEIGHT } from 'src/constants';
import { LanguageRegular } from '../icons/icons';
import { useState } from 'react';

//https://help.ubuntu.com/stable/ubuntu-help/figures/input-methods-switcher.png

export const LanguagesTabsKiosk = ({ handleOpen }) => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const availableLanguages = Array.isArray(i18n.options.supportedLngs)
    ? i18n.options.supportedLngs.filter((lang) => lang !== 'cimode')
    : [];
  const [showAllLanguages, setShowAllLanguages] = useState(false);

  // useEffect(() => {
  //   handleLanguageChange('Deutsch');
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // Function to get short name from full language name
  const getShortName = (lang) => {
    const languageMap = {
      Deutsch: 'DE', //!
      English: 'EN', //!
      Français: 'FR', //!
      Русский: 'RU', //!
      Español: 'ES',
      Italiano: 'IT', //!
      Nederlands: 'NL', //!
      Polski: 'PL',
      Українська: 'UK', //!
      Türk: 'TR', //!
      العربية: 'AR', //!
      中文: 'ZN', //!
    };
    return languageMap[lang] || lang; // Return the original language name if no mapping is found
  };
  const currentShortName = getShortName(i18n.language);
  return (
    <>
      <Tabs
        _focusVisible={{ boxShadow: 'none', outline: 'none' }}
        _focus={{ boxShadow: 'none' }}
        variant='soft-rounded'
        //bgColor={mode('pageBGColor.lightMode', 'pageBGColor.lightMode')}
        rounded='2xl'
        //borderWidth='0.2rem'
        width='auto'
        borderColor={mode('footerBGColor.darkMode', 'footerBGColor.darkMode')}
        display='flex' // Added for flex display
        //justifyContent='center' // Center the tabs
      >
        <Box
          bgColor={mode('pageBGColor.lightMode', 'pageBGColor.lightMode')}
          rounded='2xl'
          borderWidth='0.2rem'
          borderColor={mode('footerBGColor.darkMode', 'footerBGColor.darkMode')}
          width='auto'
        >
          <TabList
            _focus={{ boxShadow: 'none' }}
            display='flex'
            justifyContent='center'
          >
            <Tab
              _focusVisible={{ boxShadow: 'none', outline: 'none' }}
              _focus={{ boxShadow: 'none' }}
              aria-label='Language icon'
              background='transparent!important'
              onClick={() => setShowAllLanguages(!showAllLanguages)}
            >
              <Icon
                as={LanguageRegular}
                fontSize='7xl'
                color='black'
                background='transparent!important'
              />
            </Tab>

            {/* Conditionally render the selected language tab */}
            {!showAllLanguages && (
              <Tab
                key={i18n.language}
                //isDisabled // Disable interaction since it's just a display
                _selected={{
                  bg: 'transparent',
                  color: 'inherit',
                  opacity: 1,
                }}
                _focus={{ outline: 'none', boxShadow: 'none' }}
                px='10'
                py='1'
                //width='8vw' //!###

                height={KIOSK_LANG_HEIGHT}
              >
                <VStack
                  height='85%'
                  width='85%'
                  // bg={mode(
                  //   'footerBGColor.lightMode',
                  //   'footerBGColor.lightMode',
                  // )}
                  color={mode(
                    'primaryFontColor.lightMode',
                    'primaryFontColor.lightMode',
                  )}
                  pb='1'
                  fontWeight='700'
                  rounded='2xl'
                  position='relative'
                  spacing={0}
                  justifyContent='center'
                >
                  <Box as='span' fontSize='4xl' transform='translateY(-12%)'>
                    {currentShortName}
                  </Box>
                  <Box
                    as='span'
                    fontSize='sm'
                    position='absolute'
                    bottom='0'
                    transform='translateY(-30%)'
                  >
                    {i18n.language}
                  </Box>
                </VStack>
              </Tab>
            )}

            {showAllLanguages &&
              availableLanguages.map((lang) => {
                const shortName = getShortName(lang);
                return (
                  <Tab
                    background='transparent!important'
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    _active={{ bg: 'transparent' }}
                    _selected={{
                      bg: 'transparent',
                      color: 'inherit',
                      opacity: 1,
                    }}
                    _focus={{ outline: 'none', boxShadow: 'none' }}
                    px='10'
                    py='1'
                    //width='8vw' //!###
                    height={KIOSK_LANG_HEIGHT}
                  >
                    <VStack
                      height='85%'
                      width='85%'
                      // bg={
                      //   i18n.language === lang
                      //     ? mode(
                      //         'footerBGColor.lightMode',
                      //         'footerBGColor.lightMode',
                      //       )
                      //     : 'transparent'
                      // }
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
                      pb='1'
                      fontWeight={i18n.language === lang ? '700' : '400'}
                      rounded='2xl'
                      position='relative'
                      spacing={0}
                      justifyContent='center'
                    >
                      <Box
                        as='span'
                        fontSize='4xl'
                        transform='translateY(-12%)'
                      >
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
            <Tab
              _focusVisible={{ boxShadow: 'none', outline: 'none' }}
              _focus={{ boxShadow: 'none' }}
              aria-label='Expand languages'
              background='transparent!important'
              onClick={() => setShowAllLanguages(!showAllLanguages)}
            >
              <Icon
                as={showAllLanguages ? FaChevronUp : FaChevronDown}
                fontSize='5xl'
                color='black'
                background='transparent!important'
                style={{
                  transform: showAllLanguages ? 'translateY(-8%)' : 'none',
                }} // Only move the up arrow up
              />
            </Tab>
          </TabList>
        </Box>
      </Tabs>
    </>
  );
};
