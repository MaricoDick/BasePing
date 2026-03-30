import type { Abi } from "viem";

export const BASE_PING_ADDRESS =
  "0xACdB798369B79c874937BfbA941D3a98EE766EfF" as const;

export const basePingAbi = [
  {
    type: "function",
    name: "send",
    stateMutability: "nonpayable",
    inputs: [{ name: "content", type: "string" }],
    outputs: [],
  },
  {
    type: "function",
    name: "getCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "messages",
    stateMutability: "view",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [
      { name: "user", type: "address" },
      { name: "content", type: "string" },
      { name: "time", type: "uint256" },
    ],
  },
] as const satisfies Abi;

export type PingMessage = {
  index: bigint;
  user: `0x${string}`;
  content: string;
  time: bigint;
};
