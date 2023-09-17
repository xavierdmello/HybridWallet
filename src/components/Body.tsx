import "../styles/Body.css";
import { Divider, TextField, Button} from "@mui/material";
import { useState } from "react";
import {useBalance } from "wagmi"


export default function Body({ walletAddress }: { walletAddress: `0x${string}` }) {
  const { data, isError, isLoading } = useBalance({
    address: walletAddress,
    watch: true
  });

  const [destinationAddress, setDestinationAddress] = useState("")
  const [sendAmount, setSendAmount] = useState("");
  return (
    <div className="Body">
      <div className="row">
        <h2 className="body-title">
          Smart Balance: {data?.formatted} {data?.symbol}
        </h2>
        <p className="body-subheading">{walletAddress}</p>
      </div>

      <Divider />
      <p className="body-subheading">Send</p>
      <TextField
        className="destination-address-input"
        label="Enter public address (0x) or ENS name"
        onChange={(e) => setDestinationAddress(e.target.value)}
      ></TextField>

      <div className="send-row">
        <TextField className="send-amount-input" label="Value (ETH)" onChange={(e) => setSendAmount(e.target.value)}></TextField>

        <Button className="send-button" size="medium" variant="outlined">
          Send ETH
        </Button>
      </div>
    </div>
  );
}
