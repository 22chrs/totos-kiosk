// components/BackgroundImage.tsx

import { Box } from '@chakra-ui/react';
import React from 'react';

interface BackgroundImageProps {
  imageUrl: string;
  children: React.ReactNode;
  minHeight?: string;
}

export const BackgroundImage: React.FC<BackgroundImageProps> = ({
  imageUrl,
  children,
  minHeight = '100vh',
}) => {
  return (
    <Box
      bgImage={`url(${imageUrl})`}
      bgPosition='center'
      bgRepeat='no-repeat'
      bgSize='cover'
      minHeight={minHeight}
      width='100%'
    >
      {children}
    </Box>
  );
};
