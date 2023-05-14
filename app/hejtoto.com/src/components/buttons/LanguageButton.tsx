import { availableLanguages } from '@/internationalization/i18n';
import {
  Box,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  Text,
  useColorModeValue as mode,
  useColorModeValue,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';
import { MenuListBrand } from '../layout/menu/Items';

export const LanguagesButtonNackt = () => {
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
          px={5}
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
