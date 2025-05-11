"use client";
import type { ReactNode } from "react";
import { WagmiProvider, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { http } from "viem";
import { injected } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OnchainKitProvider } from "@coinbase/onchainkit";

const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [injected()],
});
const queryClient = new QueryClient();

export function Providers(props: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          chain={base}
          config={{
            appearance: { theme: "base" },
            wallet: { display: "modal" },
          }}
        >
          {props.children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
