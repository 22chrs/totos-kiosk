import { DisplayContext } from '@/providers/DisplayContext';
import { chakra } from '@chakra-ui/react';
import NextLink, { type LinkProps as NextLinkProps } from 'next/link';
import { useContext } from 'react';

// wrap the NextLink with Chakra UI's factory function
const ChakraLink = chakra<typeof NextLink, NextLinkProps>(NextLink, {
  // ensure that you're forwarding all of the required props for your case
  shouldForwardProp: (prop) => ['href', 'target', 'children'].includes(prop),
});

export const MagicLink = (props) => {
  const { displayNumber } = useContext(DisplayContext);

  // Modify the href to include the display query parameter
  const hrefWithDisplay = `${props.href}?display=${displayNumber}`;

  return (
    <ChakraLink {...props} href={hrefWithDisplay}>
      {props.children}
    </ChakraLink>
  );
};
