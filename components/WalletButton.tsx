"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { base } from "wagmi/chains";
import { shortAddress } from "@/lib/format";
import { StatusChip } from "@/components/StatusChip";

function connectorLabel(id: string) {
  if (id === "coinbaseWallet") return "Coinbase Wallet";
  if (id === "injected") return "Browser Wallet";
  return "Wallet";
}

export function WalletButton() {
  const { address, chainId, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors, isPending } = useConnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const chainMismatch = isConnected && chainId !== base.id;
  const preferredConnector =
    connectors.find((connector) => connector.id === "coinbaseWallet") ??
    connectors[0];

  if (!isConnected) {
    return (
      <div className="wallet-wrap surface">
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => {
            if (preferredConnector) connect({ connector: preferredConnector });
          }}
          disabled={!preferredConnector || isPending}
        >
          {isPending
            ? "Connecting..."
            : preferredConnector
              ? `Connect ${connectorLabel(preferredConnector.id)}`
              : "No wallet detected"}
        </button>
        <StatusChip tone="neutral">Disconnected</StatusChip>
      </div>
    );
  }

  if (chainMismatch) {
    return (
      <div className="wallet-wrap surface">
        <button
          className="btn btn-secondary"
          type="button"
          onClick={() => switchChain({ chainId: base.id })}
          disabled={isSwitching}
        >
          {isSwitching ? "Switching..." : "Switch to Base"}
        </button>
        <StatusChip tone="pending">Wrong network</StatusChip>
      </div>
    );
  }

  return (
    <div className="wallet-wrap surface">
      <div className="message-head">
        <span className="address">{shortAddress(address)}</span>
        <StatusChip tone="success">Base Connected</StatusChip>
      </div>
      <button className="btn btn-danger" type="button" onClick={() => disconnect()}>
        Disconnect Wallet
      </button>
    </div>
  );
}
