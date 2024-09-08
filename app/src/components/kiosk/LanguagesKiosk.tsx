import {
  Box,
  HStack,
  Heading,
  Icon,
  Tab,
  TabList,
  Tabs,
  VStack,
  useColorModeValue as mode,
  useDisclosure,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown, FaChevronLeft } from 'react-icons/fa';
import { KIOSK_LANG_HEIGHT } from 'src/constants';
import { ArrowIcon, LanguageRegular, RobotRegular } from '../icons/icons';
import { useState } from 'react';

//https://help.ubuntu.com/stable/ubuntu-help/figures/input-methods-switcher.png

export const LanguagesTabsKiosk = () => {
  const { i18n } = useTranslation();
  const { isOpen, onToggle } = useDisclosure(); // useDisclosure for managing slide visibility

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setShowAllLanguages(false); // Optionally close the slide after selection
  };

  const availableLanguages = Array.isArray(i18n.options.supportedLngs)
    ? i18n.options.supportedLngs.filter((lang) => lang !== 'cimode')
    : [];
  const [showAllLanguages, setShowAllLanguages] = useState(false);

  const toggleLanguages = () => {
    setShowAllLanguages(!showAllLanguages);
    onToggle(); // This will toggle the isOpen state from useDisclosure
  };

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
        //height='100'
        borderColor={mode('footerBGColor.darkMode', 'footerBGColor.darkMode')}
        display='flex' // Added for flex display
        //justifyContent='center' // Center the tabs
      >
        <Box rounded='3xl' p='7' onClick={(e) => e.stopPropagation()}>
          <Box
            height='100'
            bgColor={mode('pageBGColor.lightMode', 'pageBGColor.lightMode')}
            rounded='2xl'
            borderWidth='0.2rem'
            borderColor={mode(
              'footerBGColor.darkMode',
              'footerBGColor.darkMode',
            )}
            width='auto'
            onClick={(e) => e.stopPropagation()}
          >
            <TabList
              _focus={{
                boxShadow: 'none',
                background: 'transparent!important',
              }}
              display='flex'
              justifyContent='center'
            >
              <Tab
                _focusVisible={{
                  boxShadow: 'none',
                  outline: 'none',
                  background: 'transparent!important',
                }}
                _focus={{
                  boxShadow: 'none',
                  background: 'transparent!important',
                }}
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
                    background: 'transparent!important',
                    color: 'inherit',
                    opacity: 1,
                  }}
                  _focus={{ outline: 'none', boxShadow: 'none' }}
                  px='8'
                  py='1'
                  onClick={toggleLanguages}
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
                    pb='1.5'
                    fontWeight='700'
                    rounded='2xl'
                    position='relative'
                    spacing={0}
                    justifyContent='center'
                  >
                    <Box
                      as='span'
                      fontSize='4xl'
                      transform='translateY(-17%)'
                      letterSpacing='0.2rem'
                    >
                      {currentShortName}
                    </Box>
                    <Box
                      as='span'
                      fontSize='md'
                      position='absolute'
                      bottom='0'
                      transform='translateY(-20%)'
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
                      _active={{ background: 'transparent!important' }}
                      _selected={{
                        bg: 'transparent',
                        color: 'inherit',
                        opacity: 1,
                      }}
                      _focus={{ outline: 'none', boxShadow: 'none' }}
                      px='8'
                      py='1'
                      height={KIOSK_LANG_HEIGHT}
                      style={{
                        transition: 'transform 0.3s ease-in-out',
                        transform: showAllLanguages
                          ? 'translateX(0)'
                          : 'translateX(100%)',
                      }}
                    >
                      <VStack
                        height='85%'
                        width='85%'
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
                        pb='1.5'
                        fontWeight={i18n.language === lang ? '700' : '400'}
                        rounded='2xl'
                        position='relative'
                        spacing={0}
                        justifyContent='center'
                      >
                        <Box
                          as='span'
                          fontSize='4xl'
                          transform='translateY(-17%)'
                          letterSpacing='0.2rem'
                        >
                          {shortName}
                        </Box>
                        <Box
                          as='span'
                          //pt='4'
                          fontSize='md'
                          position='absolute'
                          bottom='0'
                          transform='translateY(-20%)'
                        >
                          {lang}
                        </Box>
                      </VStack>
                    </Tab>
                  );
                })}

              <Tab
                _active={{ background: 'transparent!important' }}
                _focusVisible={{
                  boxShadow: 'none',
                  outline: 'none',
                  background: 'transparent!important',
                }}
                _focus={{
                  boxShadow: 'none',
                  background: 'transparent!important',
                }}
                aria-label='Expand languages'
                background='transparent!important'
                onClick={toggleLanguages} // Use the combined function here
              >
                <Icon
                  _active={{ background: 'transparent!important' }}
                  as={showAllLanguages ? FaChevronLeft : FaChevronDown}
                  fontSize='5xl'
                  color='black'
                  background='transparent!important'
                  _focusVisible={{
                    boxShadow: 'none',
                    outline: 'none',
                    background: 'transparent!important',
                  }}
                  style={{
                    transform: showAllLanguages
                      ? 'translateY(-1%)'
                      : 'translateY(3%)',
                  }} // Only move the up arrow up
                />
              </Tab>
            </TabList>
          </Box>
        </Box>
      </Tabs>
      {!showAllLanguages && (
        <Box
          px='7'
          height='100'
          bgColor={mode('pageBGColor.lightMode', 'pageBGColor.lightMode')}
          borderWidth='0.2rem'
          borderColor={mode('footerBGColor.darkMode', 'footerBGColor.darkMode')}
          position='fixed'
          right='5.7vw' // Add this property to center horizontally
          bottom='21.5vh'
          //transform='translateX(-50%)' // Add this property to center horizontally
          //width='30vw'
          rounded='2xl'
          display='flex' // Add this property for centering the text
          alignItems='center' // Add this property for centering the text
          justifyContent='center' // Add this property for centering the text
        >
          <HStack
            gap='10'
            color={mode(
              'primaryFontColor.lightMode',
              'primaryFontColor.lightMode',
            )}
          >
            <Icon
              as={RobotRegular}
              fontSize='5rem'
              display='flex' // Add this property for centering the text
              alignItems='center' // Add this property for centering the text
              justifyContent='center' // Add this property for centering the text
              borderRadius='10rem' // Add this property to create round corners
            />
            <Heading
              color={mode(
                'primaryFontColor.lightMode',
                'primaryFontColor.lightMode',
              )}
            >
              START
            </Heading>
            <Icon
              as={ArrowIcon}
              fontSize='4rem'
              display='flex' // Add this property for centering the text
              alignItems='center' // Add this property for centering the text
              justifyContent='center' // Add this property for centering the text
              borderRadius='10rem' // Add this property to create round corners
            />
          </HStack>
        </Box>
      )}
    </>
  );
};
