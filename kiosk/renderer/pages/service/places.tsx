import PageLayout from '@/components/page-layout';
import { Text } from '@chakra-ui/react';

import { StandardPage } from '@/components/page-layout/padding';
import { useTranslation } from 'react-i18next';

const Places = () => {
  const { t } = useTranslation();

  return (
    <PageLayout title='Orte und Referenzen' description=''>
      <StandardPage heading='Collaborate with Hej Toto'>
        <Text>
          If you own a potential location for <i>Hej Toto</i>, we would love to
          hear from you! We are always searching for new opportunities to
          provide our customers with a convenient and premium coffee and
          beverage experience. With our unique and futuristic approach, we aim
          to install in high-traffic public areas such as airports,
          universities, shopping centers, and event venues. If you own such a
          location or know of one that could benefit from <i>Hej Toto</i>,
          please don&apos;t hesitate to contact us. We look forward to working
          with you to expand <i>Hej Toto&apos;s</i> presence and offer our
          customers an outstanding coffee experience. Thank you for considering
          Hej Toto as a potential addition to your location.
        </Text>
      </StandardPage>
    </PageLayout>
  );
};

export default Places;
