import { Vendor, Channel, Payment } from "@prisma/client";
import { createPublicClient, http, createWalletClient } from "viem";
import { mainnet } from "viem/chains";
import { SmartContractMock } from "./smartContractMock";

type ContractData = {
  vendorAddress: string;
  userAddress: string;
  tailHash: string;
  chainId: number;
};

export class BlockchainService {
  private contracts = new Map<string, SmartContractMock>();
  private publicClient: any;
  private walletClient: any;

  constructor() {
    // Initialize blockchain clients
    this.publicClient = createPublicClient({
      chain: mainnet,
      transport: http(),
    });

    this.walletClient = createWalletClient({
      chain: mainnet,
      transport: http(),
    });
  }

  async verifyContract(
    contractAddress: string,
    vendor: Vendor
  ): Promise<ContractData> {
    // Real implementation would use ABI and blockchain calls
    const contract = this.contracts.get(contractAddress);

    if (!contract) {
      throw new Error("Contract not found on blockchain");
    }

    const details = await contract.getChannelDetails();

    if (details.chainId !== vendor.chainId) {
      throw new Error("Contract chain ID doesn't match vendor's chain");
    }

    if (details.vendorAddress !== vendor.address) {
      throw new Error("Contract vendor address doesn't match");
    }

    return details;
  }

  async submitSettlement(
    contractAddress: string,
    lastHash: string,
    lastIndex: number
  ): Promise<string> {
    const contract = this.contracts.get(contractAddress);

    if (!contract) {
      throw new Error("Contract not found");
    }

    try {
      const txHash = await contract.closeChannel(lastHash, lastIndex);
      return txHash;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Settlement failed: ${error.message}`);
      } else {
        throw new Error("Settlement failed: Unknown error");
      }
    }
  }

  // For testing/mocking purposes
  registerMockContract(address: string, contract: SmartContractMock) {
    this.contracts.set(address, contract);
  }
}
