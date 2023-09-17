import { getDatabase, onValue, ref, onChildAdded, update } from "firebase/database";
import { ethers } from "ethers";
import db from "./firebase";
import "dotenv/config";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";

const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const RPC = process.env.RPC!;
const provider = new ethers.providers.JsonRpcProvider(RPC);
const serverSigner = new ethers.Wallet(PRIVATE_KEY, provider);
const ethAdapterServer = new EthersAdapter({
  ethers,
  signerOrProvider: serverSigner,
});
const txServiceUrl = "https://safe-transaction-base-testnet.safe.global/";
const safeService = new SafeApiKit({ txServiceUrl, ethAdapter: ethAdapterServer });

console.log("Server started! Listening for new transactions...")
async function main() {
  const newSendboxMessageRef = ref(db, "sendbox/");
  let initialDataLoaded = false;
  onValue(newSendboxMessageRef, () => {
    initialDataLoaded = true;
  });
  onChildAdded(newSendboxMessageRef, (snapshot) => {
    async function confirmTransaction() {
      if (initialDataLoaded == true) {
        console.log("New transaction found!")
        const safeAddress = snapshot.val().safeAddress;
        const safeSdkServer = await Safe.create({
          ethAdapter: ethAdapterServer,
          safeAddress,
        });

        const pendingTransactions = (await safeService.getPendingTransactions(safeAddress)).results;

        const transaction = pendingTransactions[0];
        const safeTxHash = transaction.safeTxHash;

        const signature = await safeSdkServer.signTransactionHash(safeTxHash);
        const response = await safeService.confirmTransaction(safeTxHash, signature.data);
        console.log("Transaction confirmed!")

        // update in firebase that transaction is confirmed
        const transactionRef = ref(db, "sendbox/" + snapshot.key );
        const updates = {
          "confirmed": true,
        };
        update(transactionRef, updates);
        console.log("Transaction confirmed in firebase!")
      }
    }
    confirmTransaction();
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
