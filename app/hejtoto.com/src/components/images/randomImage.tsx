import { Box, chakra } from '@chakra-ui/react';
import NextImage from 'next/image';

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
    ['src', 'alt', 'width', 'height', 'quality', 'layout'].includes(prop),
});

export const CustomImage2 = ({ src, alt }) => {
  return (
    <Box borderRadius='1.2rem' boxShadow='xl' overflow='hidden'>
      <NextImage
        width='700'
        placeholder='empty'
        height='700'
        alt={alt}
        priority
        quality={70}
        src={src}
      />
    </Box>
  );
};
