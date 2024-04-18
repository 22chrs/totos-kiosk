import {
  getLastSentData,
  refillAndSendAutomatData,
  setAndInitAutomatData,
} from '@/firebase/dbFunctionsAutomaten';
import {
  Box,
  Button,
  HStack,
  Heading,
  Progress,
  SimpleGrid,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { saveOrdersToAutomat } from './dbFunctionsBestellungen';

export const AutomatTerminalData = ({ automatenID }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const newData = await getLastSentData(automatenID);
      setData(newData);
    }, 1000);

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, [automatenID]);

  return (
    <>
      <Heading py='5'>Automat raw data:</Heading>
      <Box
        color={useColorModeValue(
          'footerBGColor.lightMode',
          'primaryFontColor.darkMode'
        )}
        bgColor={useColorModeValue(
          'primaryHeadingColor.lightMode',
          'footerBGColor.darkMode'
        )}
        fontSize='md'
        borderRadius='lg'
        whiteSpace='pre-wrap'
        wordBreak='break-all'
        height='40vh'
        overflowX='scroll'
        p='5'
      >
        {JSON.stringify(data, null, 2)}
      </Box>
    </>
  );
};

export const AutomatDisplayStats = ({ automatenID, columns }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const newData = await getLastSentData(automatenID);
      setData(newData);
    }, 1000);

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, [automatenID]);

  const color = useColorModeValue(
    'primaryHeadingColor.darkMode',
    'primaryHeadingColor.lightMode'
  );

  const bgColor = useColorModeValue(
    'footerBGColor.lightMode',
    'footerBGColor.darkMode'
  );

  return (
    <SimpleGrid columns={columns} spacing={6}>
      {data &&
        Object.keys(data).map((category) => {
          if (typeof data[category] === 'object' && data[category] !== null) {
            let products = Object.keys(data[category]);
            let nonEmptyProducts = products.filter((product) => {
              let productCapacity = data[category][product].capacity;
              return productCapacity !== 0 && productCapacity !== undefined;
            });

            if (nonEmptyProducts.length === 0) {
              return null; // Skip this category if there's no product with capacity
            }

            return (
              <Box
                key={category}
                borderRadius='lg'
                p='5'
                overflow='hidden'
                color={color}
                bgColor={bgColor}
              >
                <Heading size='md'>{category}</Heading>
                {nonEmptyProducts.map((product) => {
                  let productCapacity = data[category][product].capacity;
                  let productCurrent = data[category][product].current;
                  let productPercentage =
                    (productCurrent / productCapacity) * 100;

                  return (
                    <Box mt={5} key={product}>
                      <Text>
                        {data[category][product].displayName}: [{productCurrent}
                        /{productCapacity} {data[category][product].unit}]
                      </Text>
                      <Progress colorScheme='purple' value={productPercentage}>
                        {data[category][product].displayName}: {productCurrent}/
                        {productCapacity}
                      </Progress>
                    </Box>
                  );
                })}
              </Box>
            );
          }
          return null;
        })}
    </SimpleGrid>
  );
};

export const ButtonsAutomat = ({ automatenVariant, autmatenID }) => {
  const bgColor = useColorModeValue(
    'footerBGColor.lightMode',
    'footerBGColor.darkMode'
  );

  const onClickHandler = () => {
    saveOrdersToAutomat(autmatenID);
    //refillAndSendAutomatData(currentState);

    // If currentState is not null, update the automat data in Firebase
  };

  return (
    <VStack
      borderRadius='lg'
      overflow='hidden'
      p='5'
      h='100%'
      w='100%'
      bgColor={bgColor}
    >
      <Button
        colorScheme='purple'
        w='full'
        onClick={() => setAndInitAutomatData(automatenVariant)}
      >
        Initialize Automat
      </Button>
      <Button
        colorScheme='purple'
        w='full'
        onClick={() => refillAndSendAutomatData(automatenVariant)}
      >
        Refill & Messure Automat
      </Button>
      <Button colorScheme='purple' w='full' onClick={onClickHandler}>
        Get orders from database
      </Button>
    </VStack>
  );
};

export const AutomatStatusData = ({ automatenID }) => {
  const [data, setData] = useState(null);

  const bgColor = useColorModeValue(
    'footerBGColor.lightMode',
    'footerBGColor.darkMode'
  );

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const newData = await getLastSentData(automatenID);
      setData(newData);
    }, 1000);

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, [automatenID]);

  if (!data) {
    return null; // You may want to return a loading spinner here
  }

  return (
    <Box borderRadius='lg' overflow='hidden' p='5' w='100%' bgColor={bgColor}>
      <Text>ID Automat: {data.AutomatConstants.automatenID}</Text>
      <HStack>
        <Text>
          Location: {data.AutomatConstants.country} (
          {data.AutomatConstants.currency}
          ),
          {data.AutomatConstants.city}, {data.AutomatConstants.location}
        </Text>
      </HStack>
      <HStack>
        <Text> Status: {data.status},</Text>
        <Text>(Last ping: {data.lastPing})</Text>
      </HStack>
      <Text>Error messages: {data.error}</Text>
      <Text>Last Refill: {data.lastRefillDate}</Text>
    </Box>
  );
};
