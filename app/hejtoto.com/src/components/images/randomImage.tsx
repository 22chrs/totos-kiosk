import { Box, Container, ContainerProps, chakra } from '@chakra-ui/react';
import { Variants, motion } from 'framer-motion';
import NextImage from 'next/image';
import { useEffect, useState } from 'react';

const MotionContainer = motion<ContainerProps>(Container);

export const randomImagesBox = () =>
  `/assets/images/midjourney/${String(
    Math.floor(Math.random() * 33) + 1
  ).padStart(2, '0')}.jpg`;

export const randomImagesArm = () =>
  `/assets/images/robotarm/${String(Math.floor(Math.random() * 3) + 1).padStart(
    2,
    '0'
  )}.jpg`;

export const CustomImage = chakra(NextImage, {
  baseStyle: {
    borderRadius: 'xl',
    boxShadow: 'xl',
    border: '0px',
    borderColor: 'transparent',
    placeholder: 'empty',
  },

  shouldForwardProp: (prop) =>
    ['src', 'alt', 'width', 'height', 'quality', 'layout', 'onLoad'].includes(
      prop
    ),
});

export const RandomImage = ({ src, alt }) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [key, setKey] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const variantsImg: Variants = {
    hidden: {
      opacity: 0,
      x: 0,
      y: 0,
      transition: { duration: 0.5, ease: 'easeIn' },
    },
    enter: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.5, ease: 'easeIn' },
    },
  };

  useEffect(() => {
    setImageSrc(src);
    setKey((prevKey) => prevKey + 1);
    setIsLoaded(false);
  }, [src]);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <MotionContainer
      display='flex'
      maxW='100%'
      w='100%'
      minH={{ base: 'auto', md: '100vh' }}
      px='0'
      initial='hidden'
      animate={isLoaded ? 'enter' : 'hidden'}
      variants={variantsImg}
      centerContent
      key={key}
    >
      <Box borderRadius='1.2rem' boxShadow='xl' overflow='hidden'>
        <CustomImage
          width='700'
          placeholder='empty'
          height='700'
          alt={alt}
          priority
          quality={70}
          src={imageSrc}
          onLoad={handleImageLoad}
        />
      </Box>
    </MotionContainer>
  );
};
