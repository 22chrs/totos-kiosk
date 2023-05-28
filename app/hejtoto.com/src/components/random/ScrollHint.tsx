import { Stack } from '@chakra-ui/react';
import styled from '@emotion/styled';

import { useEffect, useState } from 'react';

// Custom hook to detect overflow
const useOverflow = (ref) => {
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      setIsOverflowing(element.scrollHeight > element.clientHeight);
    }
  }, [ref]);

  return isOverflowing;
};

// Define a new styled component
export const ScrollFade = styled(Stack)`
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 15rem;
    background: linear-gradient(to top, #f5f2ed, rgba(0, 0, 0, 0));
    pointer-events: none;
  }
`;
