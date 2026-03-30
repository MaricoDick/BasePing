"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";
import { base } from "wagmi/chains";
import { BottomNav } from "@/components/BottomNav";
import { CountPanel } from "@/components/CountPanel";
import { MessageList } from "@/components/MessageList";
import { PingHeader } from "@/components/PingHeader";
import { WalletButton } from "@/components/WalletButton";
import { BASE_PING_ADDRESS, basePingAbi, type PingMessage } from "@/lib/basePing";

const MAX_LIST_COUNT = 20n;

function mapMessageResult(
  result:
    | {
        user: `0x${string}`;
        content: string;
        time: bigint;
      }
    | readonly [`0x${string}`, string, bigint],
  index: bigint,
): PingMessage {
  if ("user" in result) {
    return {
      index,
      user: result.user,
      content: result.content,
      time: result.time,
    };
  }

  const [user, content, time] = result;
  return { index, user, content, time };
}

export default function HomePage() {
  const publicClient = usePublicClient({ chainId: base.id });

  const {
    data: totalCount,
    isLoading: countLoading,
    isFetching: countFetching,
    refetch: refetchCount,
  } = useQuery({
    queryKey: ["ping-count"],
    queryFn: async () => {
      if (!publicClient) return 0n;
      return publicClient.readContract({
        address: BASE_PING_ADDRESS,
        abi: basePingAbi,
        functionName: "getCount",
      });
    },
    enabled: Boolean(publicClient),
    refetchInterval: 15000,
  });

  const {
    data: messages = [],
    isLoading: messagesLoading,
    isFetching: messagesFetching,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ["ping-messages", totalCount?.toString()],
    queryFn: async () => {
      if (!publicClient || !totalCount || totalCount <= 0n) return [];

      const startIndex =
        totalCount > MAX_LIST_COUNT ? totalCount - MAX_LIST_COUNT : 0n;

      const indices: bigint[] = [];
      for (let i = totalCount - 1n; i >= startIndex; i -= 1n) {
        indices.push(i);
        if (i === 0n) break;
      }

      const rows = await Promise.all(
        indices.map(async (index) => {
          const result = await publicClient.readContract({
            address: BASE_PING_ADDRESS,
            abi: basePingAbi,
            functionName: "messages",
            args: [index],
          });

          return mapMessageResult(result, index);
        }),
      );

      return rows;
    },
    enabled: Boolean(publicClient) && typeof totalCount !== "undefined",
    refetchInterval: 15000,
  });

  function handleRefresh() {
    void refetchCount();
    void refetchMessages();
  }

  return (
    <main className="app-shell">
      <PingHeader
        title="BasePing"
        subtitle="Urban short-message board: each post is permanently stored on Base."
      />

      <WalletButton />

      <CountPanel
        count={totalCount ?? 0n}
        loading={countLoading || countFetching}
      />

      <MessageList
        messages={messages}
        loading={messagesLoading || messagesFetching}
        onRefresh={handleRefresh}
      />

      <Link className="btn btn-primary" href="/compose">
        Post a New Ping
      </Link>

      <BottomNav />
    </main>
  );
}
