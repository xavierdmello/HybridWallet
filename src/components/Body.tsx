import "../styles/Body.css";
import { Divider, TextField, Button } from "@mui/material";
import { useState } from "react";
import { type WalletClient, useBalance, useWalletClient } from "wagmi";
import { SafeTransactionDataPartial } from "@safe-global/safe-core-sdk-types";
import { parseEther } from "viem";
import { ethers, providers } from "ethers";
import Safe, { EthersAdapter, SafeConfig } from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";

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

export default function Body({ walletAddress }: { walletAddress: `0x${string}` }) {
  const { data, isError, isLoading } = useBalance({
    address: walletAddress,
    watch: true,
  });

  const { data: walletClient } = useWalletClient();
  const [destinationAddress, setDestinationAddress] = useState("");
  const [sendAmount, setSendAmount] = useState("");

  async function sendTransaction() {
    // Create safe instance
    const signer = walletClientToSigner(walletClient!);
    const ethAdapterOwner1 = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    });
    const sc: SafeConfig = {
      safeAddress: walletAddress,
      ethAdapter: ethAdapterOwner1,
    };
    const safeSdkOwner1 = await Safe.create(sc);
    const txServiceUrl = "https://safe-transaction-base-testnet.safe.global/";
    const safeService = new SafeApiKit({ txServiceUrl, ethAdapter: ethAdapterOwner1 });

    // Safe tx data
    const safeTransactionData: SafeTransactionDataPartial = {
      to: destinationAddress,
      data: "0x",
      value: parseEther(sendAmount).toString(),
    };
    // Create a Safe transaction with the provided parameters
    const safeTransaction = await safeSdkOwner1.createTransaction({ safeTransactionData });
    // Deterministic hash based on transaction parameters
    const safeTxHash = await safeSdkOwner1.getTransactionHash(safeTransaction);

    // Sign transaction to verify that the transaction is coming from owner 1
    const senderSignature = await safeSdkOwner1.signTransactionHash(safeTxHash);
    await safeService.proposeTransaction({
      safeAddress: walletAddress,
      safeTransactionData: safeTransaction.data,
      safeTxHash,
      senderAddress: await signer.getAddress(),
      senderSignature: senderSignature.data,
    });
  }

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
