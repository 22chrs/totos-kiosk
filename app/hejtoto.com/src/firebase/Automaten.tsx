import {
  getLastSentData,
  refillAndSendAutomatData,
  setAndInitAutomatData,
} from '@/firebase/dbFunctions';
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

const getAutomatFields = (): {
  field: string;
  readableName: string;
  unit: string;
}[] => [
  { field: 'status', readableName: 'Status', unit: '' },
  { field: 'lastPing', readableName: 'Last Ping', unit: '' },
  { field: 'lastRefillDate', readableName: 'Last Refill Date', unit: '' },
  { field: 'reuseableCup300', readableName: 'Reusable cups', unit: 'pcs' },
  { field: 'reuseableLid', readableName: 'Reusable lids', unit: 'pcs' },
  {
    field: 'disposableCup300',
    readableName: 'Disposable cups',
    unit: 'pcs',
  },
  { field: 'disposableLid', readableName: 'Disposable lids', unit: 'pcs' },
  { field: 'coffeeBeans', readableName: 'Coffeebeans', unit: 'kg' },
  { field: 'sugar', readableName: 'Sugar', unit: 'kg' },
  { field: 'almondMilk', readableName: 'Almond milk', unit: 'litres' },
  { field: 'freshWater', readableName: 'Fresh water', unit: 'litres' },
  { field: 'wasteWater', readableName: 'Waste water', unit: 'litres' },
];

export const DisplayData = ({ automatenID }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const newData = await getLastSentData(automatenID);
      setData(newData);
    }, 1000);

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, [automatenID]);

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
      {JSON.stringify(data, null, 2)}
    </Box>
  );
};

export const DisplayAllData = ({ automatenID, columns }) => {
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
    <SimpleGrid columns={columns} spacing={5}>
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
                    <Box mt={4} key={product}>
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

export const StatusData = ({ automatenID, automatenVariant }) => {
  const [data, setData] = useState(null);

  // const color = useColorModeValue(
  //   'primaryHeadingColor.darkMode',
  //   'primaryHeadingColor.lightMode'
  // );

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
    <Box borderRadius='lg' overflow='hidden' p='5' bgColor={bgColor}>
      <HStack spacing={0}>
        <VStack alignItems='start' spacing='0' flex={1}>
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
        </VStack>
        <VStack>
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
            Refill Automat
          </Button>
        </VStack>
      </HStack>
    </Box>
  );
};
