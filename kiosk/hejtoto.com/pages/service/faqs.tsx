import PageLayout from '@/components/page-layout';
import { StandardPage } from '@/components/page-layout/padding';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  chakra,
  Heading,
} from '@chakra-ui/react';
import NextImage from 'next/image';
import { useTranslation } from 'react-i18next';

const CustomImage = chakra(NextImage, {
  baseStyle: {
    borderRadius: 'lg',
    boxShadow: 'lg',
  },
  shouldForwardProp: (prop) => ['src', 'alt', 'width', 'height'].includes(prop),
});

const IndexPage = () => {
  const { t } = useTranslation();

  return (
    <PageLayout title='FAQs' description=''>
      <StandardPage heading='Frequently Asked Questions'>
        <Box minW='70vw' pb='8vh'>
          <Accordion>
            <AccordionItem>
              <AccordionButton>
                <Box as='span' flex='1' textAlign='left'>
                  <Heading variant='h2'>
                    What is the <i>Hej Toto</i> Premium Vending Machine?
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                The <i>Hej Toto</i> Premium Vending Machine is a
                state-of-the-art beverage vending machine that uses an advanced
                robotic arm technology to prepare high-quality barista-style
                coffee and other beverages.
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <AccordionButton>
                <Box as='span' flex='1' textAlign='left'>
                  <Heading variant='h2'>
                    What are the benefits of using our vending machine?
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                The vending machine offers numerous benefits, including
                efficient and intelligent automation, 24/7 operation, shorter
                wait times for customers, consistent premium-quality beverages,
                and adherence to all hygiene guidelines. It also promotes
                sustainability, ethical and responsible business practices, and
                community engagement. And the best: You will always receive
                premium barista-quality beverages, just like those handcrafted
                at your favorite local coffee shop.
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <AccordionButton>
                <Box as='span' flex='1' textAlign='left'>
                  <Heading variant='h2'>
                    What is the design and show aspect of the <i>Hej Toto</i>{' '}
                    vending machine?
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                The vending machine has a unique and futuristic design that
                creates an attractive and appealing ambiance. It also
                incorporates social media integration to encourage customers to
                share their positive experiences.
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <AccordionButton>
                <Box as='span' flex='1' textAlign='left'>
                  <Heading variant='h2'>
                    What types of beverages are available?
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                The vending machine offers a diverse range of premium-quality
                beverages, including barista-style coffee, individualized drink
                options, local ingredients, and sustainable and vegan snack
                options.
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <AccordionButton>
                <Box as='span' flex='1' textAlign='left'>
                  <Heading variant='h2'>
                    How is the vending machine customizable and adaptable?
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                The robotic arm technology used in our vending machine can be
                modified and adjusted to accommodate various applications and
                uses, making it highly adaptable and versatile. Take out the
                coffee machine, hello ice machine. Leave us a message, if you
                have custon use cases.
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <AccordionButton>
                <Box as='span' flex='1' textAlign='left'>
                  <Heading variant='h2'>
                    How does your vending machine promote sustainability?
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                Our vending machine promotes sustainability by offering reusable
                cup options, using only plant-based milk alternatives,
                incorporating local ingredients and suppliers, and adopting
                ethical and responsible business practices.
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <AccordionButton>
                <Box as='span' flex='1' textAlign='left'>
                  <Heading variant='h2'>
                    How is the <i>Hej Toto</i> vending machine user-friendly?
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                The <i>Hej Toto</i> vending machine has a multilingual user
                interface for international customers and is designed to be
                accessible for people with disabilities.
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <AccordionButton>
                <Box as='span' flex='1' textAlign='left'>
                  <Heading variant='h2'>
                    How does your vending machine support business growth and
                    innovation?
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                The <i>Hej Toto</i> vending machine has a scalable business
                model that can support future growth, and incorporates data
                analytics to continuously improve customer service. It also
                partners with technology and education institutions to promote
                innovation and fosters partnerships with sustainable and vegan
                brands to promote sustainability.
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <AccordionButton>
                <Box as='span' flex='1' textAlign='left'>
                  <Heading variant='h2'>
                    Is it possible to use your vending machine for events or to
                    support local stores?
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                Our vending machine can be used to support local events and
                initiatives, fostering a sense of community and positive brand
                image. It also incorporates social media integration to
                encourage customers to share their experiences and further
                promote the brand.
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      </StandardPage>
    </PageLayout>
  );
};

// Q: What is the "Hej Toto" Premium Vending Machine?
// A: The "Hej Toto" Premium Vending Machine is a state-of-the-art beverage vending machine that uses an advanced robotic arm technology to prepare high-quality barista-style coffee and other beverages.

// Q: What are the benefits of using the "Hej Toto" vending machine?
// A: The "Hej Toto" vending machine offers numerous benefits, including efficient and intelligent automation, 24/7 operation, shorter wait times for customers, consistent premium-quality beverages, and adherence to all hygiene guidelines. It also promotes sustainability, ethical and responsible business practices, and community engagement.

// Q: What is the design and show aspect of the "Hej Toto" vending machine?
// A: The "Hej Toto" vending machine has a unique and futuristic design that creates an attractive and appealing ambiance. It also incorporates social media integration to encourage customers to share their positive experiences.

// Q: What types of beverages are available from the "Hej Toto" vending machine?
// A: The "Hej Toto" vending machine offers a diverse range of premium-quality beverages, including barista-style coffee, individualized drink options, local ingredients, and sustainable and vegan snack options.

// Q: How is the "Hej Toto" vending machine customizable and adaptable?
// A: The robotic arm technology used in the "Hej Toto" vending machine can be modified and adjusted to accommodate various applications and uses, making it highly adaptable and versatile.

// Q: How does the "Hej Toto" vending machine promote sustainability?
// A: The "Hej Toto" vending machine promotes sustainability by offering reusable cup options, using only plant-based milk alternatives, incorporating local ingredients and suppliers, and adopting ethical and responsible business practices.

// Q: How is the "Hej Toto" vending machine user-friendly?
// A: The "Hej Toto" vending machine has a multilingual user interface for international customers and is designed to be accessible for people with disabilities.

// Q: How does the "Hej Toto" vending machine support business growth and innovation?
// A: The "Hej Toto" vending machine has a scalable business model that can support future growth, and incorporates data analytics to continuously improve customer service. It also partners with technology and education institutions to promote innovation and fosters partnerships with sustainable and vegan brands to promote a sustainable image.

// Q: How can the "Hej Toto" vending machine be used to support community engagement?
// A: The "Hej Toto" vending machine can be used to support local events and initiatives, fostering a sense of community and positive brand image. It also incorporates social media integration to encourage customers to share their experiences and further promote the brand.

export default IndexPage;
