//kiosk.tsx

import { FooterMainPage } from '@/components/layout/menuKiosk/footer';
import { HeaderMainPage } from '@/components/layout/menuKiosk/header';

import PageLayout from '@/components/page-layout/pageLayoutKiosk';
import { DisplayContext } from '@/providers/DisplayContext';
import { Text } from '@chakra-ui/react';

//import { BackgroundImage } from '@/components/images/Backgroundimage';
import { StandardPage } from '@/components/page-layout/padding';
import { useLayoutContext } from '@/providers/LayoutContext';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Kiosk = () => {
  const { t } = useTranslation();
  const { displayNumber } = useContext(DisplayContext);
  const { setHeader, setFooter } = useLayoutContext();
  useEffect(() => {
    setHeader(<HeaderMainPage />);
    setFooter(<FooterMainPage />);
  }, [setHeader, setFooter]);

  return (
    <PageLayout title={t('kiosk')} description=''>
      <StandardPage heading={t('kiosk')}>
        <Text>
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
