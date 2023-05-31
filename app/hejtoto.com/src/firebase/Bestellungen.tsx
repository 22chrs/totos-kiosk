import { Item } from '@/firebase/Interface';
import { formatISO } from 'date-fns';

import { Box, Button, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getLastOrder } from './dbFunctionsBestellungen';

// Order data
const orderData: Item = {
  timeStampOrder: formatISO(new Date()),
  automatenID: 'Automat_1',
  orderStatus: 'success',

  productName: 'Coffee',
  categoryName: 'Drinks',

  choosenSize: 'Large',
  choosenSugar: 'Low',
  choosenMug: 'Normal',
  choosenLid: 'Yes',
  choosenMilc: 'Regular',
  calculatedPrice: 4.5,

  displayNumber: '1',
  discount: 0,

  quantity: 1,
};

export const FakeOrderButton = ({ automatenID }) => {
  const handleClick = async () => {
    // Order data
    const orderData: Item = {
      timeStampOrder: formatISO(new Date()),
      automatenID: automatenID,
      orderStatus: 'success',

      productName: 'Coffee2',
      categoryName: 'Drinks',

      choosenSize: 'Large',
      choosenSugar: 'Low',
      choosenMug: 'Normal',
      choosenLid: 'Yes',
      choosenMilc: 'Regular',
      calculatedPrice: 4.5,

      displayNumber: '1',
      discount: 0,

      quantity: 1,
    };
    //await addNewOrder(automatenID, orderData);
  };

  return (
    <Button colorScheme='blue' onClick={handleClick}>
      Add Order
    </Button>
  );
};

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
