import { resolveNetwork, type NetworkConfig } from "@/config/networks";

export const CURRENT_NETWORK: NetworkConfig = resolveNetwork(
  import.meta.env.PUBLIC_ANDAMIO_NETWORK
);
