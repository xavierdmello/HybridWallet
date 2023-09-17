import "../styles/Create.css";
import { ethers } from "ethers";
import { EthersAdapter } from "@safe-global/protocol-kit";
import { Button, Divider, Select, TextField, Tooltip, MenuItem, InputLabel, FormControl } from "@mui/material";
import * as React from "react";
import { type WalletClient, useWalletClient } from "wagmi";
import { providers } from "ethers";
import SafeApiKit from "@safe-global/api-kit";
import { SafeFactory } from "@safe-global/protocol-kit";
import { SafeAccountConfig } from "@safe-global/protocol-kit";
import { server_address } from "../helper-config";
import { ReactNode, useState } from "react";
export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}
interface Props {
  children: ReactNode;
  elementType?: string;
}
async function getIP() {
  try {
    const response = await fetch("https://ipinfo.io/json?token=760779c0a70435");
    const data = await response.json();
    return data
  } catch (error) {
    console.error(error);
  }
}

export default function Create({ onCreate }: { onCreate: (arg0: string, arg1: string, arg2: string) => void }) {
  const { data: walletClient, isError, isLoading } = useWalletClient();
  const [securityQuestionAnswer, setSecurityQuestionAnswer] = useState("");

  async function createWallet() {
    const signer = walletClientToSigner(walletClient!);
    const ethAdapterOwner1 = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    });
    const txServiceUrl = "https://safe-transaction-base-testnet.safe.global/";
    const safeService = new SafeApiKit({ txServiceUrl, ethAdapter: ethAdapterOwner1 });
    const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapterOwner1 });

    const safeAccountConfig: SafeAccountConfig = {
      owners: [await signer.getAddress(), server_address],
      threshold: 2,
    };

    const safeSdkOwner1 = await safeFactory.deploySafe({ safeAccountConfig });
    const safeAddress = await safeSdkOwner1.getAddress();
    const city = (await getIP()).city.toLowerCase();
    
    onCreate(safeAddress, securityQuestionAnswer, city);
  }

  return (
    <div className="Create">
      <h2 className="create-title">Create Hybrid Wallet</h2>
      <p className="create-subheading">You don't have a hybrid wallet yet - create one!</p>

      <Divider />
      <TextField
        className="destination-address-input"
        label="Security question: Favourite animal*"
        onChange={(e) => setSecurityQuestionAnswer(e.target.value)}
      ></TextField>
      <Button className="create-wallet-button" size="medium" variant="outlined" onClick={createWallet}>
        Create Wallet
      </Button>
    </div>
  );
}
