import { Box, Container, ContainerProps } from '@chakra-ui/react';
import { Variants, motion } from 'framer-motion';
import { NextSeo } from 'next-seo';
import { ReactNode } from 'react';

type PageProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

const PageLayout = ({ title, description, children }: PageProps) => {
  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: -30,
      y: 0,
      transition: { duration: 0.3, ease: 'easeIn' },
    },
    enter: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 1.0, ease: 'easeIn' },
    },
    exit: {
      opacity: 0,
      x: -50,
      y: 0,
      transition: { duration: 1.3, ease: 'easeIn' },
    },
  };

  return (
    <>
      <NextSeo
        title={title + ' | Hej Toto'}
        description={description}
        twitter={{
          cardType: 'summary_large_image',
          handle: '@hejtoto',
        }}
        openGraph={{
          url: 'https://www.hejtoto.com',
          title: title + ' | Hej Toto',
          description: description,
          locale: 'de_DE',
          images: [
            {
              url: 'https://www.hejtoto.com/assets/images/03.png',
              width: 500,
              height: 500,
              alt: 'Hej Toto',
              type: 'image/png',
            },
          ],
        }}
        additionalLinkTags={[
          {
            rel: 'icon',
            href: 'https://www.hejtoto.com/favicon.ico',
          },
        ]}
      />
      <Box
        display='flex'
        maxW='100%'
        w='100%'
        minH={{ base: 'auto', md: '100vh' }}
        //px={{ base: 4, lg: 8 }}
        px='0'
      >
        {children}
      </Box>
    </>
  );
};

export default PageLayout;
