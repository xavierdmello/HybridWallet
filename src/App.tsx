
import Header from "./components/Header"
import './styles/App.css'
import { useAccount } from 'wagmi'
import { Divider } from '@mui/material'
import Body from "./components/Body";

function App() {
  const {isConnected} = useAccount()

  return (
    <div className="App">
      <Header />

      <Divider />
      {isConnected ? <Body /> : <p className="connect-wallet-warning">Please connect your wallet.</p>}
    </div>
  );
}

export default App
