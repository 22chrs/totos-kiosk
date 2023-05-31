import { Box, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getLastOrder } from './dbFunctionsBestellungen';

export const DisplayLatestOrderRawData = ({ automatenID }) => {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const latestOrder = await getLastOrder(automatenID);
      setOrder(latestOrder);
    }, 1000); // Fetch new data every second

    return () => clearInterval(intervalId); // Clean up on unmount
  }, [automatenID]); // Only re-run the effect if automatenID changes

  return (
    <Box
      color={useColorModeValue(
        'footerBGColor.lightMode',
        'footerBGColor.darkMode'
      )}
      bgColor={useColorModeValue(
        'primaryHeadingColor.lightMode',
        'primaryHeadingColor.darkMode'
      )}
      fontSize='0.8rem'
      borderRadius='lg'
      whiteSpace='pre-wrap'
      wordBreak='break-all'
      overflowX='auto'
      p='5'
    >
      {JSON.stringify(order, null, 2)}
    </Box>
  );
};
