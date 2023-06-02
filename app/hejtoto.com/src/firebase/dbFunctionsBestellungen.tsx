import { db } from '@/firebase/Firebase';
import { Bestellung } from '@/providers/CardContext';

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

export const countPropertyTypes = (
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

export const countProductTypes = (orders: {
  [timestamp: string]: Bestellung;
}) => {
  const productCount: { [name: string]: { [size: string]: number } } = {};

  Object.values(orders).forEach((order) => {
    order.products.forEach((product) => {
      const productName = product.productName;
      const productSize = product.choosenSize || 'unknownSize';
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
export async function saveOrdersToAutomat(automatenID: string) {
  try {
    let fromTimeStamp = await getRefillData(automatenID);

    fromTimeStamp = String(fromTimeStamp);

    if (fromTimeStamp) {
      const orders = await getOrdersFrom(automatenID, fromTimeStamp);
      console.log('Orders: ', orders);

      if (orders) {
        // Count mug types
        const mugsCount = countPropertyTypes(orders, 'choosenMug');
        const lidsCount = countPropertyTypes(orders, 'choosenLid');
        const sugarsCount = countPropertyTypes(orders, 'choosenSugar');
        const productCategory = countPropertyTypes(orders, 'productCategory');
        const productsCount = countProductTypes(orders);

        if (currentState === null) {
          await getCurrentAutomatDataAndUpdateState(automatenID);
        }

        currentState.lastRefillDate = fromTimeStamp;
        currentState.lastOrderDate = format(new Date(), 'yyyyMMddHHmmss');
        currentState.Verpackungen.disposableCup.capacity = 444;
        //currentState.Verpackungen.disposableCup.current = mugsCount;

        updateAutomatData(automatenID, currentState);

        console.log('Einwegbecher count: ', mugsCount['einwegVariable']);
        console.log('Mehrwegbecher count: ', mugsCount['mehrwegVariable']);
        console.log('choosenLid count: ', lidsCount['inklusiveDeckel']);
        console.log('choosenSugar count: ', sugarsCount);
        console.log('productCategory count: ', productCategory);
        console.log('Product counts: ', productsCount);
      } else {
        console.log('No orders found from timestamp: ', fromTimeStamp);
      }
    }
  } catch (error) {
    console.error('Error getting orders: ', error);
  }
}
