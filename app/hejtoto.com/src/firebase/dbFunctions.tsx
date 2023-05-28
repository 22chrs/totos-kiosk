import { db } from '@/firebase/Firebase';
import { AutomatenDatenLevels, TelemetrieProduct } from '@/firebase/Interface';

import { push, ref, set } from 'firebase/database';

export const addTelemetrieProduct = async (product: TelemetrieProduct) => {
  try {
    await push(ref(db, '/telemetrieProduct'), product);
  } catch (error) {
    console.error(error);
  }
};
// Rewrite the current status
export const setAutomatenDaten = async (
  data: AutomatenDatenLevels,
  automatenID: string
) => {
  try {
    await set(ref(db, `/automatenDaten/${automatenID}`), data);
  } catch (error) {
    console.error(error);
  }
};

// Track significant changes or events
export const addAutomatenDatenHistory = async (data: AutomatenDatenLevels) => {
  try {
    await push(ref(db, '/automatenDatenHistory'), data);
  } catch (error) {
    console.error(error);
  }
};

// Delete data at a specific reference
export const clearData = async (path: string) => {
  try {
    await set(ref(db, path), null);
  } catch (error) {
    console.error(error);
  }
};
