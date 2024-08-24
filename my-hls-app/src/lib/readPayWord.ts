import { type PublicClient } from "viem";
import { getClientByChainId } from "./supportedChain";
import { bigint } from "zod";

export const ethWordAbi = [
  {
    type: "constructor",
    inputs: [
      { name: "to", internalType: "address", type: "address" },
      { name: "wordCount", internalType: "uint256", type: "uint256" },
      { name: "tip", internalType: "bytes32", type: "bytes32" },
    ],
    stateMutability: "payable",
  },
  { type: "error", inputs: [], name: "ReentrancyGuardReentrantCall" },
  {
    type: "function",
    inputs: [],
    name: "channelRecipient",
    outputs: [{ name: "", internalType: "address payable", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "channelSender",
    outputs: [{ name: "", internalType: "address payable", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "channelTip",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "_word", internalType: "bytes32", type: "bytes32" },
      { name: "_wordCount", internalType: "uint256", type: "uint256" },
    ],
    name: "closeChannel",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "_word", internalType: "bytes32", type: "bytes32" },
      { name: "_wordCount", internalType: "uint256", type: "uint256" },
    ],
    name: "simulateCloseChannel",
    outputs: [
      { name: "", internalType: "bool", type: "bool" },
      { name: "", internalType: "uint256", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "totalWordCount",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
] as const;

export const getPaywordContractByAddressAndChainId = async (
  chainId: number,
  smartContractAddress: `0x${string}`
): Promise<{
  channelRecipient: `0x${string}`;
  channelSender: `0x${string}`;
  channelTip: `0x${string}`;
  channelAmmount: bigint;
  channelHashchainSize: bigint;
  nativeCurrency: {
    decimals: number;
    name: string;
    symbol: string;
  };
}> => {
  const client: PublicClient = getClientByChainId(chainId);

  if (!client.chain) {
    throw new Error("Chain not found");
  }
  const channelRecipient = await client.readContract({
    address: smartContractAddress,
    abi: ethWordAbi,
    functionName: "channelRecipient",
  });
  const channelSender = await client.readContract({
    address: smartContractAddress,
    abi: ethWordAbi,
    functionName: "channelSender",
  });
  const channelTip = await client.readContract({
    address: smartContractAddress,
    abi: ethWordAbi,
    functionName: "channelTip",
  });

  const channelAmmount: bigint = await client.getBalance({
    address: smartContractAddress,
  });

  const channelHashchainSizeWthoutTip = await client.readContract({
    address: smartContractAddress,
    abi: ethWordAbi,
    functionName: "totalWordCount",
  });

  const channelHashchainSize = channelHashchainSizeWthoutTip + BigInt(1);

  return {
    channelRecipient,
    channelSender,
    channelTip,
    channelAmmount,
    channelHashchainSize,
    nativeCurrency: {
      ...client.chain?.nativeCurrency,
    },
  };
};

// create a function to validat if the smart contract is the same as the on expected
export const validatePaywordContractByAddressAndChainId = async (
  chainId: number,
  smartContractAddress: `0x${string}`,
  hashchainSize: bigint,
  // expectedChannelRecipient: `0x${string}`,
  // expectedChannelSender: `0x${string}`,
  expectedChannelTip: `0x${string}`
): Promise<boolean> => {
  const contract = await getPaywordContractByAddressAndChainId(
    chainId,
    smartContractAddress
  );
  return (
    // contract.channelRecipient === expectedChannelRecipient &&
    // contract.channelSender === expectedChannelSender &&
    contract.channelTip === expectedChannelTip,
    contract.channelHashchainSize === hashchainSize
  );
};
