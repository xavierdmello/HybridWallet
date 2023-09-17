import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'
import { ThemeProvider } from "@mui/material/styles";
import { SafeThemeProvider } from "@safe-global/safe-react-components";
import { configureChains , createConfig, WagmiConfig} from "wagmi";
import {baseGoerli} from "wagmi/chains"
import { publicProvider } from "wagmi/providers/public";
import { getDefaultWallets, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
const { chains, publicClient, webSocketPublicClient } = configureChains([baseGoerli], [publicProvider()]);
import "@safe-global/safe-react-components/dist/fonts.css";

const { connectors } = getDefaultWallets({
  appName: "Hybrid Wallet",
  projectId: "133524b790ba6ad56d5298141fb398d3",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        theme={darkTheme({
          accentColor: "#12FF80",
          accentColorForeground: "#121312",
        })}
        modalSize="compact"
        chains={chains}
      >
        <SafeThemeProvider mode="dark">
          {(safeTheme) => (
            <ThemeProvider theme={safeTheme}>
              <App />
            </ThemeProvider>
          )}
        </SafeThemeProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);
