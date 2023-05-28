import { AutomatLeipzig, AutomatenDatenLevels } from '@/firebase/Interface';
import { setAutomatenDaten } from '@/firebase/dbFunctions';
import { useEffect, useState } from 'react';

import { db } from '@/firebase/Firebase';

import { Box, Button, Text, VStack } from '@chakra-ui/react';
import {
  getDatabase,
  limitToLast,
  onValue,
  query,
  ref,
} from 'firebase/database';

import { set } from 'firebase/database';

export const initializeAutomatenDaten = async (automatenID: string) => {
  // Initialize all fields to zero
  const initialData: AutomatenDatenLevels = {
    automatenID,
    lastUpdate: new Date().toISOString(),

    country: '',
    city: '',
    location: '',
    currency: '',

    reuseableCup300: 0,
    reuseableCup300Capacity: 0,
    reuseableLid: 0,
    reuseableLidCapacity: 0,

    disposableCup300: 0,
    disposableCup300Capacity: 0,
    disposableLid: 0,
    disposableLidCapacity: 0,

    coffeeBeans: 0,
    coffeeBeansCapacity: 0,

    sugar: 0,
    sugarCapacity: 0,

    almondMilk: 0,
    almondMilkCapacity: 0,

    frischWasser: 0,
    frischWasserCapacity: 0,
    abWassser: 0,
    abWassserCapacity: 0,

    productTea1: 0,
    productTea1Capacity: 0,
    productTea2: 0,
    productTea2Capacity: 0,
    productTea3: 0,
    productTea3Capacity: 0,

    productSnack1: 0,
    productSnack1Capacity: 0,
    productSnack2: 0,
    productSnack2Capacity: 0,
    productSnack3: 0,
    productSnack3Capacity: 0,
  };

  try {
    // Push the initial data into the database
    await set(ref(db, `/automatenDaten/${automatenID}`), initialData);
    console.log(
      `AutomatenDaten for ID ${automatenID} initialized successfully.`
    );
  } catch (error) {
    console.error(
      `Failed to initialize AutomatenDaten for ID ${automatenID}:`,
      error
    );
  }
};

export const DisplayAutomatData = () => {
  const [automatData, setAutomatData] = useState<AutomatenDatenLevels | null>(
    null
  );

  useEffect(() => {
    const database = getDatabase();
    const automatDataRef = ref(database, '/automatenDaten');
    const q = query(automatDataRef, limitToLast(1));

    const listener = onValue(q, (snapshot) => {
      let fetchedData: AutomatenDatenLevels | null = null;
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        fetchedData = data;
      });
      setAutomatData(fetchedData);
    });
  }, []);

  return (
    <Box
      p={5}
      maxW='32rem'
      borderWidth={2}
      borderRadius='lg'
      overflow='auto'
      maxHeight='500px'
      bg='black'
      color='green.300'
      fontFamily='monospace'
    >
      <VStack spacing={5} align='stretch'>
        {automatData && (
          <Box>
            <Text>{`Automaten ID: ${automatData.automatenID}`}</Text>
            <Text>{`Reusable Cups: ${automatData.reuseableCup300}`}</Text>
            <Text>{`Reusable Lids: ${automatData.reuseableLid}`}</Text>
            <Text>{`Disposable Cups: ${automatData.disposableCup300}`}</Text>
            <Text>{`Disposable Lids: ${automatData.disposableLid}`}</Text>
            <Text>{`Coffee Beans: ${automatData.coffeeBeans}`}</Text>
            <Text>{`Sugar: ${automatData.sugar}`}</Text>
            <Text>{`Almond Milk: ${automatData.almondMilk}`}</Text>
            <Text>{`Frisch Wasser: ${automatData.frischWasser}`}</Text>
            <Text>{`Ab Wassser: ${automatData.abWassser}`}</Text>
            <Text>{`Product Tea 1: ${automatData.productTea1}`}</Text>
            <Text>{`Product Tea 2: ${automatData.productTea2}`}</Text>
            <Text>{`Product Tea 3: ${automatData.productTea3}`}</Text>
            <Text>{`Product Snack 1: ${automatData.productSnack1}`}</Text>
            <Text>{`Product Snack 2: ${automatData.productSnack2}`}</Text>
            <Text>{`Product Snack 3: ${automatData.productSnack3}`}</Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export const RefillButton = () => {
  const [automatData, setAutomatData] = useState<AutomatenDatenLevels | null>(
    null
  );

  useEffect(() => {
    const database = getDatabase();
    const automatDataRef = ref(database, '/automatenDaten');
    const q = query(automatDataRef, limitToLast(1));

    const listener = onValue(q, (snapshot) => {
      let fetchedData: AutomatenDatenLevels | null = null;
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        fetchedData = data;
      });
      setAutomatData(fetchedData);
    });
  }, []);

  const refillAutomat = () => {
    if (!automatData) return;

    // create a new object with refilled data
    const refilledData: AutomatenDatenLevels = {
      ...automatData, // keep existing data

      // refill items to capacity
      reuseableCup300: AutomatLeipzig.reuseableCup300Capacity,
      reuseableLid: AutomatLeipzig.reuseableLidCapacity,
      disposableCup300: AutomatLeipzig.disposableCup300Capacity,
      disposableLid: AutomatLeipzig.disposableLidCapacity,
      coffeeBeans: AutomatLeipzig.coffeeBeansCapacity,
      sugar: AutomatLeipzig.sugarCapacity,
      almondMilk: AutomatLeipzig.almondMilkCapacity,
      frischWasser: AutomatLeipzig.frischWasserCapacity,
      abWassser: AutomatLeipzig.abWassserCapacity,
      productTea1: AutomatLeipzig.productTea1Capacity,
      productTea2: AutomatLeipzig.productTea2Capacity,
      productTea3: AutomatLeipzig.productTea3Capacity,
      productSnack1: AutomatLeipzig.productSnack1Capacity,
      productSnack2: AutomatLeipzig.productSnack2Capacity,
      productSnack3: AutomatLeipzig.productSnack3Capacity,
    };

    // then update the database with refilled data
    console.log('Refilling automat...'); // add this line
    setAutomatenDaten(refilledData, automatData.automatenID)
      .then(() => {
        console.log('Automat refilled successfully.');
        setAutomatData(refilledData); // update local state
      })
      .catch((error) => {
        console.error('Failed to refill Automat:', error);
      });
  };

  return (
    <Button
      colorScheme='teal'
      onClick={() => {
        console.log('Button clicked');
        refillAutomat();
      }}
    >
      Refill Automat
    </Button>
  );
};
