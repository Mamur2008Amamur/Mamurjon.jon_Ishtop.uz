import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB7e3Ardo96nLG5tfhLPh99PTA88tKILhg",
  authDomain: "chat-app-mamurjon.firebaseapp.com",
  databaseURL: "https://chat-app-mamurjon-default-rtdb.firebaseio.com",
  projectId: "chat-app-mamurjon",
  storageBucket: "chat-app-mamurjon.firebasestorage.app",
  messagingSenderId: "149325485272",
  appId: "1:149325485272:web:78a30ccb4d972cb52873ad"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
