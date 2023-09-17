import Header from "./components/Header";
import "./styles/App.css";
import { useAccount } from "wagmi";
import { Divider } from "@mui/material";
import Body from "./components/Body";
import Create from "./components/Create";
import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import db from "./firebase";

function App() {
  const { isConnected, address } = useAccount();
  const [hybridWalletAddress, setHybridWalletAddress] = useState("");
  const [securityQuestionAnswer, setSecurityQuestionAnswer] = useState("");
  const [city, setCity] = useState("");

  function onWalletCreate(hybridWalletAddress: string, securityQuestionAnswer: string, city: string) {
    setHybridWalletAddress(hybridWalletAddress);
    setSecurityQuestionAnswer(securityQuestionAnswer);
    setCity(city);
  }

  useEffect(() => {
    const hybridWalletAddressesRef = ref(db, "wallets/" + address);
    onValue(hybridWalletAddressesRef, (snapshot) => {
      const exists = snapshot.exists();
      if (exists) {
        setHybridWalletAddress(snapshot.val().wallet);
      } else {
        setHybridWalletAddress("");
      }
    });
  }, [isConnected, address]);

  useEffect(() => {
    if (hybridWalletAddress !== "" && securityQuestionAnswer !== "" && city !== "") {
      const hybridWalletAddressesRef = ref(db, "wallets/" + address);
      set(hybridWalletAddressesRef, { wallet: hybridWalletAddress, securityQuestionAnswer: securityQuestionAnswer, city: city});
    }
  }, [hybridWalletAddress, securityQuestionAnswer, city]);

  return (
    <div className="App">
      <Header />

      <Divider />

      {isConnected ? (
        hybridWalletAddress !== "" ? (
          <Body walletAddress={hybridWalletAddress as `0x${string}`} />
        ) : (
          <Create onCreate={onWalletCreate} />
        )
      ) : (
        <p className="connect-wallet-warning">Please connect your wallet.</p>
      )}
    </div>
  );
}

export default App;
