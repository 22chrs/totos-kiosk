import { Container, ContainerProps } from '@chakra-ui/react';
import { motion, Variants } from 'framer-motion';
import { NextSeo } from 'next-seo';
import { ReactNode } from 'react';

const variants: Variants = {
  hidden: {
    opacity: 0,
    x: 0,
    y: -40,
    transition: { duration: 0.4, type: 'easeOut' },
  },
  enter: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.4, type: 'easeOut' },
  },
  exit: {
    opacity: 0,
    x: -0,
    y: 40,
    transition: { duration: 0.4, type: 'easeOut' },
  },
};

type PageProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

const MotionContainer = motion<ContainerProps>(Container);

const PageLayout = ({ title, description, children }: PageProps) => {
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
      <MotionContainer
        display='flex'
        maxW='100%'
        w='100%'
        minH={{ base: 'auto', md: '100vh' }}
        //px={{ base: 4, lg: 8 }}
        px='0'
        initial='hidden'
        animate='enter'
        exit='exit'
        variants={variants}
        centerContent
      >
        {children}
      </MotionContainer>
    </>
  );
};

export default PageLayout;