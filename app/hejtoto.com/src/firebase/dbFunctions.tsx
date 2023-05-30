import { db } from '@/firebase/Firebase';
import { Automat, refillAutomat } from '@/firebase/Interface';
import { formatISO } from 'date-fns';

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

// Then you can use the function to set and initialize Automat data as follows:

//setAndInitAutomatData(AutomatVariant_1);

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
  refilledAutomat.lastRefillDate = formatISO(new Date());
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
