import { initializeApp } from "firebase/app";

import { getFunctions, httpsCallable } from "firebase/functions";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "finvis-8304.firebaseapp.com",
  projectId: "finvis-8304",
  storageBucket: "finvis-8304.appspot.com",
  messagingSenderId: "883513772508",
  appId: "1:883513772508:web:91df5ec5cefac3c48ba719",
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app, "europe-west2");
const getStockData = httpsCallable(functions, "getStockData");
const getNewsData = httpsCallable(functions, "getNewsData");
const getSnapshot = httpsCallable(functions, "snapshots-get");
const addSnapshot = httpsCallable(functions, "snapshots-add");
const listSnapshots = httpsCallable(functions, "snapshots-list");

const auth = getAuth();

const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  setPersistence(auth, browserSessionPersistence)
    .then(() => {
      return signInWithPopup(auth, provider)
        .then((result) => {
          console.log(result);
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
};

const signOut = () => {
  auth.signOut();
};

const getUID = () => {
  return auth.currentUser.uid;
};

export {
  getStockData,
  getNewsData,
  signInWithGoogle,
  signOut,
  getSnapshot,
  addSnapshot,
  listSnapshots,
  getUID,
};
