import PageLayout from '@/components/page-layout';
import { Text } from '@chakra-ui/react';

import { StandardPage } from '@/components/page-layout/padding';
import { useTranslation } from 'react-i18next';

const Feedback = () => {
  const { t } = useTranslation();

  return (
    <PageLayout title='Feedback' description=''>
      <StandardPage heading='Kritik? Ideen? Feedback? Teile es mit uns!'>
        <Text>hej@hejtoto.com</Text>
      </StandardPage>
    </PageLayout>
  );
};

export default Feedback;
