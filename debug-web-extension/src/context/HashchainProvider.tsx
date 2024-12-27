import { HashchainData, HashchainId, VendorData } from '@/types';
import React, { createContext, useContext, useState, useCallback } from 'react';

// Types from storage

// Define storage interface
interface StorageInterface {
  createHashchain: (vendorData: VendorData, secret: string) => Promise<HashchainId>;
  getHashchain: (hashchainId: HashchainId) => Promise<HashchainData | null>;
  getVendorHashchains: (vendorAddress: string) => Promise<Array<{
    hashchainId: HashchainId;
    data: HashchainData;
  }>>;
  selectHashchain: (hashchainId: HashchainId | null) => Promise<void>;
  getSelectedHashchain: () => Promise<{
    hashchainId: HashchainId;
    data: HashchainData;
  } | null>;
  getNextHash: (hashchainId: HashchainId) => Promise<string | null>;
  getFullHashchain: (hashchainId: HashchainId) => Promise<string[]>;
  syncHashchainIndex: (hashchainId: HashchainId, newIndex: number) => Promise<void>;
  updateHashchain: (hashchainId: HashchainId, data: Partial<HashchainData>) => Promise<void>;
}

// Context type definition
interface HashchainContextType {
  // State
  selectedHashchain: { hashchainId: HashchainId; data: HashchainData } | null;
  loading: boolean;
  error: Error | null;

  // Vendor Operations
  initializeHashchain: (vendorData: VendorData) => Promise<HashchainId>;
  selectHashchain: (hashchainId: HashchainId) => Promise<void>;
  listVendorHashchains: (vendorAddress: string) => Promise<Array<{
    hashchainId: HashchainId;
    data: HashchainData;
  }>>;

  // Hash Operations
  getNextHash: () => Promise<string | null>;
  getAllHashes: () => Promise<string[]>;
  syncIndex: (newIndex: number) => Promise<void>;

  // Contract Operations
  updateContractDetails: (details: {
    contractAddress: string;
    numHashes: string;
    totalAmount: string;
  }) => Promise<void>;
}

const HashchainContext = createContext<HashchainContextType | null>(null);

interface HashchainProviderProps {
  children: React.ReactNode;
  storage: StorageInterface;
}

export const HashchainProvider: React.FC<HashchainProviderProps> = ({ 
  children,
  storage 
}) => {
  const [selectedHashchain, setSelectedHashchain] = useState<{
    hashchainId: HashchainId;
    data: HashchainData;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Helper to wrap async operations with loading and error handling
  const withLoadingAndError = async <T,>(
    operation: () => Promise<T>
  ): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      return await operation();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Initialize new hashchain
  const initializeHashchain = useCallback(async (vendorData: VendorData) => {
    return withLoadingAndError(async () => {
      const secret = `initial_secret_${Date.now()}`;
      const hashchainId = await storage.createHashchain(vendorData, secret);
      
      // Auto-select the newly created hashchain
      const hashchain = await storage.getHashchain(hashchainId);
      if (!hashchain) throw new Error('Failed to create hashchain');
      
      await storage.selectHashchain(hashchainId);
      setSelectedHashchain({ hashchainId, data: hashchain });
      
      return hashchainId;
    });
  }, [storage]);

  // Select existing hashchain
  const selectHashchain = useCallback(async (hashchainId: HashchainId) => {
    return withLoadingAndError(async () => {
      const hashchain = await storage.getHashchain(hashchainId);
      if (!hashchain) throw new Error('Hashchain not found');

      await storage.selectHashchain(hashchainId);
      setSelectedHashchain({ hashchainId, data: hashchain });
    });
  }, [storage]);

  // List all hashchains for a vendor
  const listVendorHashchains = useCallback(async (vendorAddress: string) => {
    return withLoadingAndError(() => 
      storage.getVendorHashchains(vendorAddress)
    );
  }, [storage]);

  // Get next hash from chain
  const getNextHash = useCallback(async () => {
    return withLoadingAndError(async () => {
      if (!selectedHashchain) throw new Error('No hashchain selected');

      const hash = await storage.getNextHash(selectedHashchain.hashchainId);
      if (hash) {
        // Update local state with new index
        const updatedHashchain = await storage.getHashchain(selectedHashchain.hashchainId);
        if (updatedHashchain) {
          setSelectedHashchain({
            hashchainId: selectedHashchain.hashchainId,
            data: updatedHashchain
          });
        }
      }
      return hash;
    });
  }, [selectedHashchain, storage]);

  // Get all hashes
  const getAllHashes = useCallback(async () => {
    return withLoadingAndError(async () => {
      if (!selectedHashchain) throw new Error('No hashchain selected');
      return storage.getFullHashchain(selectedHashchain.hashchainId);
    });
  }, [selectedHashchain, storage]);

  // Sync hashchain index
  const syncIndex = useCallback(async (newIndex: number) => {
    return withLoadingAndError(async () => {
      if (!selectedHashchain) throw new Error('No hashchain selected');

      await storage.syncHashchainIndex(selectedHashchain.hashchainId, newIndex);
      
      // Update local state
      const updatedHashchain = await storage.getHashchain(selectedHashchain.hashchainId);
      if (!updatedHashchain) throw new Error('Failed to sync index');
      
      setSelectedHashchain({
        hashchainId: selectedHashchain.hashchainId,
        data: updatedHashchain
      });
    });
  }, [selectedHashchain, storage]);

  // Update contract details
  const updateContractDetails = useCallback(async (details: {
    contractAddress: string;
    numHashes: string;
    totalAmount: string;
  }) => {
    return withLoadingAndError(async () => {
      if (!selectedHashchain) throw new Error('No hashchain selected');

      await storage.updateHashchain(selectedHashchain.hashchainId, details);
      
      // Update local state
      const updatedHashchain = await storage.getHashchain(selectedHashchain.hashchainId);
      if (!updatedHashchain) throw new Error('Failed to update contract details');
      
      setSelectedHashchain({
        hashchainId: selectedHashchain.hashchainId,
        data: updatedHashchain
      });
    });
  }, [selectedHashchain, storage]);

  // Initialize selected hashchain from storage
  React.useEffect(() => {
    const initializeFromStorage = async () => {
      try {
        const stored = await storage.getSelectedHashchain();
        if (stored) {
          setSelectedHashchain(stored);
        }
      } catch (error) {
        console.error('Failed to initialize from storage:', error);
      }
    };

    initializeFromStorage();
  }, [storage]);

  const value: HashchainContextType = {
    // State
    selectedHashchain,
    loading,
    error,
    // Operations
    initializeHashchain,
    selectHashchain,
    listVendorHashchains,
    getNextHash,
    getAllHashes,
    syncIndex,
    updateContractDetails
  };

  return (
    <HashchainContext.Provider value={value}>
      {children}
    </HashchainContext.Provider>
  );
};

// Custom hook for using the context
export const useHashchain = () => {
  const context = useContext(HashchainContext);
  if (!context) {
    throw new Error('useHashchain must be used within a HashchainProvider');
  }
  return context;
};