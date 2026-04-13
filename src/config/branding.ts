export const BRANDING = {
  name: "Cardano Go PBL",
  tagline: "Build on Cardano with Go",
  fullTitle: "Cardano Go PBL — Build on Cardano with Go",
  description: "Learn to build on Cardano using Go libraries. Earn on-chain credentials.",
  longDescription: "Ten modules covering Go fundamentals for Cardano development — from wallet creation and transaction building to chain indexing and node communication. Complete assignments, submit evidence, and earn verifiable on-chain credentials through Andamio.",
  hero: {
    title: "cardano go pbl",
    subtitle: "Build on Cardano with Go",
  },
  logo: {
    favicon: "/favicon.ico",
    ogImage: "/og-image.png",
    heroSymbol: "/favicon.svg",
    wordmark: "/favicon.svg",
  },
  links: {
    andamio: "https://andamio.io",
    docs: "https://docs.andamio.io",
    github: "https://github.com/Andamio-Platform/cardano-go-pbl-app",
    githubFork: "https://github.com/Andamio-Platform/cardano-go-pbl-app/fork",
    githubIssues: "https://github.com/Andamio-Platform/cardano-go-pbl-app/issues",
    gouroboros: "https://github.com/blinklabs-io/gouroboros",
    bursa: "https://github.com/blinklabs-io/bursa",
    apollo: "https://github.com/Salvionied/apollo",
    adder: "https://github.com/blinklabs-io/adder",
  },
} as const;

export function getPageTitle(pageTitle?: string): string {
  if (!pageTitle) return BRANDING.fullTitle;
  return `${pageTitle} | ${BRANDING.name}`;
}

export type Branding = typeof BRANDING;
