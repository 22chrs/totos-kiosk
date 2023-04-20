import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue as mode,
  useDisclosure,
} from '@chakra-ui/react';
import NextLink from 'next/link';

import { MagicLink } from '@/components/links/CustomLink';

export const MenuHoverButton = ({ text, link, pr }) => {
  return (
    <MagicLink href={link} as={NextLink}>
      <MenuButton
        pr={pr}
        className='MenuHoverButton'
        as={Button}
        _active={{
          bgColor: 'transparent',
        }}
        _hover={{
          bgColor: 'transparent',
        }}
        bgColor='transparent'
        fontWeight='700'
        //px='3'
      >
        <Text
          pt='0'
          sx={{
            '.MenuHoverButton:hover &': {
              textDecoration: 'underline',
              textDecorationThickness: '0.15rem',
              textUnderlineOffset: '0.25rem',
            },
          }}
        >
          {text}
        </Text>
      </MenuButton>
    </MagicLink>
  );
};

export const MenuListDropdown = ({ children, text, pr }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Menu isOpen={isOpen} gutter={0}>
      <MenuButton
        pr={pr}
        pl='0'
        _focusVisible={{
          outline: 'none',
        }}
        as={Button}
        variant='MenuButton'
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
      >
        <Text pt='0'>{text}</Text>
      </MenuButton>
      <MenuList
        minW='fit-content'
        border='2px'
        padding={4}
        rounded={0}
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
        onClick={onClose}
      >
        {children}
      </MenuList>
    </Menu>
  );
};

export const MenuListItem = ({ text, link }) => {
  return (
    <MagicLink
      as={NextLink}
      href={link}
      justifyContent='flex-start'
      className='myItem'
    >
      <MenuItem
        bgColor='transparent'
        _hover={{
          background: 'transparent',
        }}
      >
        <Text
          pt='0'
          sx={{
            '.myItem:hover &': {
              textDecoratsion: 'underline',
              textDecorationThickness: '0.08rem',
              textUnderlineOffset: '0.2rem',
            },
          }}
        >
          {text}
        </Text>
      </MenuItem>
    </MagicLink>
  );
};

// Button Sign In

export const MenuButtonFull = ({ text }) => {
  return (
    <MenuButton as={Button} size='md' colorScheme='brand'>
      {text}
    </MenuButton>
  );
};

export const MenuListBrand = ({ children }) => {
  return (
    <MenuList
      minW='fit-content'
      border='2px'
      padding={4}
      rounded={0}
      bgColor={mode('footerBGColor.lightMode', 'footerBGColor.darkMode')}
    >
      {children}
    </MenuList>
  );
};
