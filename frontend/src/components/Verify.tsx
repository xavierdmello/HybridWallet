import "../styles/Verify.css";
import { ethers } from "ethers";
import { EthersAdapter } from "@safe-global/protocol-kit";
import { Button, Divider, Select, TextField, Tooltip, MenuItem, InputLabel, FormControl } from "@mui/material";
import * as React from "react";
import { type WalletClient, useWalletClient } from "wagmi";
import db from "../firebase";
import { ReactNode, useState } from "react";
import { getDatabase, onValue, ref, set, update } from "firebase/database";
import {useAccount} from "wagmi";

interface Props {
  children: ReactNode;
  elementType?: string;
}

export default function Verify({txHash}: {txHash: string}) {
  const [securityQuestionAnswer, setSecurityQuestionAnswer] = useState("");

  async function doSecurityChallenge() {
    // Add transaction to firebase sendbox
    const securityInboxRef = ref(db, "securityInbox/");
    const updates: { [key: string]: {answer: string} } = {};
    updates[txHash] = {
      answer: securityQuestionAnswer,
    };
    update(securityInboxRef, updates);
  }

  return (
    <div className="Verify">
      <h2 className="verify-title">Verification Required</h2>
      <p className="verify-subheading">Since you are logging in from a new location, you must complete this security challenge.</p>

      <Divider />
      <TextField
        className="destination-address-input"
        label="Security question: Favourite animal*"
        onChange={(e) => setSecurityQuestionAnswer(e.target.value)}
      ></TextField>
      <Button className="create-wallet-button" size="medium" variant="outlined" onClick={doSecurityChallenge}>
        Complete Transaction
      </Button>
    </div>
  );
}
