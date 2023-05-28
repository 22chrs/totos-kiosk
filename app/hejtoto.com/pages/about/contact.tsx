import PageLayout from '@/components/page-layout';
import { Text } from '@chakra-ui/react';

import { StandardPage } from '@/components/page-layout/padding';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();

  return (
    <PageLayout title='Kontakt' description=''>
      <StandardPage heading='Noch Fragen? Kontaktiere uns!'>
        <Text>hej@hejtoto.com</Text>
      </StandardPage>
    </PageLayout>
  );
};

export default Contact;
