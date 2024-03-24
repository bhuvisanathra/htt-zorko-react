import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyAhvBkvgZaV7L19Nw0zcd5j39whGYJOzIg",
//   apiKey: "AIzaSyAhvBkvgZaV7L19Nw0zcd5j39whGYJOzIg",
//   authDomain: "zorko-b104f.firebaseapp.com",
//   projectId: "zorko-b104f",
//   storageBucket: "zorko-b104f.appspot.com",
//   messagingSenderId: "231853888114",
//   appId: "1:231853888114:web:51442eb773116d56fe28eb",
//   measurementId: "G-B5J6LNPDX5",
// };

const firebaseConfig = {
  apiKey: "AIzaSyDBJaQvXtMt2bC2Bua5ksE89-LaYFJiktg",
  authDomain: "estateease.firebaseapp.com",
  projectId: "estateease",
  storageBucket: "estateease.appspot.com",
  messagingSenderId: "260190089217",
  appId: "1:260190089217:web:a966a817f3319b5ad59000",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

export { db, auth, storage };
