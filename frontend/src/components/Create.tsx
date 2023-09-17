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
import {server_address} from "../helper-config"
import {ReactNode} from 'react'
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
export default function Create({onCreate}: {onCreate: (arg0: string) => void}) {
  const { data: walletClient, isError, isLoading } = useWalletClient();

  async function createWallet() { 
    const signer = walletClientToSigner(walletClient!)
    const ethAdapterOwner1 = new EthersAdapter({
      ethers,
      signerOrProvider: signer ,
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

    onCreate(safeAddress);
  }

  return (
    <div className="Create">
      <h2 className="create-title">Create Hybrid Wallet</h2>
      <p className="create-subheading">You don't have a hybrid wallet yet - create one!</p>
      <Button className="create-wallet-]button" size="medium" variant="outlined" onClick={createWallet}>
        Create Wallet
      </Button>
    </div>
  );
}
