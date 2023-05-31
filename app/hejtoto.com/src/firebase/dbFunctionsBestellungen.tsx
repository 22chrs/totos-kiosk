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
import { getRefillData } from './dbFunctionsAutomaten';

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

export async function getOrdersSinceRefill(automatenID: string) {
  try {
    // Use 'await' before calling getRefillData to wait for the Promise to resolve
    let fromTimeStamp = await getRefillData(automatenID); // Use let instead of const

    // Ensure fromTimeStamp is a string (if it's not already)
    fromTimeStamp = String(fromTimeStamp);

    if (fromTimeStamp) {
      // Now call getOrdersFrom with the resolved fromTimeStamp
      const orders = await getOrdersFrom(automatenID, fromTimeStamp);
      console.log('Orders: ', orders);
    }
  } catch (error) {
    console.error('Error getting orders: ', error);
  }
}
