import React, { createContext, useContext, useState } from 'react';
import { HashchainData } from '@/types';
import { sha256 } from '@noble/hashes/sha256';

// Simulate network delay
const simulateDelay = async () => {
  const delay = Math.random() * 500 + 100;
  await new Promise(resolve => setTimeout(resolve, delay));
};

// Create the context with async methods and UI state
type AsyncExtensionContextType = {
  // UI State
  selectedHashchain: HashchainData | null;
  lastHashIndex: number;
  // Async operations
  selectHashchain: (vendorAddress: string) => Promise<void>;
  storeVendorData: (data: Pick<HashchainData, 'chainId' | 'vendorAddress' | 'amountPerHash'>) => Promise<void>;
  getVendorData: () => Promise<Pick<HashchainData, 'chainId' | 'vendorAddress' | 'amountPerHash'> | null>;
  updateHashchainDetails: (data: {
    contractAddress: string;
    numHashes: string;
    totalAmount: string;
  }) => Promise<void>;
  getNextHash: () => Promise<string>;
  getFullHashchain: () => Promise<string[]>;
  getSecret: () => Promise<string>;
  forceSync: (newLastHashIndex: number) => Promise<void>;
  readHashchain: () => Promise<HashchainData | null>;
  listHashchains: () => Promise<Array<Pick<HashchainData, 'vendorAddress' | 'chainId'>>>;
};

const MockHashChainExtensionContext = createContext<AsyncExtensionContextType | null>(null);

// Simulate "remote" storage
class MockStorage {
  private static storage: {
    hashchains: HashchainData[];
    selectedHashchainId: string | null;
    hashChain: string[];
    lastHashIndex: number;
  } = {
    hashchains: [],
    selectedHashchainId: null,
    hashChain: [],
    lastHashIndex: 0
  };

  static async read() {
    await simulateDelay();
    return { ...this.storage };
  }

  static async write(data: Partial<typeof MockStorage.storage>) {
    await simulateDelay();
    this.storage = { ...this.storage, ...data };
    return this.storage;
  }
}

// Generate hash chain (keeping this sync as it's a pure function)
const generateHashChain = (secret: string, length: number): string[] => {
  const chain: string[] = [];
  let currentHash = secret;
  
  for (let i = 0; i < length; i++) {
    currentHash = sha256(currentHash).toString();
    chain.unshift(currentHash);
  }
  
  return chain;
};

export const MockHashChainExtensionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local UI state
  const [selectedHashchain, setSelectedHashchain] = useState<HashchainData | null>(null);
  const [lastHashIndex, setLastHashIndex] = useState<number>(0);

  const selectHashchain = async (vendorAddress: string) => {
    await MockStorage.write({ selectedHashchainId: vendorAddress });
    const { hashchains } = await MockStorage.read();
    const selected = hashchains.find(hc => hc.vendorAddress === vendorAddress);
    if (selected) {
      setSelectedHashchain(selected);
      setLastHashIndex(selected.lastHashIndex);
    }
  };

  const storeVendorData = async (data: Pick<HashchainData, 'chainId' | 'vendorAddress' | 'amountPerHash'>) => {
    const { hashchains } = await MockStorage.read();
    const secret = 'initial_secret_' + Date.now();
    
    const newHashchain: HashchainData = {
      ...data,
      numHashes: '0',
      contractAddress: '',
      totalAmount: '0',
      secret,
      lastHashIndex: 0
    };
    
    await MockStorage.write({ 
      hashchains: [...hashchains, newHashchain],
      selectedHashchainId: newHashchain.vendorAddress
    });
    
    setSelectedHashchain(newHashchain);
    setLastHashIndex(0);
  };

  const updateHashchainDetails = async (data: {
    contractAddress: string;
    numHashes: string;
    totalAmount: string;
  }) => {
    if (!selectedHashchain?.secret) return;
    
    const { hashchains } = await MockStorage.read();
    
    const updatedHashchain = {
      ...selectedHashchain,
      ...data,
      lastHashIndex: 0 // Reset lastHashIndex when creating new hashchain
    };

    const updatedHashchains = hashchains.map(hc => 
      hc.vendorAddress === selectedHashchain.vendorAddress ? updatedHashchain : hc
    );

    // Generate new hash chain with the updated number of hashes
    const newHashChain = generateHashChain(
      selectedHashchain.secret,
      parseInt(data.numHashes)
    );

    // Update everything in storage
    await MockStorage.write({ 
      hashchains: updatedHashchains,
      hashChain: newHashChain,
      lastHashIndex: 0
    });
    
    // Update local state
    setSelectedHashchain(updatedHashchain);
    setLastHashIndex(0);
  };

  const getNextHash = async (): Promise<string> => {
    const { hashChain } = await MockStorage.read();
    if (!hashChain.length || lastHashIndex >= hashChain.length || !selectedHashchain) {
      return '';
    }
    
    const hash = hashChain[lastHashIndex];
    const newIndex = lastHashIndex + 1;
    
    const { hashchains } = await MockStorage.read();
    const updatedHashchain = {
      ...selectedHashchain,
      lastHashIndex: newIndex
    };
    
    const updatedHashchains = hashchains.map(hc => 
      hc.vendorAddress === selectedHashchain.vendorAddress ? updatedHashchain : hc
    );

    await MockStorage.write({ 
      hashchains: updatedHashchains,
      lastHashIndex: newIndex
    });
    
    setSelectedHashchain(updatedHashchain);
    setLastHashIndex(newIndex);
    
    return hash;
  };

  const getVendorData = async () => {
    if (!selectedHashchain) return null;
    const { chainId, vendorAddress, amountPerHash } = selectedHashchain;
    return { chainId, vendorAddress, amountPerHash };
  };

  const getFullHashchain = async (): Promise<string[]> => {
    const { hashChain } = await MockStorage.read();
    return hashChain;
  };

  const getSecret = async (): Promise<string> => {
    return selectedHashchain?.secret || '';
  };

  const forceSync = async (newLastHashIndex: number) => {
    if (!selectedHashchain) return;
    
    const updatedHashchain = {
      ...selectedHashchain,
      lastHashIndex: newLastHashIndex
    };
    
    const { hashchains } = await MockStorage.read();
    const updatedHashchains = hashchains.map(hc => 
      hc.vendorAddress === selectedHashchain.vendorAddress ? updatedHashchain : hc
    );

    await MockStorage.write({ 
      hashchains: updatedHashchains,
      lastHashIndex: newLastHashIndex
    });
    
    setSelectedHashchain(updatedHashchain);
    setLastHashIndex(newLastHashIndex);
  };

  const readHashchain = async (): Promise<HashchainData | null> => {
    const { hashchains, selectedHashchainId } = await MockStorage.read();
    if (!selectedHashchainId) return null;
    
    const hashchain = hashchains.find(hc => hc.vendorAddress === selectedHashchainId);
    return hashchain || null;
  };

  const listHashchains = async () => {
    const { hashchains } = await MockStorage.read();
    return hashchains.map(({ vendorAddress, chainId }) => ({
      vendorAddress,
      chainId,
    }));
  };

  const value: AsyncExtensionContextType = {
    // UI State
    selectedHashchain,
    lastHashIndex,
    // Async operations
    selectHashchain,
    storeVendorData,
    getVendorData,
    updateHashchainDetails,
    getNextHash,
    getFullHashchain,
    getSecret,
    forceSync,
    readHashchain,
    listHashchains
  };

  return (
    <MockHashChainExtensionContext.Provider value={value}>
      {children}
    </MockHashChainExtensionContext.Provider>
  );
};

export const useMockedChainExtension = () => {
  const context = useContext(MockHashChainExtensionContext);
  if (!context) {
    throw new Error('useMockedChainExtension must be used within a MockChainExtensionProvider');
  }
  return context;
};