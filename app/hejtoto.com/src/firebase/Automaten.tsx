import { AutomatVariant_1 } from '@/firebase/Interface';
import {
  getLastSentData,
  refillAndSendAutomatData,
  setAndInitAutomatData,
} from '@/firebase/dbFunctions';
import { Box, Button, Progress, Text } from '@chakra-ui/react';
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

export const DisplayData2 = ({ automatenID }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const newData = await getLastSentData(automatenID);
      setData(newData);
    }, 1000);

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, [automatenID]);

  let teeSorte_B_capacity = data?.tee?.TeeSorte_B?.capacity;
  let teeSorte_B_pcs = data?.tee?.TeeSorte_B?.pcs;
  let teeSorte_B_percentage = (teeSorte_B_pcs / teeSorte_B_capacity) * 100;

  return (
    <>
      <Box mt={4}>
        <Text>
          Teesorte_B: [{teeSorte_B_pcs}/{teeSorte_B_capacity} pcs]
        </Text>
        <Progress colorScheme='teal' value={teeSorte_B_percentage}>
          TeeSorte_B: {teeSorte_B_pcs}/{teeSorte_B_capacity}
        </Progress>
      </Box>
    </>
  );
};
