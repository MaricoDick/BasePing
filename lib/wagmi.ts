import { Attribution } from "ox/erc8021";
import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";

export const BUILDER_CODE = "bc_qhdd2fs2";
export const ENCODED_DATA_SUFFIX =
  "0x62635f71686464326673320b0080218021802180218021802180218021";

export const DATA_SUFFIX = ENCODED_DATA_SUFFIX;

export const COMPUTED_DATA_SUFFIX = Attribution.toDataSuffix({
  codes: [BUILDER_CODE],
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
