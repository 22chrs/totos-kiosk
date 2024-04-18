import { Box, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import NextImage from 'next/image';

import { useEffect, useState } from 'react';

const MotionBox = motion(Box);

export const randomImagesBox = () =>
  `/assets/images/midjourney/${String(
    Math.floor(Math.random() * 33) + 1
  ).padStart(2, '0')}.jpg`;

export const randomImagesBestBox = () =>
  `/assets/images/BestMidjourney/${String(
    Math.floor(Math.random() * 8) + 1
  ).padStart(2, '0')}.jpg`;

export const randomImagesArm = () =>
  `/assets/images/robotarm/${String(Math.floor(Math.random() * 3) + 1).padStart(
    2,
    '0'
  )}.jpg`;

export const RandomImage = ({ src, alt }) => {
  const [key, setKey] = useState(0);
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
  };

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [src]);

  return (
    <MotionBox
      key={key}
      boxShadow='xl'
      initial='initial'
      animate='animate'
      variants={fadeIn}
      borderRadius='1.2rem'
      bgColor={useColorModeValue(
        'footerBGColor.lightMode',
        'footerBGColor.darkMode'
      )}
    >
      <Box borderRadius='1.2rem' overflow='hidden'>
        <NextImage
          width='700'
          height='700'
          alt={alt}
          quality={70}
          src={src}
          priority
        />
      </Box>
    </MotionBox>
  );
};

export const SimpleImage = ({ src, alt }) => {
  const [key, setKey] = useState(0);
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <MotionBox
      key={key}
      boxShadow='xl'
      initial='initial'
      animate='animate'
      variants={fadeIn}
      borderRadius='1.2rem'
      bgColor={useColorModeValue(
        'footerBGColor.lightMode',
        'footerBGColor.darkMode'
      )}
    >
      <Box borderRadius='1.2rem' overflow='hidden'>
        <NextImage
          width='700'
          height='700'
          alt={alt}
          quality={70}
          src={src}
          priority
        />
      </Box>
    </MotionBox>
  );
};

// import { Box, useColorMode, useColorModeValue } from '@chakra-ui/react';
// import { motion } from 'framer-motion';
// import NextImage from 'next/image';

// import { useEffect, useState } from 'react';

// const MotionBox = motion(Box);
// const MotionNextImage = motion(NextImage);

// export const randomImagesBox = () =>
//   `/assets/images/midjourney/${String(
//     Math.floor(Math.random() * 33) + 1
//   ).padStart(2, '0')}.jpg`;

// export const randomImagesArm = () =>
//   `/assets/images/robotarm/${String(Math.floor(Math.random() * 3) + 1).padStart(
//     2,
//     '0'
//   )}.jpg`;

// export const RandomImage = ({ src, alt }) => {
//   const [key, setKey] = useState(0);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const { colorMode } = useColorMode();
//   const fadeIn = {
//     initial: { opacity: 0 },
//     animate: { opacity: 1, transition: { duration: 0.3 } },
//   };

//   useEffect(() => {
//     setKey((prevKey) => prevKey + 1);
//     setIsLoaded(false);
//   }, [src]);

//   const handleLoadingComplete = () => {
//     setIsLoaded(true);
//   };

//   return (
//     <MotionBox
//       key={key}
//       borderRadius='1.2rem'
//       boxShadow='xl'
//       overflow='hidden'
//       initial='initial'
//       animate='animate'
//       variants={fadeIn}
//       bgColor={useColorModeValue(
//         'footerBGColor.lightMode',
//         'footerBGColor.darkMode'
//       )}
//     >
//       <MotionNextImage
//         width='700'
//         height='700'
//         alt={alt}
//         quality={70}
//         src={src}
//         priority
//         onAnimationComplete={handleLoadingComplete}
//         initial={isLoaded ? 'initial' : 'animate'}
//         animate={isLoaded ? 'animate' : 'initial'}
//         variants={fadeIn}
//       />
//     </MotionBox>
//   );
// };
