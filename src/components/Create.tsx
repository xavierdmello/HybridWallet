import "../styles/Create.css";
import { Button, Divider, Select, TextField, Tooltip, MenuItem, InputLabel, FormControl } from "@mui/material";
export default function Body() {
  return (
    <div className="Create">
      <h2 className="create-title">Create Hybrid Wallet</h2>
      <p className="create-subheading">
        Before you can use Hybrid Wallet, you have to deploy it! 
      </p>
      <Button className="create-wallet-button" size="medium" variant="outlined">Create Wallet</Button>
    </div>
  );
}
