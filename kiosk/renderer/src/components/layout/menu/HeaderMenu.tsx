import { useTranslation } from 'react-i18next';

import { Box, Menu } from '@chakra-ui/react';

import {
  MenuHoverButton,
  MenuListDropdown,
  MenuListItem,
} from '@/components/layout/menu/Items';

const HeaderMenu = () => {
  const { t } = useTranslation();
  return (
    <Box>
      <MenuListDropdown pr='5' text={t('our-services')}>
        <MenuListItem link='/service/barista' text={t('barista-cafe')} />
        <MenuListItem link='/service/dates' text={t('rent-toto')} />
        <MenuListItem link='/service/places' text={t('collobaration')} />
        <MenuListItem link='/service/faqs' text={t('faqs')} />
      </MenuListDropdown>

      <Menu>
        <MenuHoverButton
          pr='7'
          link='/service/dates'
          text={t('toto-for-events')}
        />
      </Menu>

      <Menu>
        <MenuHoverButton pr='10' link='/service/pricing' text={t('pricing')} />
      </Menu>

      <MenuListDropdown pr='0' text={t('about-us')}>
        <MenuListItem link='/about/about' text={t('toto-and-team')} />
        <MenuListItem link='/about/feedback' text={t('feedback')} />
        <MenuListItem link='/about/sustainability' text={t('sustainability')} />
      </MenuListDropdown>
    </Box>
  );
};

export default HeaderMenu;
