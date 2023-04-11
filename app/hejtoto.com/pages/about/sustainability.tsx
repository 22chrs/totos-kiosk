import PageLayout from '@/components/page-layout';
import { Text } from '@chakra-ui/react';

import { StandardPage } from '@/components/page-layout/padding';
import { useTranslation } from 'react-i18next';

const Sustainability = () => {
  const { t } = useTranslation();

  return (
    <PageLayout title='Nachhaltigkeit' description=''>
      <StandardPage heading='Nachhaltigkeit'>
        <Text>Hallo.</Text>
      </StandardPage>
    </PageLayout>
  );
};

export default Sustainability;
