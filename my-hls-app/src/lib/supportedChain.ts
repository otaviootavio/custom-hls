import { Chain, createPublicClient, http, PublicClient } from "viem";

export const xrpEVMSidechain: Chain = {
  id: 1440002,
  name: "XRP EVM Sidechain",
  nativeCurrency: {
    decimals: 18,
    name: "XRP",
    symbol: "XRP",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-evm-sidechain.xrpl.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "XRP Ledger Explorer",
      url: "https://evm-sidechain.xrpl.org",
    },
  },
};

export const sepolia: Chain = {
  id: 11155111,
  name: "Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Sepolia Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.sepolia.org"],
    },
  },
  blockExplorers: {
    default: { name: "Etherscan", url: "https://sepolia.etherscan.io" },
  },
  testnet: true,
};

export const defaultChains: Chain[] = [xrpEVMSidechain, sepolia];

export function getChainById(chains: Chain[], id: number): Chain | undefined {
  return chains.find((chain) => chain.id === id);
}

export function getAllChains(chains: Chain[]): Chain[] {
  return chains;
}

export function getClientByChainId(
  chains: Chain[],
  chainId: number
): PublicClient {
  const chain = getChainById(chains, chainId);
  if (!chain) {
    throw new Error(`Chain with id ${chainId} not found`);
  }

  const client = createPublicClient({
    chain: chain,
    transport: http(),
  });

  return client;
}

export function parseChainIdToChainName(
  chains: Chain[],
  chainId: number
): string {
  const chain: Chain | undefined = getChainById(chains, chainId);
  console.log(chainId);
  if (!!chain) {
    return chain.name;
  }
  throw new Error(`Chain with id ${chainId} not found`);
}
