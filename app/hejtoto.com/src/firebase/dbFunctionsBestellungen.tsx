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
} from 'firebase/database';

const automatenID = shopData.automatenID;

// export const addNewOrder = async (
//   automatenID: string,
//   bestellung: (status: string) => void,
//   orderStatusInput: string,
//   cartContext: CartContextType // This is your context, passed as an argument
// ) => {
//   const order = cartContext.bestellung(orderStatusInput);

//   // Convert timeStampOrder to a format that can be used as a Firebase key
//   // Replace ":" and "." with "-", and "Z" with nothing, to ensure compatibility with Firebase keys
//   let timeStampOrderKey = order.timeStamp.replace(/[\:\.Z]/g, '-');

//   const orderRef = ref(db, `orders/${automatenID}/${timeStampOrderKey}`);

//   try {
//     await set(orderRef, order);
//     console.log('New order added successfully');
//   } catch (error) {
//     console.error('Error adding new order: ', error);
//   }
// };

export const addNewOrder = async (automatenID, order: Bestellung) => {
  // Convert timeStampOrder to a format that can be used as a Firebase key
  // Replace ":" and "." with "-", and "Z" with nothing, to ensure compatibility with Firebase keys
  let timeStampOrderKey = order.timeStamp.replace(/[\:\.Z]/g, '-');

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
