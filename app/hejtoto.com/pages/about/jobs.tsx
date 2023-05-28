import PageLayout from '@/components/page-layout';
import { Text } from '@chakra-ui/react';

import { MagicLink } from '@/components/links/CustomLink';
import { StandardPage } from '@/components/page-layout/padding';
import NextLink from 'next/link';
import { useTranslation } from 'react-i18next';

const Jobs = () => {
  const { t } = useTranslation();

  return (
    <PageLayout title='Jobs' description=''>
      <StandardPage heading='Jobs'>
        <Text>Hallo.</Text>
        <MagicLink as={NextLink} href='/kiosk/'>
          Kiosk
        </MagicLink>
      </StandardPage>
    </PageLayout>
  );
};

export default Jobs;
