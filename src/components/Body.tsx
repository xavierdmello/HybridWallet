import "../styles/Body.css";
import { Divider } from "@mui/material";
import {useBalance } from "wagmi"

export default function Body({ walletAddress }: { walletAddress: `0x${string}` }) {
  const { data, isError, isLoading } = useBalance({
    address: walletAddress,
    watch: true
  });
  return (
    <div className="Body">
      <div className="row">
        <h2 className="body-title">
          Smart Balance: {data?.formatted} {data?.symbol}
        </h2>
        <p className="body-subheading">{walletAddress}</p>
      </div>

      <Divider />
    </div>
  );
}
