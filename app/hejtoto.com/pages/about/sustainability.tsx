import PageLayout from '@/components/page-layout';
import { Text } from '@chakra-ui/react';

import { StandardPage } from '@/components/page-layout/padding';
import { useTranslation } from 'react-i18next';

const Sustainability = () => {
  const { t } = useTranslation();

  return (
    <PageLayout title='Nachhaltigkeit' description=''>
      <StandardPage heading='Nachhaltigkeit'>
        <Text>
          „Hej Toto“ verpflichtet sich, das Leben durch nachhaltige und
          innovative Automatenlösungen zu verbessern und einen positiven Wandel
          in der Branche voranzutreiben. Unsere Werte basieren auf ökologischer
          Nachhaltigkeit, sozialem Engagement, regionaler Zusammenarbeit,
          Usability und Zugänglichkeit. Unsere Automaten sind darauf ausgelegt,
          ökologische Nachhaltigkeit zu fördern, indem wir stets eine
          Mehrwegbecher-Alternative zum Einwegbecher anbieten. In Zusammenarbeit
          mit unserem Partner „reCup“, dem größten Mehrwegsystem in Deutschland,
          streben wir perspektivisch an, ausschließlich umweltfreundliche
          Mehrweglösungen bereitzustellen. Als Unternehmen möchten wir in der
          Automatenbranche etabliert und nachhaltig agieren. Unser Ziel ist es,
          ein attraktiver Arbeitgeber in der Region Leipzig zu sein und die
          lokale Unternehmerkultur zu stärken. Dies spiegelt sich auch in
          unserer Entscheidung wider, bei der Umsetzung unseres ersten Produktes
          auf regionale Partner zu setzen und unseren Automaten „Hej Toto“ als
          „Made in Germany“ zu präsentieren. Durch die Verbindung von digitaler
          Innovation und ökologischer Nachhaltigkeit ist es unser Bestreben, den
          Umweltschutz und die Lebensqualität in den Vordergrund zu stellen. Wir
          sind stolz darauf, einer Branche, die Erneuerung benötigt, einen
          frischen Wind zu verleihen und gleichzeitig verantwortungsbewusst
          gegenüber Umwelt und Gesellschaft zu handeln. Mit „Hej Toto“ setzen
          wir uns für eine bessere, nachhaltigere und lebenswertere Zukunft ein.
          Bei dem gesamten Automaten legen wir großen Wert auf Usability und
          Zugänglichkeit. Das Bestellinterface ist selbsterklärend, und
          mehrsprachig aufgebaut. Zugleich achten wir auf einen barrierefreien
          Zugang, beispielsweise in Bezug auf Höhe und Rollstuhlzugänglichkeit.
          Somit schaffen wir ein inklusives Erlebnis, das für ein breites
          Publikum zugänglich ist.
        </Text>
      </StandardPage>
    </PageLayout>
  );
};

export default Sustainability;
