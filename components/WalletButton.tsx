"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { base } from "wagmi/chains";
import { shortAddress } from "@/lib/format";
import { StatusChip } from "@/components/StatusChip";

function connectorLabel(id: string) {
  if (id === "baseAccount") return "Base Account";
  if (id === "coinbaseWallet") return "Coinbase Wallet";
  if (id === "injected") return "Browser Wallet";
  return "Wallet";
}

export function WalletButton() {
  const [localError, setLocalError] = useState<string | null>(null);
  const { address, chainId, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connectAsync, connectors, isPending, error } = useConnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const chainMismatch = isConnected && chainId !== base.id;
  const connectError = localError ?? error?.message ?? null;

  if (!isConnected) {
    return (
      <div className="wallet-wrap surface">
        <div className="wallet-grid">
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              className="btn btn-primary"
              type="button"
              disabled={isPending}
              onClick={async () => {
                setLocalError(null);
                try {
                  await connectAsync({ connector });
                } catch (connectError) {
                  if (connectError instanceof Error) {
                    setLocalError(connectError.message);
                  } else {
                    setLocalError("Wallet connection failed.");
                  }
                }
              }}
            >
              {isPending ? "Connecting..." : `Connect ${connectorLabel(connector.id)}`}
            </button>
          ))}
        </div>

        {connectors.length === 0 ? (
          <p className="small-note">
            No connector available. Open this page inside Coinbase Wallet or Base App.
          </p>
        ) : null}

        {connectError ? <p className="feedback feedback-error">{connectError}</p> : null}
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
