import { AutomatVariant_1 } from '@/firebase/Interface';
import {
  getLastSentData,
  refillAndSendAutomatData,
  setAndInitAutomatData,
} from '@/firebase/dbFunctions';
import { Box, Button, Progress, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export const InitButton = () => {
  return (
    <Button
      colorScheme='teal'
      onClick={() => setAndInitAutomatData(AutomatVariant_1)}
    >
      Initialize Automat
    </Button>
  );
};

export const RefillButton = () => {
  return (
    <Button
      colorScheme='purple'
      onClick={() => refillAndSendAutomatData(AutomatVariant_1)}
    >
      Refill Automat
    </Button>
  );
};

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
// Then in the component:

const AutomatProgressBar = ({ automat }) => {
  const automatFields = getAutomatFields();

  return (
    <VStack spacing={5} align='stretch'>
      {automatFields.map(({ field, readableName, unit }) => {
        const capacityField = `${field}Capacity`;

        // Ensure that the field exists and has a corresponding capacity field in AutomatConstants
        if (
          automat[field] !== undefined &&
          automat.AutomatConstants[capacityField] !== undefined
        ) {
          const fieldUsagePercentage =
            (automat[field] / automat.AutomatConstants[capacityField]) * 100;

          return (
            <Box key={field}>
              <Text>
                {readableName}: ({automat[field]} {unit} /{' '}
                {automat.AutomatConstants[capacityField]} {unit})
              </Text>
              <Progress
                colorScheme='purple'
                size='md'
                value={fieldUsagePercentage}
              />
            </Box>
          );
        }

        // Ignore fields that do not have a corresponding capacity field in AutomatConstants
        return null;
      })}
    </VStack>
  );
};

export const AutomatProgressBarContainer = ({ automatenID }) => {
  // You need to pass the automat ID
  const [automat, setAutomat] = useState(null);

  useEffect(() => {
    const fetchAutomatData = async () => {
      const data = await getLastSentData(automatenID);
      setAutomat(data);
    };

    // Call fetchAutomatData once immediately
    fetchAutomatData();

    // Then set up an interval to call fetchAutomatData every 1000 milliseconds (1 second)
    const intervalId = setInterval(fetchAutomatData, 1000);

    // Return a cleanup function to clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [automatenID]);

  // Render the AutomatProgressBar component only when the data is fetched
  return automat ? (
    <AutomatProgressBar automat={automat} />
  ) : (
    <div>Loading...</div>
  );
};

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
      style={{
        backgroundColor: '#000',
        color: '#0F0',
        fontFamily: 'monospace',
        fontSize: '0.8rem',
        padding: '1rem',
        borderRadius: '5px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
        overflowX: 'auto',
      }}
    >
      {JSON.stringify(data, null, 2)}
    </Box>
  );
};
