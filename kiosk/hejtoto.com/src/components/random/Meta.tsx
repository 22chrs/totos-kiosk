import { Badge } from '@chakra-ui/react';
import styled from '@emotion/styled';

export const Meta = ({ children }) => (
  <Badge colorScheme='green' mr={2}>
    {children}
  </Badge>
);

export const MetaBild = ({ children }) => (
  <Badge colorScheme='purple' mr={2}>
    {children}
  </Badge>
);

export const P = styled.p`
  text-align: justify;
`;

export const P2 = styled.p`
  text-align: justify;
  padding-left: 1em;
`;
