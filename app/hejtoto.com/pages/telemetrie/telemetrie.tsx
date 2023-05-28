import PageLayout from '@/components/page-layout';
import {
  Button,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from '@chakra-ui/react';

import ProgressBar from '@/components/analytics/Progress';
import { StandardPage } from '@/components/page-layout/padding';
import {
  DisplayAutomatData,
  InitializeButton,
  RefillButton,
} from '@/firebase/Automaten';
import { AutomatLeipzig } from '@/firebase/Interface';
import { useTranslation } from 'react-i18next';
import { FaCircle } from 'react-icons/fa';

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
        <InitializeButton customAutomat={AutomatLeipzig} />
        <RefillButton />

        <DisplayAutomatData />
        <HStack>
          <Icon fontSize='md' color='green.400' as={FaCircle} />
          <Text>Online</Text>
          <Text>[online seit: 5d, 12h, 21min]</Text>
        </HStack>

        <Stack spacing={1}>
          <ProgressBar
            name='Einwegbecher'
            value={10}
            maxValue={250}
            valueName='cups'
            unit='Stück'
          />
          <ProgressBar
            valueName='cups'
            name='Einwegdeckel'
            value={10}
            maxValue={250}
            unit='Stück'
          />
          <ProgressBar
            valueName='cups'
            name='Mehrwegbecher'
            value={10}
            maxValue={250}
            unit='Stück'
          />
          <ProgressBar
            valueName='cups'
            name='Einwegdeckel'
            value={10}
            maxValue={250}
            unit='Stück'
          />
          <ProgressBar
            valueName='cups'
            name='Kaffebohnen'
            value={10}
            maxValue={250}
            unit='kg'
          />
          <ProgressBar
            valueName='cups'
            name='Abwasser'
            value={10}
            maxValue={250}
            unit='l'
          />
          <ProgressBar
            valueName='cups'
            name='Frischwasser'
            value={10}
            maxValue={250}
            unit='l'
          />
          <ProgressBar
            valueName='cups'
            name='Snack A'
            value={10}
            maxValue={250}
            unit='Stück'
          />
        </Stack>
      </StandardPage>
    </PageLayout>
  );
};

export default Telemetrie;
