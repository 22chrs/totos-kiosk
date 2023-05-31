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

import shopData from '@/public/kiosk/products/leipzig.json';
import { formatISO, parseISO } from 'date-fns';
const automatenID = shopData.automatenID;

export const addNewOrder = async (automatenID, order: Bestellung) => {
  // Convert timeStampOrder to a format that can be used as a Firebase key
  // Replace ":" and "." with "-", and "Z" with nothing, to ensure compatibility with Firebase keys
  //let timeStampOrderKey = order.timeStamp.replace(/[\:\.Z]/g, '-');

  const timeStamp = formatISO(new Date()); // create the timestamp here
  let timeStampOrderKey = timeStamp.replace(/[\:\.Z]/g, '-');

  const orderRef = ref(db, `orders/${automatenID}/${timeStampOrderKey}`);

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
export const getOrdersFromDate = async (automatenID, startDateString) => {
  // Use date-fns to parse the string into a Date object
  const startDate = parseISO(startDateString);

  // Use ISO string of the date for comparison
  const startDateISOString = startDate.toISOString();

  // Reference to the orders of the specific automatenID
  const ordersRef = ref(db, `orders/${automatenID}`);

  // Construct the query
  const q = query(ordersRef, orderByKey(), startAt(startDateISOString));

  try {
    const snapshot = await get(q);
    if (snapshot.exists()) {
      const data = snapshot.val();
      let result = {};
      Object.keys(data).forEach((key) => {
        const value = data[key];
        result[key] = value;
      });
      return result;
    } else {
      console.log('No data available');
      return null;
    }
  } catch (error) {
    console.error('Error getting data: ', error);
    return null;
  }
};
