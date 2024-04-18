import { Container, ContainerProps } from '@chakra-ui/react';
import { motion, Variants } from 'framer-motion';

const variants: Variants = {
  hidden: {
    opacity: 0,
    x: 0,
    y: 0,
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
    x: 0,
    y: 0,
    transition: { duration: 0.4, type: 'easeOut' },
  },
};

const MotionContainer = motion<ContainerProps>(Container);

export const AnimationContainer = ({ children }) => {
  return (
    <>
      {/* <MotionContainer
        //display='flex'
        //maxW='container.lg'
        //minH={{ base: 'auto', md: '100vh' }}
        //px={{ base: 4, lg: 8 }}
        initial='hidden'
        animate='enter'
        exit='exit'
        variants={variants}
        //centerContent
      > */}
      {children}
      {/* </MotionContainer> */}
    </>
  );
};
