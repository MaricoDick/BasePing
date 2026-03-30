"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAccount, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { base } from "wagmi/chains";
import { BottomNav } from "@/components/BottomNav";
import { ComposerCard } from "@/components/ComposerCard";
import { PingHeader } from "@/components/PingHeader";
import { StatusChip } from "@/components/StatusChip";
import { WalletButton } from "@/components/WalletButton";
import { BASE_PING_ADDRESS, basePingAbi } from "@/lib/basePing";
import { DATA_SUFFIX } from "@/lib/wagmi";
import { trackTransaction } from "@/utils/track";

const LIMIT = 140;

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Transaction failed. Please try again.";
}

export default function ComposePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const handledSuccessRef = useRef(false);

  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [pendingHash, setPendingHash] = useState<`0x${string}` | undefined>();

  const { address, chainId, isConnected } = useAccount();
  const { switchChain, isPending: switchingChain } = useSwitchChain();
  const { writeContractAsync, isPending: submitting } = useWriteContract();

  const { isLoading: confirming, isSuccess: confirmed } = useWaitForTransactionReceipt({
    hash: pendingHash,
    chainId: base.id,
    query: { enabled: Boolean(pendingHash) },
  });

  useEffect(() => {
    if (!confirmed || !pendingHash || handledSuccessRef.current) return;

    handledSuccessRef.current = true;
    void trackTransaction("app-003", "BasePing", address, pendingHash);

    void queryClient.invalidateQueries({ queryKey: ["ping-count"] });
    void queryClient.invalidateQueries({ queryKey: ["ping-messages"] });

    const timer = setTimeout(() => {
      router.push("/");
    }, 900);

    return () => clearTimeout(timer);
  }, [address, confirmed, pendingHash, queryClient, router]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!isConnected || !address) {
      setError("Connect wallet first.");
      return;
    }

    if (chainId !== base.id) {
      switchChain({ chainId: base.id });
      setError("Switch to Base network first.");
      return;
    }

    const text = content.trim();
    if (!text) {
      setError("Message cannot be empty.");
      return;
    }

    if (text.length > LIMIT) {
      setError("Message must be 140 characters or less.");
      return;
    }

    try {
      handledSuccessRef.current = false;
      const hash = await writeContractAsync({
        address: BASE_PING_ADDRESS,
        abi: basePingAbi,
        functionName: "send",
        args: [text],
        chainId: base.id,
        dataSuffix: DATA_SUFFIX,
      });

      setTxHash(hash);
      setPendingHash(hash);
      setContent("");
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    }
  }

  const remaining = LIMIT - content.length;
  const isBusy = submitting || confirming;
  const isChainMismatch = isConnected && chainId !== base.id;

  return (
    <main className="app-shell">
      <PingHeader
        title="Compose"
        subtitle="Write a short onchain ping. After confirmation, you return to Home."
      />

      <WalletButton />

      <div className="surface spaced">
        <StatusChip tone={isBusy ? "pending" : "active"}>
          {isBusy ? "Processing" : "Ready"}
        </StatusChip>
        <p className="small-note">
          Success triggers tx hash feedback and offchain tracking without blocking UX.
        </p>
      </div>

      <ComposerCard
        content={content}
        remaining={remaining}
        txHash={txHash}
        error={error}
        isBusy={isBusy}
        isConnected={isConnected}
        isChainMismatch={isChainMismatch}
        isSwitchingChain={switchingChain}
        onChange={(value) => setContent(value.slice(0, LIMIT))}
        onSubmit={onSubmit}
        onSwitchChain={() => switchChain({ chainId: base.id })}
      />

      <BottomNav />
    </main>
  );
}
