import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref } from "firebase/database";


// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  databaseURL: "https://hybrid-wallet-263c3-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default db;
