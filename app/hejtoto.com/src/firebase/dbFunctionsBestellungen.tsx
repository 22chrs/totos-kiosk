import { db } from '@/firebase/Firebase';
import { Item } from '@/firebase/Interface';
import {
  get,
  limitToLast,
  orderByKey,
  query,
  ref,
  set,
} from 'firebase/database';

export const addNewOrder = async (automatenID, order: Item) => {
  // Convert timeStampOrder to a format that can be used as a Firebase key
  // Replace ":" and "." with "-", and "Z" with nothing, to ensure compatibility with Firebase keys
  let timeStampOrderKey = order.timeStampOrder.replace(/[\:\.Z]/g, '-');

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
