// https://console.firebase.google.com/project/hej-toto/database/hej-toto-default-rtdb/rules

import { getApps, initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDTVGBPVPkvveYZea4kmU7QZLUD4j82PbI',
  authDomain: 'hej-toto.firebaseapp.com',
  projectId: 'hej-toto',
  storageBucket: 'hej-toto.appspot.com',
  messagingSenderId: '536209933206',
  appId: '1:536209933206:web:f114316ac4a1cc5a6753b7',
  databaseURL:
    'https://hej-toto-default-rtdb.europe-west1.firebasedatabase.app/',
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const db = getDatabase(app);
