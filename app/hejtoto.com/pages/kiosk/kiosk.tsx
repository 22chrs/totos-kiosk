//kiosk.tsx

import PageLayout from '@/components/page-layout';
import { DisplayContext } from '@/providers/DisplayContext';
import { Text } from '@chakra-ui/react';

import { StandardPage } from '@/components/page-layout/padding';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

const Kiosk = () => {
  const { t } = useTranslation();
  const { displayNumber } = useContext(DisplayContext);

  return (
    <PageLayout title='Jobs' description=''>
      <StandardPage heading='Kiosk'>
        <Text variant='logo'>
          {displayNumber === '1'
            ? 'Display 1 attached.'
            : displayNumber === '2'
            ? 'Display 2 attached.'
            : 'Error Display'}
        </Text>
      </StandardPage>
    </PageLayout>
  );
};

export default Kiosk;
