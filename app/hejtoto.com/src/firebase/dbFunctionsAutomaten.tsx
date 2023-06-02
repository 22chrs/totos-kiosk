import { db } from '@/firebase/Firebase';
import { Automat, AutomatVariant_1, refillAutomat } from '@/firebase/Interface';

import { format } from 'date-fns';
import { get, ref, set, update } from 'firebase/database';

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
  const refilledAutomat = refillAutomat(automat);
  refilledAutomat.lastRefillDate = format(new Date(), 'yyyyMMddHHmmss');
  await updateAutomatData(
    automat.AutomatConstants.automatenID,
    refilledAutomat
  );
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

// Update automat data in memory

let currentState: Automat | null = null;

export const getCurrentState = (automatenID: string): Automat => {
  if (currentState === null) {
    currentState = AutomatVariant_1();
  }

  return currentState;
};

export const updateAutomatPropertyLocally = (
  propertyPath: string[],
  newValue: any
) => {
  let tempState = { ...currentState };

  propertyPath.reduce((object, key, index) => {
    if (index === propertyPath.length - 1) {
      object[key] = newValue;
    } else {
      if (!object[key]) {
        object[key] = {};
      }
    }
    return object[key];
  }, tempState);

  currentState = tempState;
};

updateAutomatPropertyLocally(
  ['Verpackungen', 'disposableCup', 'capacity'],
  500
);
