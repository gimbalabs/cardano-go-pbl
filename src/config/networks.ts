export type AndamioNetwork = "preprod" | "mainnet";

export interface NetworkConfig {
  gatewayUrl: string;
  cardanoNetwork: "preprod" | "mainnet";
  accessTokenPolicyId: string;
  courseId: string;
}

export const NETWORKS: Record<AndamioNetwork, NetworkConfig> = {
  preprod: {
    gatewayUrl: "https://preprod.api.andamio.io",
    cardanoNetwork: "preprod",
    accessTokenPolicyId: "aa1cbea2524d369768283d7c8300755880fd071194a347cf0a4e274f",
    courseId: "TODO_CREATE_PREPROD_COURSE",
  },
  mainnet: {
    gatewayUrl: "https://mainnet.api.andamio.io",
    cardanoNetwork: "mainnet",
    accessTokenPolicyId: "ff5d0640b5a2717646d3f3151d100d57d194fdfa88cacf03f9edc568",
    courseId: "b7795c1b9080507786be4de6cf798de780e0d5cba3244ad1a286f210",
  },
};

export function resolveNetwork(value: string | undefined): NetworkConfig {
  const network = (value ?? "preprod") as AndamioNetwork;
  const config = NETWORKS[network];
  if (!config) {
    throw new Error(
      `Unknown ANDAMIO_NETWORK: "${value}". Expected "preprod" or "mainnet".`
    );
  }
  return config;
}
