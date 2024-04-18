import { db } from '@/firebase/Firebase';
import { Automat, refillAutomat } from '@/firebase/Interface';

import { format } from 'date-fns';
import { get, ref, set, update } from 'firebase/database';

// Update automat data
export let currentState: Automat | null = null;

export const setAndInitAutomatData = async (automat: Automat) => {
  const automatRef = ref(
    db,
    'automats/' + automat.AutomatConstants.automatenID
  );

  try {
    await set(automatRef, automat);
    console.log('Automat data set and initialized successfully');
  } catch (error) {
    console.error('Error setting and initializing Automat data: ', error);
  }
};

export const updateAutomatData = async (
  automatenID: string,
  fieldsToUpdate: Partial<Automat>
) => {
  const automatRef = ref(db, 'automats/' + automatenID);

  try {
    await update(automatRef, fieldsToUpdate);
    console.log('Automat data updated successfully');
  } catch (error) {
    console.error('Error updating Automat data: ', error);
  }
};

export const refillAndSendAutomatData = async (automat: Automat) => {
  const timeStamp = format(new Date(), 'yyyyMMddHHmmss');
  console.log('Automat refill init.');
  const refilledAutomat = refillAutomat(automat);
  refilledAutomat.lastRefillDate = timeStamp;
  await updateAutomatData(
    automat.AutomatConstants.automatenID,
    refilledAutomat
  );
  currentState = refillAutomat(automat);
  currentState.lastRefillDate = timeStamp;
};

export const getLastSentData = async (automatenID: string) => {
  const automatRef = ref(db, 'automats/' + automatenID);
  let data;

  try {
    const snapshot = await get(automatRef);
    if (snapshot.exists()) {
      data = snapshot.val();
    } else {
      console.log('No data available');
    }
  } catch (error) {
    console.error('Error getting data: ', error);
  }

  return data;
};

export const getCurrentAutomatDataAndUpdateState = async (
  automatenID: string
) => {
  const automatRef = ref(db, 'automats/' + automatenID);

  try {
    const snapshot = await get(automatRef);
    if (snapshot.exists()) {
      const automatData = snapshot.val();
      currentState = automatData;
    } else {
      console.log('No data available for this Automat');
      return null;
    }
  } catch (error) {
    console.error('Error getting Automat data: ', error);
    return null;
  }
};

export const getRefillData = async (automatenID: string) => {
  const automatRef = ref(db, 'automats/' + automatenID);

  try {
    const snapshot = await get(automatRef);
    if (snapshot.exists()) {
      const automatData = snapshot.val();
      const refillData = automatData.lastRefillDate; // Adjust the field according to your data structure
      return refillData; // return refill data directly
    } else {
      console.log('No data available');
      return null;
    }
  } catch (error) {
    console.error('Error getting data: ', error);
    return null;
  }
};
