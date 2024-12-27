import { HashchainData, HashchainId, StorageData, VendorData } from '@/types';
import { sha256 } from '@noble/hashes/sha256';


// Utility functions
const simulateDelay = async () => {
  const delay = Math.random() * 500 + 100;
  await new Promise(resolve => setTimeout(resolve, delay));
};

const generateHashchainId = (): HashchainId => {
  return `${Date.now()}_${crypto.randomUUID()}`;
};

const generateHashChain = (secret: string, length: number): string[] => {
  const chain: string[] = [];
  let currentHash = secret;
  
  for (let i = 0; i < length; i++) {
    currentHash = sha256(currentHash).toString();
    chain.unshift(currentHash);
  }
  
  return chain;
};

export class MockStorage {
  private static storage: StorageData = {
    hashchains: {},
    selectedHashchainId: null
  };

  // Create new hashchain
  static async createHashchain(
    vendorData: VendorData,
    secret: string
  ): Promise<HashchainId> {
    await simulateDelay();
    
    const hashchainId = generateHashchainId();
    const hashchainData: HashchainData = {
      vendorData,
      secret,
      hashes: [], // Initially empty until numHashes is set
      lastIndex: 0,
      createdAt: Date.now()
    };

    this.storage.hashchains[hashchainId] = hashchainData;
    return hashchainId;
  }

  // Get all hashchains for a vendor
  static async getVendorHashchains(
    vendorAddress: string
  ): Promise<{ hashchainId: HashchainId; data: HashchainData }[]> {
    await simulateDelay();

    return Object.entries(this.storage.hashchains)
      .filter(([_, data]) => data.vendorData.vendorAddress === vendorAddress)
      .map(([hashchainId, data]) => ({ hashchainId, data }));
  }

  // Get specific hashchain data
  static async getHashchain(
    hashchainId: HashchainId
  ): Promise<HashchainData | null> {
    await simulateDelay();
    return this.storage.hashchains[hashchainId] || null;
  }

  // Update hashchain details (e.g., after contract deployment)
  static async updateHashchain(
    hashchainId: HashchainId,
    data: Partial<Omit<HashchainData, 'vendorData' | 'secret' | 'hashes' | 'createdAt'>>
  ): Promise<void> {
    await simulateDelay();
    
    const hashchain = this.storage.hashchains[hashchainId];
    if (!hashchain) throw new Error('Hashchain not found');

    // If numHashes is provided, generate new hash chain
    if (data.numHashes) {
      hashchain.hashes = generateHashChain(
        hashchain.secret,
        parseInt(data.numHashes)
      );
      // Reset lastIndex when generating new hashes
      data.lastIndex = 0;
    }

    // Update hashchain data
    this.storage.hashchains[hashchainId] = {
      ...hashchain,
      ...data
    };
  }

  // Get next hash from chain
  static async getNextHash(hashchainId: HashchainId): Promise<string | null> {
    await simulateDelay();
    
    const hashchain = this.storage.hashchains[hashchainId];
    if (!hashchain) throw new Error('Hashchain not found');

    if (hashchain.lastIndex >= hashchain.hashes.length) return null;

    const hash = hashchain.hashes[hashchain.lastIndex];
    
    // Update last index
    hashchain.lastIndex += 1;
    
    return hash;
  }

  // Get all hashes for a chain
  static async getFullHashchain(hashchainId: HashchainId): Promise<string[]> {
    await simulateDelay();
    return this.storage.hashchains[hashchainId]?.hashes || [];
  }

  // Get secret for a chain
  static async getSecret(hashchainId: HashchainId): Promise<string | null> {
    await simulateDelay();
    return this.storage.hashchains[hashchainId]?.secret || null;
  }

  // Force sync last index
  static async syncHashchainIndex(
    hashchainId: HashchainId,
    newIndex: number
  ): Promise<void> {
    await simulateDelay();
    
    const hashchain = this.storage.hashchains[hashchainId];
    if (!hashchain) throw new Error('Hashchain not found');

    hashchain.lastIndex = newIndex;
  }

  // Select active hashchain
  static async selectHashchain(hashchainId: HashchainId | null): Promise<void> {
    await simulateDelay();
    
    if (hashchainId && !this.storage.hashchains[hashchainId]) {
      throw new Error('Hashchain not found');
    }
    
    this.storage.selectedHashchainId = hashchainId;
  }

  // Get selected hashchain
  static async getSelectedHashchain(): Promise<{
    hashchainId: HashchainId;
    data: HashchainData;
  } | null> {
    await simulateDelay();
    
    const { selectedHashchainId } = this.storage;
    if (!selectedHashchainId) return null;

    const data = this.storage.hashchains[selectedHashchainId];
    if (!data) return null;

    return {
      hashchainId: selectedHashchainId,
      data
    };
  }
}