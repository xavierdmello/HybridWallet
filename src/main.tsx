import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'
import { ThemeProvider } from "@mui/material/styles";
import { SafeThemeProvider } from "@safe-global/safe-react-components";
import { configureChains } from "wagmi";
import {optimismGoerli} from "wagmi/chains"
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient, webSocketPublicClient } = configureChains([optimismGoerli], [publicProvider()]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SafeThemeProvider mode="dark">
      {(safeTheme) => (
        <ThemeProvider theme={safeTheme}>
          <App />
        </ThemeProvider>
      )}
    </SafeThemeProvider>
  </React.StrictMode>
);
