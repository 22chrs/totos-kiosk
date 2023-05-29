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

import { formatISO } from 'date-fns';
import { set } from 'firebase/database';

// Initialize the Automat

export const initializeAutomatenDaten = async (customAutomat) => {
  console.log(customAutomat);
  const initialData: AutomatenDatenLevels = {
    automatenID: customAutomat.automatenID,
    lastUpdate: formatISO(new Date()),

    country: 'Germany',
    location: 'de-DE',
    city: 'Leipzig, Werkstatt',
    currency: 'EUR',

    reuseableCup300: 0,
    reuseableCup300Capacity: customAutomat.reuseableCup300Capacity,
    reuseableLid: 0,
    reuseableLidCapacity: customAutomat.reuseableLidCapacity,

    disposableCup300: 0,
    disposableCup300Capacity: customAutomat.disposableCup300Capacity,
    disposableLid: 0,
    disposableLidCapacity: customAutomat.disposableLidCapacity,

    coffeeBeans: 0,
    coffeeBeansCapacity: customAutomat.coffeeBeansCapacity,

    sugar: 0,
    sugarCapacity: customAutomat.sugarCapacity,

    almondMilk: 0,
    almondMilkCapacity: customAutomat.almondMilkCapacity,

    frischWasser: 0,
    frischWasserCapacity: customAutomat.frischWasserCapacity,
    abWassser: 0,
    abWassserCapacity: customAutomat.abWassserCapacity,

    productTea1: 0,
    productTea1Capacity: customAutomat.productTea1Capacity,
    productTea2: 0,
    productTea2Capacity: customAutomat.productTea2Capacity,
    productTea3: 0,
    productTea3Capacity: customAutomat.productTea3Capacity,

    productSnack1: 0,
    productSnack1Capacity: customAutomat.productSnack1Capacity,
    productSnack2: 0,
    productSnack2Capacity: customAutomat.productSnack2Capacity,
    productSnack3: 0,
    productSnack3Capacity: customAutomat.productSnack3Capacity,
  };

  try {
    // Push the initial data into the database
    await set(ref(db, `/automatenDaten/`), initialData);
    console.log(
      `AutomatenDaten for ID ${customAutomat.automatenID} initialized successfully.`
    );
  } catch (error) {
    console.error(
      `Failed to initialize AutomatenDaten for ID ${customAutomat.automatenID}:`,
      error
    );
  }
};

export const InitializeButton = ({ customAutomat }) => {
  const initializeData = () => {
    initializeAutomatenDaten(customAutomat)
      .then(() =>
        console.log(`Initialization for ${customAutomat} successful.`)
      )
      .catch((err) => console.error(`Initialization failed:`, err));
  };

  return (
    <Button colorScheme='teal' onClick={initializeData}>
      Initialize Automat
    </Button>
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

// Display Data
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
      maxW='50rem'
      borderWidth={2}
      borderRadius='xl'
      overflow='auto'
      maxHeight='70vh'
      bg='black'
      color='green.300'
      fontFamily='monospace'
    >
      {automatData && (
        <VStack spacing='0' align='stretch'>
          <Text>{`Automaten ID: ${automatData.automatenID}`}</Text>
          <Text>{`Last update: ${automatData.lastUpdate}`}</Text>
          <Text>{`Country: ${automatData.country}`}</Text>
          <Text>{`Location: ${automatData.location}`}</Text>
          <Text>{`Place: ${automatData.city}`}</Text>
          <Text>{`Currency: ${automatData.currency}`}</Text>
          <Text>{`Reusable Cups: ${automatData.reuseableCup300}/${automatData.reuseableCup300Capacity} pcs`}</Text>
          <Text>{`Reusable Lids: ${automatData.reuseableLid}/${automatData.reuseableLidCapacity} pcs`}</Text>
          <Text>{`Disposable Cups: ${automatData.disposableCup300}/${automatData.disposableCup300Capacity} pcs`}</Text>
          <Text>{`Disposable Lids: ${automatData.disposableLid}/${automatData.disposableLidCapacity} pcs`}</Text>
          <Text>{`Coffee Beans: ${automatData.coffeeBeans}/${automatData.coffeeBeansCapacity} Kilogram`}</Text>
          <Text>{`Sugar: ${automatData.sugar}/${automatData.sugarCapacity} Kilogram`}</Text>
          <Text>{`Almond Milk: ${automatData.almondMilk}/${automatData.almondMilkCapacity} Liter`}</Text>
          <Text>{`Fresh water: ${automatData.frischWasser}/${automatData.frischWasserCapacity} Liter`}</Text>
          <Text>{`Waste water: ${automatData.abWassser}/${automatData.abWassserCapacity} Liter`}</Text>
          <Text>{`Product Tea 1: ${automatData.productTea1}/${automatData.productTea1Capacity} pcs`}</Text>
          <Text>{`Product Tea 2: ${automatData.productTea2}/${automatData.productTea2Capacity} pcs`}</Text>
          <Text>{`Product Tea 3: ${automatData.productTea3}/${automatData.productTea3Capacity} pcs`}</Text>
          <Text>{`Product Snack 1: ${automatData.productSnack1}/${automatData.productSnack1Capacity} pcs`}</Text>
          <Text>{`Product Snack 2: ${automatData.productSnack2}/${automatData.productSnack2Capacity} pcs`}</Text>
          <Text>{`Product Snack 3: ${automatData.productSnack3}/${automatData.productSnack3Capacity} pcs`}</Text>
        </VStack>
      )}
    </Box>
  );
};
