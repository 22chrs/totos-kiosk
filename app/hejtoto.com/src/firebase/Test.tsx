import {
  AutomatLeipzig,
  AutomatenDatenLevels,
  TelemetrieProduct,
} from '@/firebase/Interface';
import {
  addTelemetrieProduct,
  setAutomatenDaten,
} from '@/firebase/dbFunctions';
import { useEffect, useState } from 'react';

import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { formatISO } from 'date-fns';
import {
  getDatabase,
  limitToLast,
  onValue,
  query,
  ref,
} from 'firebase/database';

export const SendDataButton = () => {
  const handleClick = () => {
    const product: TelemetrieProduct = {
      productName: 'Product 1s113asd22',
      productCategory: 'Catsegory A',
      choosenSize: 'Large',
      choosenSugar: 'Medium',
      choosenMug: 'Ceramic',
      choosenLid: 'Plastic',
      choosenMilc: 'Almond',
      quantity: 1,
      calculatedPrice: 10,
      orderStatus: 'success',
      displayNumber: '1123',
      discount: 0,
      timeStamp: formatISO(new Date()),
      location: 'Location A',
    };

    addTelemetrieProduct(product)
      .then(() => {
        console.log('Product added successfully.');
      })
      .catch((error) => {
        console.error('Failed to add product:', error);
      });
  };

  return (
    <Button colorScheme='teal' onClick={handleClick}>
      Send Data
    </Button>
  );
};

export const DisplayDataProduct = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const database = getDatabase();
    const productRef = ref(database, '/telemetrieProduct');
    const q = query(productRef, limitToLast(5));

    const listener = onValue(q, (snapshot) => {
      let fetchedData = [];
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        fetchedData.push(data);
      });
      setProducts(fetchedData.reverse()); // reverse the array to show the latest entry on the top
    });
  }, []);

  return (
    <Box
      p={5}
      maxW='32rem'
      borderWidth={2}
      borderRadius='lg'
      overflow='auto' // enable scrolling
      maxHeight='500px' // you can adjust this
      bg='black'
      color='green.300'
      fontFamily='monospace'
    >
      <VStack spacing={5} align='stretch'>
        {products.map((product, index) => (
          <Box key={index}>
            <Text>{`Timestamp: ${product.timeStamp}`}</Text>
            <Text>{`Product Name: ${product.productName}`}</Text>
            <Text>{`Product Category: ${product.productCategory}`}</Text>
            <Text>{`Choosen Size: ${product.choosenSize}`}</Text>
            <Text>{`Choosen Sugar: ${product.choosenSugar}`}</Text>
            <Text>{`Choosen Mug: ${product.choosenMug}`}</Text>
            <Text>{`Choosen Lid: ${product.choosenLid}`}</Text>
            <Text>{`Choosen Milc: ${product.choosenMilc}`}</Text>
            <Text>{`Quantity: ${product.quantity}`}</Text>
            <Text>{`Calculated Price: ${product.calculatedPrice}`}</Text>
            <Text>{`Order Status: ${product.orderStatus}`}</Text>
            <Text>{`Display Number: ${product.displayNumber}`}</Text>
            <Text>{`Discount: ${product.discount}`}</Text>
            <Text>{`Location: ${product.location}`}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
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
