import { getDatabase, onValue, ref,onChildAdded } from "firebase/database";
import { ethers } from "ethers";
import db from "./firebase";

async function main() {
  const newSendboxMessageRef = ref(db, "sendbox/");
  let initialDataLoaded = false;
  onValue(newSendboxMessageRef, () => {
    initialDataLoaded = true;
  });
  onChildAdded(newSendboxMessageRef, (snapshot) => {
    if (initialDataLoaded == true) {
      const emailHash = snapshot.key;
      const accountData = snapshot.val();
      const account = accountData.address;
        
    }
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
