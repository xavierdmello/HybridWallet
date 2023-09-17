
import Header from "./components/Header"
import './styles/App.css'
import { useAccount } from 'wagmi'
import { Divider } from '@mui/material'
import Body from "./components/Body";
import Create from "./components/Create"
import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { snapshot } from "viem/actions";


// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  databaseURL: "https://hybrid-wallet-263c3-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function App() {
  const {isConnected, address} = useAccount()
  const [hybridWalletAddress, setHybridWalletAddress] = useState("")

  useEffect(() => {
    const hybridWalletAddressesRef = ref(db, "wallets/" + address);
    onValue(hybridWalletAddressesRef, (snapshot) => {
      const exists = snapshot.exists()
      if (exists) {
        setHybridWalletAddress(snapshot.val()) 
      }
    });
  }, [isConnected]);

  return (
    <div className="App">
      <Header />

      <Divider />

      {isConnected ? hybridWalletAddress !== "" ? <Body />: <Create/>  : <p className="connect-wallet-warning">Please connect your wallet.</p>}
    </div>
  );
}

export default App
