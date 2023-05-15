//kiosk.tsx

import { FooterMainPage } from '@/components/layout/menuKiosk/footer';

import PageLayout from '@/components/page-layout/pageLayoutKiosk';
import { DisplayContext } from '@/providers/DisplayContext';

import Shop from '@/components/kiosk/shop/Shop';
import { HeaderMainPage } from '@/components/layout/menuKiosk/header';
import { useLayoutContext } from '@/providers/LayoutContext';
import shopData from '@/public/kiosk/products/leipzig.json';
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
    <>
      <PageLayout title={t('kiosk')} description=''>
        <Shop
          data={shopData.products}
          country={shopData.country}
          currency={shopData.currency}
        />
      </PageLayout>
    </>
  );
};

export default Kiosk;
