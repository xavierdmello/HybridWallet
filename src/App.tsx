
import Header from "./components/Header"
import './styles/App.css'
import { useAccount } from 'wagmi'
import { Divider } from '@mui/material'
import Body from "./components/Body";
import Create from "./components/Create"
import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { snapshot } from "viem/actions";
import db from "./firebase"

function App() {
  const {isConnected, address} = useAccount()
  const [hybridWalletAddress, setHybridWalletAddress] = useState("")

  useEffect(() => {
    const hybridWalletAddressesRef = ref(db, "wallets/" + address);
    onValue(hybridWalletAddressesRef, (snapshot) => {
      const exists = snapshot.exists();
      if (exists) {
        setHybridWalletAddress(snapshot.val());
      }
    });
  }, [isConnected, address]);

  useEffect(() => {
    if (hybridWalletAddress !== "") {
      const hybridWalletAddressesRef = ref(db, "wallets/" + address);
      set(hybridWalletAddressesRef, hybridWalletAddress);
    } 
  }, [hybridWalletAddress]);

  return (
    <div className="App">
      <Header />

      <Divider />

      {isConnected ? hybridWalletAddress !== "" ? <Body />: <Create onCreate={setHybridWalletAddress}/>  : <p className="connect-wallet-warning">Please connect your wallet.</p>}
    </div>
  );
}

export default App
