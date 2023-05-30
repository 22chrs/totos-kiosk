import PageLayout from '@/components/page-layout';
import { Box, HStack } from '@chakra-ui/react';

import { StandardPage } from '@/components/page-layout/padding';
import { DisplayAllData, DisplayData, StatusData } from '@/firebase/Automaten';
import { AutomatVariant_1 } from '@/firebase/Interface';
import { useTranslation } from 'react-i18next';

const Telemetrie = () => {
  const { t } = useTranslation();

  return (
    <PageLayout title='Telemetriedaten' description='Telemetriedaten'>
      <StandardPage heading='Telemetriedaten Automat'>
        <StatusData automatenID={'001'} automatenVariant={AutomatVariant_1} />
        <HStack gap='5' align='start' pt='5'>
          <Box w='70%'>
            <DisplayAllData automatenID={'001'} columns='2' />
          </Box>
          <Box flex='1'>
            <DisplayData automatenID={'001'} />
          </Box>
        </HStack>
      </StandardPage>
    </PageLayout>
  );
};

export default Telemetrie;
