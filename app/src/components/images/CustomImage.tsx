import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const MotionBox = motion(Box);

export const CustomImage = ({ src, alt, width, height }) => {
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <MotionBox
      borderRadius='1.2rem'
      boxShadow='xl'
      overflow='hidden'
      initial='initial'
      animate='animate'
      variants={fadeIn}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={70}
        placeholder='empty'
      />
    </MotionBox>
  );
};
