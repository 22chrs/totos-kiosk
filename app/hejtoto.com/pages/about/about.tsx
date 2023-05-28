import PageLayout from '@/components/page-layout';

import { Text } from '@chakra-ui/react';

import { StandardPage } from '@/components/page-layout/padding';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <PageLayout title='Impressum' description='Impressum von Hej Toto.'>
      <StandardPage heading='Über uns'>
        <Text>Comming. Soon.</Text>
      </StandardPage>
    </PageLayout>
  );
};

export default About;
