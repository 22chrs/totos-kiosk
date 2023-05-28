import PageLayout from '@/components/page-layout';
import { Text } from '@chakra-ui/react';

import { StandardPage } from '@/components/page-layout/padding';
import { useTranslation } from 'react-i18next';

const Jobs = () => {
  const { t } = useTranslation();

  return (
    <PageLayout title='Jobangebote' description=''>
      <StandardPage heading='Jobs'>
        <Text>Comming.</Text>
      </StandardPage>
    </PageLayout>
  );
};

export default Jobs;
