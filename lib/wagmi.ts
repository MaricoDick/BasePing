import { Attribution } from "ox/erc8021";
import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";

export const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: ["BUILDER_CODE_PLACEHOLDER"],
});

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: "BasePing",
    }),
    injected(),
  ],
  transports: { [base.id]: http() },
  dataSuffix: DATA_SUFFIX,
  ssr: true,
});
