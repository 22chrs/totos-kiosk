import PageLayout from '@/components/page-layout';
import { Box, HStack, Spacer } from '@chakra-ui/react';

import { StandardPage } from '@/components/page-layout/padding';
import {
  AutomatDisplayStats,
  AutomatStatusData,
  AutomatTerminalData,
  ButtonsAutomat,
} from '@/firebase/Automaten';
import { DisplayLatestOrderRawData } from '@/firebase/Bestellungen';
import { AutomatVariant_1 } from '@/firebase/Interface';
import { useTranslation } from 'react-i18next';

import shopData from '@/public/kiosk/products/leipzig.json';
const automatenID = shopData.automatenID;

const Telemetrie = () => {
  const { t } = useTranslation();

  return (
    <PageLayout title='Telemetriedaten' description='Telemetriedaten'>
      <StandardPage heading='Telemetriedaten Automat'>
        <HStack align='start' gap='5'>
          <Box w='70%'>
            <AutomatStatusData automatenID={automatenID} />
          </Box>

          <HStack p='0' h='100%'>
            <ButtonsAutomat
              automatenVariant={AutomatVariant_1()}
              autmatenID={automatenID}
            />
            <Spacer />
          </HStack>
        </HStack>
        <HStack gap='5' align='start' pt='5'>
          <Box w='70%'>
            <AutomatDisplayStats automatenID={automatenID} columns='2' />
            <Box pt='5'>
              <AutomatTerminalData automatenID={automatenID} />
            </Box>
          </Box>
          <Box flex='1'>
            <DisplayLatestOrderRawData automatenID={automatenID} />
          </Box>
        </HStack>
      </StandardPage>
    </PageLayout>
  );
};

export default Telemetrie;
