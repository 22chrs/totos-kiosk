import { availableLanguages } from '@/internationalization/i18n';
import {
  Box,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  Tab,
  TabList,
  Tabs,
  Text,
  VStack,
  useColorModeValue as mode,
  useColorModeValue,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MenuListBrand } from '../layout/menu/Items';

import { FaGlobe } from 'react-icons/fa';

//https://help.ubuntu.com/stable/ubuntu-help/figures/input-methods-switcher.png

export const LanguagesTabsKiosk = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const availableLanguages = Array.isArray(i18n.options.supportedLngs)
    ? i18n.options.supportedLngs.filter((lang) => lang !== 'cimode')
    : [];

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
      // Add more mappings as needed...
    };
    return languageMap[lang] || lang; // Return the original language name if no mapping is found
  };

  return (
    <Tabs
      variant='soft-rounded'
      bgColor={mode('pageBGColor.darkMode', 'pageBGColor.lightMode')}
      rounded='3xl'
    >
      <TabList>
        {availableLanguages.map((lang) => {
          const shortName = getShortName(lang);

          return (
            <Tab
              key={lang}
              isDisabled={i18n.language === lang ? true : false}
              className={i18n.language === lang ? 'myItemFalse' : 'myItem'}
              onClick={() => handleLanguageChange(lang)}
              _active={{ bg: 'transparent' }}
              _selected={{ bg: 'transparent', color: 'inherit', opacity: 1 }}
              px='0'
              py='0'
              width='100vw'
              height='12vh'
              //height='???' // I want to have a asprect ratio of 1:1 so, how do I do that?
            >
              <VStack
                height='85%'
                width='85%'
                bg={
                  i18n.language === lang
                    ? mode(' footerBGColor.darkMode', 'footerBGColor.lightMode')
                    : 'transparent'
                }
                color={
                  i18n.language === lang
                    ? mode(
                        'primaryFontColor.darkMode',
                        'primaryFontColor.lightMode'
                      )
                    : mode(
                        'footerFontColor.darkMode',
                        'footerFontColor.lightMode'
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
                  transform='translateY(-10%)'
                >
                  {lang}
                </Box>
              </VStack>
            </Tab>
          );
        })}
      </TabList>
    </Tabs>
  );
};

export const LanguagesButtonSymbol = () => {
  const { i18n } = useTranslation();
  return (
    <Box>
      <Menu gutter={10}>
        <MenuButton
          _focusVisible={{
            //outline: 'none',
            bgColor: mode('red', 'brandBGColorHover.darkMode'),
          }}
          //as={Button}
          //variant='link'

          border='2px'
          pt='0.1rem'
          pb='0.18rem'
          //padding={'0.1em'}
          px={4}
          rounded={6}
          bgColor={useColorModeValue('transparent', 'transparent')}
          color={useColorModeValue(
            'brandColor.lightMode',
            'brandColor.darkMode'
          )}
          borderColor={useColorModeValue(
            'brandColor.lightMode',
            'brandColor.darkMode'
          )}
          _hover={{
            bgColor: mode('transparent', 'transparent'),
          }}
        >
          <HStack>
            <Icon as={FaGlobe} />
            <Text
              pt='0'
              fontWeight={700}
              color={useColorModeValue(
                'brandColor.lightMode',
                'brandColor.darkMode'
              )}
            >
              Languages
            </Text>
          </HStack>
        </MenuButton>

        <MenuListBrand>
          {availableLanguages.map((lang) => (
            <MenuItem
              bgColor='transparent'
              key={lang}
              isDisabled={i18n.language === lang ? true : false}
              className={i18n.language === lang ? 'myItemFalse' : 'myItem'}
              onClick={() => i18n.changeLanguage(lang)}
            >
              <Text
                pt='0'
                fontWeight={700}
                sx={{
                  '.myItem:hover &': {
                    textDecoration: 'underline',
                    textDecorationThickness: '0.08rem',
                    textUnderlineOffset: '0.2rem',
                  },
                }}
              >
                {lang}
              </Text>
            </MenuItem>
          ))}
        </MenuListBrand>
      </Menu>
    </Box>
  );
};
