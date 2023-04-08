import {
  Icon,
  Menu,
  MenuButton,
  MenuGroup,
  MenuList,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaHamburger } from 'react-icons/fa';

import { MenuListItem } from '@/components/layout/menu/Items';

const MobilMenu = () => {
  return (
    <Menu gutter={20}>
      <MenuButton>
        <Icon
          _focusVisible={{
            outline: 'none',
          }}
          as={FaHamburger}
          fontSize='2xl'
          color={useColorModeValue('fontColor.lightMode', 'fontColor.darkMode')}
        />
      </MenuButton>
      <MenuList
        minW='fit-content'
        border='2px'
        padding={10}
        rounded={0}
        _focusVisible={{
          outline: 'none',
        }}
      >
        <MenuGroup title='Unser Service ▾' fontSize='20' pb='2'>
          <MenuListItem link='/service/barista' text='Barista Café' />
          <MenuListItem link='/service/dates' text='Veranstaltung planen' />
          <MenuListItem link='/service/pricing' text='Preise' />
          <MenuListItem link='/service/places' text='Aufstellorte' />
          <MenuListItem link='/service/faqs' text='FAQs' />
        </MenuGroup>

        <MenuGroup title='Über uns ▾' pt='8' fontSize='20' pb='2'>
          <MenuListItem link='/about/about' text='Toto & Team' />
          <MenuListItem link='/about/feedback' text='Feedback' />
          <MenuListItem link='/about/sustainability' text='Nachhaltigkeit' />
        </MenuGroup>
      </MenuList>
    </Menu>
  );
};

export default MobilMenu;
