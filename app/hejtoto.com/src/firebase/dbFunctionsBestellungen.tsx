import { db } from '@/firebase/Firebase';
import { Bestellung } from '@/providers/CardContext';
import shopData from '@/public/kiosk/products/leipzig.json';

import {
  get,
  limitToLast,
  orderByKey,
  query,
  ref,
  set,
  startAt,
} from 'firebase/database';

import { format } from 'date-fns';
import { Automat } from './Interface';
import {
  currentState,
  getCurrentAutomatDataAndUpdateState,
  getRefillData,
  updateAutomatData,
} from './dbFunctionsAutomaten';

export const addNewOrder = async (automatenID, order: Bestellung) => {
  //const timeStamp = formatISO(new Date()); // create the timestamp here
  const timeStamp = format(new Date(), 'yyyyMMddHHmmss');
  //let timeStampOrderKey = timeStamp.replace(/[\:\.Z]/g, '-');

  const orderRef = ref(db, `orders/${automatenID}/${timeStamp}`);

  try {
    await set(orderRef, order);
    console.log('New order added successfully');
  } catch (error) {
    console.error('Error adding new order: ', error);
  }
};

export const getLastOrder = async (automatenID) => {
  const ordersRef = ref(db, `orders/${automatenID}`);
  const q = query(ordersRef, orderByKey(), limitToLast(1));

  try {
    const snapshot = await get(q);
    if (snapshot.exists()) {
      const key = Object.keys(snapshot.val())[0];
      const value = snapshot.val()[key];
      return { [key]: value }; // or simply return value if you don't need the timestamp
    } else {
      console.log('No data available');
      return null;
    }
  } catch (error) {
    console.error('Error getting data: ', error);
    return null;
  }
};

export const getOrdersFrom = async (automatenID, fromTimeStamp) => {
  const ordersRef = ref(db, `orders/${automatenID}`);
  const q = query(ordersRef, orderByKey(), startAt(fromTimeStamp));

  try {
    const snapshot = await get(q);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log('No data available');
      return null;
    }
  } catch (error) {
    console.error('Error getting data: ', error);
    return null;
  }
};

// Anzahl Additive zählen, z.B. Zucker
const countPropertyTypes = (
  orders: {
    [timestamp: string]: Bestellung;
  },
  property: string
) => {
  const count: { [type: string]: number } = {};

  Object.values(orders).forEach((order) => {
    order.products.forEach((product) => {
      const type = product[property];
      const quantity = product.quantity || 0; // Get the quantity, default to 0 if undefined
      if (type) {
        if (!count[type]) {
          count[type] = quantity;
        } else {
          count[type] += quantity;
        }
      }
    });
  });

  return count;
};

// Ein- und Mehrwegdeckel zählen
const countLidTypes = (orders: { [timestamp: string]: Bestellung }) => {
  const lidCount: { [lidType: string]: number } = {
    reusableLids: 0,
    disposableLids: 0,
  };

  Object.values(orders).forEach((order) => {
    order.products.forEach((product) => {
      if (product.choosenLid === 'inklusiveDeckel') {
        const lidType =
          product.choosenMug === 'mehrwegVariable'
            ? 'reusableLids'
            : 'disposableLids';
        const quantity = product.quantity || 0;

        // Increase the lid count of the corresponding type
        lidCount[lidType] += quantity;
      }
    });
  });

  return lidCount;
};

const setLidsCurrentValues = (
  currentState: Automat,
  lidCount: { [lidType: string]: number }
) => {
  if (currentState && currentState.Verpackungen) {
    Object.keys(currentState.Verpackungen).forEach((key) => {
      // Check if the product is of type 'disposableLids'
      if (key.startsWith('disposableLids')) {
        currentState.Verpackungen[key].current = lidCount.disposableLids;
      }
      // Check if the product is of type 'reusableLids'
      else if (key.startsWith('reusableLids')) {
        currentState.Verpackungen[key].current = lidCount.reusableLids;
      }
    });
  } else {
    console.error(
      'Error: currentState or currentState.Verpackungen is not defined'
    );
  }
};

// Ein- und Mehrwegbecher in unterschiedlichen Größen zählen
const countMugTypesJSON = (orders: { [timestamp: string]: Bestellung }) => {
  const availableSizesMugsDisposable = shopData.stock[0].disposableMugs
    .map((mug) => mug.size)
    .sort((a, b) => parseInt(a) - parseInt(b));
  const availableSizesMugsReusable = shopData.stock[0].reusableMugs
    .map((mug) => mug.size)
    .sort((a, b) => parseInt(a) - parseInt(b));

  // Initialize counts for each size to 0
  const mugCount: { [mugType: string]: { [size: string]: number } } = {
    reusableMugs: availableSizesMugsReusable.reduce(
      (acc, size) => ({ ...acc, [size]: 0 }),
      {}
    ),
    disposableMugs: availableSizesMugsDisposable.reduce(
      (acc, size) => ({ ...acc, [size]: 0 }),
      {}
    ),
  };

  Object.values(orders).forEach((order) => {
    order.products.forEach((product) => {
      const mugType =
        product.choosenMug === 'mehrwegVariable'
          ? 'reusableMugs'
          : 'disposableMugs';
      const mugSize = product.choosenSize;
      const quantity = product.quantity || 0;

      // Skip the product if the size is not defined
      if (!mugSize) {
        return;
      }

      let targetSize;

      if (mugType === 'disposableMugs') {
        targetSize = availableSizesMugsDisposable.find(
          (availableSize) => parseInt(availableSize) >= parseInt(mugSize)
        );
      } else if (mugType === 'reusableMugs') {
        targetSize = availableSizesMugsReusable.find(
          (availableSize) => parseInt(availableSize) >= parseInt(mugSize)
        );
      }

      if (targetSize !== undefined) {
        mugCount[mugType][targetSize] += quantity;
      }
    });
  });

  return mugCount;
};

const setVerpackungenCurrentValues = (
  currentState: Automat,
  mugCount: { [mugType: string]: { [size: string]: number } }
) => {
  if (currentState && currentState.Verpackungen) {
    // Get list of available sizes from mugCount
    const availableSizesMugsDisposable = Object.keys(mugCount.disposableMugs);
    const availableSizesMugsReusable = Object.keys(mugCount.reusableMugs);

    Object.keys(currentState.Verpackungen).forEach((key) => {
      // Check if the product is of type 'disposableMugs' and its size is available in mugCount
      if (
        key.startsWith('disposableMugs') &&
        availableSizesMugsDisposable.includes(
          currentState.Verpackungen[key].size
        )
      ) {
        currentState.Verpackungen[key].current =
          mugCount.disposableMugs[currentState.Verpackungen[key].size];
      }
      // Check if the product is of type 'reusableMugs' and its size is available in mugCount
      else if (
        key.startsWith('reusableMugs') &&
        availableSizesMugsReusable.includes(currentState.Verpackungen[key].size)
      ) {
        currentState.Verpackungen[key].current =
          mugCount.reusableMugs[currentState.Verpackungen[key].size];
      }
    });
  } else {
    console.error(
      'Error: currentState or currentState.Verpackungen is not defined'
    );
  }
};

const setAdditiveCurrentValues = (
  currentState: Automat,
  additiveCount: Record<string, number>
) => {
  if (currentState && currentState.Additive) {
    Object.keys(currentState.Additive).forEach((key) => {
      // Check if the additive exists in additiveCount, if so, update its current value
      if (additiveCount.hasOwnProperty(key)) {
        currentState.Additive[key].current = additiveCount[key];
      }
    });
  } else {
    console.error(
      'Error: currentState or currentState.Additive is not defined'
    );
  }
};

//Produkte in unterschiedlichen Größen zählen
const countProductTypes = (orders: { [timestamp: string]: Bestellung }) => {
  const productCount: { [name: string]: { [size: string]: number } } = {};

  Object.values(orders).forEach((order) => {
    order.products.forEach((product) => {
      const productName = product.productName;
      // If the productSize is not defined, consider it as 'oneSize'
      const productSize = product.choosenSize || 'oneSize';
      const quantity = product.quantity || 0;

      if (productName) {
        if (!productCount[productName]) {
          productCount[productName] = { [productSize]: quantity };
        } else if (!productCount[productName][productSize]) {
          productCount[productName][productSize] = quantity;
        } else {
          productCount[productName][productSize] += quantity;
        }
      }
    });
  });

  return productCount;
};

const calculateTotalFreshWater = (productCount, shopData) => {
  let totalFreshWater = 0;

  // Iterate through all categories
  for (const category of shopData.categories) {
    // Iterate through all products in each category
    for (const product of category.products) {
      const productName = product.name;
      const freshWaterRatio = product.freshWaterRatio;

      // Check if we have count for this product
      if (productCount[productName]) {
        // Iterate through each size of this product
        for (const size in productCount[productName]) {
          // Skip if the size is "oneSize"
          if (size === 'oneSize') continue;

          // Parse the size as an integer (removing " ml" from the end)
          const parsedSize = parseInt(size);
          // Calculate the quantity of this size for this product
          const quantity = productCount[productName][size];

          // Add to the total fresh water, accounting for fresh water ratio, size and quantity
          totalFreshWater += freshWaterRatio * parsedSize * quantity;
        }
      }
    }
  }

  return Math.round(totalFreshWater);
};

// Function to calculate total Waste water needed
const calculateTotalWasteWater = (productCount, shopData) => {
  let totalWasteWater = 0;

  // Iterate through all categories
  for (const category of shopData.categories) {
    // Iterate through all products in each category
    for (const product of category.products) {
      const productName = product.name;
      const wasteWaterRatio = product.wasteWaterRatio;

      // Check if we have count for this product
      if (productCount[productName]) {
        // Iterate through each size of this product
        for (const size in productCount[productName]) {
          // Skip if the size is "oneSize"
          if (size === 'oneSize') continue;

          // Parse the size as an integer (removing " ml" from the end)
          const parsedSize = parseInt(size);
          // Calculate the quantity of this size for this product
          const quantity = productCount[productName][size];

          // Add to the total fresh water, accounting for fresh water ratio, size and quantity
          totalWasteWater += wasteWaterRatio * parsedSize * quantity;
        }
      }
    }
  }

  return Math.round(totalWasteWater);
};

const calculateTotalLiquidBased = (productCount, shopData, liquidType) => {
  let totalLiquid = 0;

  // Iterate through all categories
  for (const category of shopData.categories) {
    // Iterate through all products in each category
    for (const product of category.products) {
      const productName = product.name;
      const liquidRatio = product[liquidType + 'Ratio']; // e.g. 'freshWaterRatio', 'wasteWaterRatio', 'milkRatio', etc.

      // Check if we have count for this product
      if (productCount[productName]) {
        // Iterate through each size of this product
        for (const size in productCount[productName]) {
          // Skip if the size is "oneSize"
          if (size === 'oneSize') continue;

          // Parse the size as an integer (removing " ml" from the end)
          const parsedSize = parseInt(size);
          // Calculate the quantity of this size for this product
          const quantity = productCount[productName][size];

          // Add to the total liquid, accounting for liquid ratio, size and quantity
          totalLiquid += liquidRatio * parsedSize * quantity;
        }
      }
    }
  }

  return Math.round(totalLiquid);
};

export async function saveOrdersToAutomat(automatenID: string) {
  try {
    let fromTimeStamp = await getRefillData(automatenID);

    fromTimeStamp = String(fromTimeStamp);

    if (fromTimeStamp) {
      const orders = await getOrdersFrom(automatenID, fromTimeStamp);
      //console.log('Orders: ', orders);

      if (orders) {
        // Count mug types

        //const mugCount = countMugTypes(orders);

        const sugarsCount = countPropertyTypes(orders, 'choosenSugar');
        const productsCount = countProductTypes(orders);

        if (currentState === null) {
          await getCurrentAutomatDataAndUpdateState(automatenID);
        }

        currentState.lastRefillDate = fromTimeStamp;
        currentState.lastOrderDate = format(new Date(), 'yyyyMMddHHmmss');

        //const sizes = shopData.stock.mugsDisposable.size

        console.log('choosenSugar count: ', sugarsCount);
        console.log('Product counts: ', productsCount);

        // Update Ein- und Mehrwegbecher
        setVerpackungenCurrentValues(currentState, countMugTypesJSON(orders));
        setLidsCurrentValues(currentState, countLidTypes(orders));
        //currentState.Additive if there is Zucker = sugarsCount.sugar;

        // setAdditiveCurrentValues(currentState, {
        //   Zucker: sugarsCount.sugar, // or sugarsCount.Zucker if your sugar property is named "Zucker"
        // });

        setAdditiveCurrentValues(currentState, {
          sugar: 21,
          milk: calculateTotalLiquidBased(productsCount, shopData, 'milk'),
          freshWater: calculateTotalLiquidBased(
            productsCount,
            shopData,
            'freshWater'
          ),
          wasteWater: calculateTotalLiquidBased(
            productsCount,
            shopData,
            'wasteWater'
          ),
          coffeBeansMild: calculateTotalLiquidBased(
            productsCount,
            shopData,
            'coffeBeansMild'
          ),
          // coffeBeansStrong: calculateTotalLiquidBased(
          //   productsCount,
          //   shopData,
          //   'coffeBeansStrong'
          // ),
          // coffeePomace: calculateTotalLiquidBased(
          //   productsCount,
          //   shopData,
          //   'coffeePomace'
          // ),
        });

        updateAutomatData(automatenID, currentState);
      } else {
        console.log('No orders found from timestamp: ', fromTimeStamp);
      }
    }
  } catch (error) {
    console.error('Error getting orders: ', error);
  }
}
