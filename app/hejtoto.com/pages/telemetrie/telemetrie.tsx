import PageLayout from '@/components/page-layout';
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';

import { StandardPage } from '@/components/page-layout/padding';
import {
  AutomatProgressBarContainer,
  DisplayData,
  DisplayData2,
  InitButton,
  RefillButton,
} from '@/firebase/Automaten';
import { useTranslation } from 'react-i18next';

const Telemetrie = () => {
  const { t } = useTranslation();

  return (
    <PageLayout title='Telemetriedaten' description='Telemetriedaten'>
      <StandardPage heading='Wähle Deinen Standort'>
        <Menu>
          <MenuButton as={Button}>Leipzig</MenuButton>
          <MenuList>
            <MenuItem>Leipzig</MenuItem>
            <MenuItem>Leipzig 2</MenuItem>
          </MenuList>
        </Menu>

        <InitButton />
        <RefillButton />
        <AutomatProgressBarContainer automatenID={'001'} />

        <DisplayData automatenID={'001'} />
        <DisplayData2 automatenID={'001'} />
      </StandardPage>
    </PageLayout>
  );
};

export default Telemetrie;
