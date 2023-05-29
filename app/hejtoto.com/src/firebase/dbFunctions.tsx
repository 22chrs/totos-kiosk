import { db } from '@/firebase/Firebase';
import { Automat } from '@/firebase/Interface';

import { ref, set, update } from 'firebase/database';

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

// Then you can use the function to update Automat data as follows:

// Example:
// updateAutomatData('001', { status: 'offline', lastPing: 'just now' });
