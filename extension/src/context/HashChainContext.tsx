import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { type HashObject } from "../utils/interfaces";
import { HashRepository } from "../repositories/HashRepository";
import { createHashChainFromSecretAndMaxIndex } from "../utils/UsefulFunctions";
import { stringToBytes } from "viem";

interface HashChainContextType {
  hashChains: HashObject[];
  selectedHashChain: HashObject | null;
  isLoading: boolean;
  error: string | null;
  selectHashChain: (key: string) => Promise<void>;
  deleteHashChain: (key: string) => Promise<void>;
  addNewHashChain: (
    secret: string,
    length: number,
    key: string
  ) => Promise<void>;
}

const HashChainContext = createContext<HashChainContextType | undefined>(
  undefined
);

export const HashChainProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [hashChains, setHashChains] = useState<HashObject[]>([]);
  const [selectedHashChain, setSelectedHashChain] = useState<HashObject | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const hashRepo = new HashRepository(); // Initialize the repository

  useEffect(() => {
    const fetchHashChains = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const chains = await hashRepo.getAllHashChains();
        setHashChains(chains);
        const selectedChain = await hashRepo.getSelectedHashChain();
        if (selectedChain) {
          setSelectedHashChain(selectedChain);
        }
      } catch (error) {
        setError("Error fetching hash chains.");
        console.error("Error fetching hash chains:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHashChains();
  }, []);

  const selectHashChain = async (key: string) => {
    const chain = hashChains.find((chain) => chain.key === key);
    setSelectedHashChain(chain || null);
    try {
      await hashRepo.setSelectedKey(key);
    } catch (error) {
      setError("Error setting selected hash chain.");
      console.error("Error setting selected hash chain:", error);
    }
  };

  const deleteHashChain = async (key: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await hashRepo.deleteHashChain(key);
      setHashChains((prevChains) =>
        prevChains.filter((chain) => chain.key !== key)
      );
      if (selectedHashChain && selectedHashChain.key === key) {
        setSelectedHashChain(null);
      }
    } catch (error) {
      setError("Error deleting hash chain.");
      console.error("Error deleting hash chain:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addNewHashChain = async (
    secret: string,
    length: number,
    key: string
  ) => {
    setIsLoading(true);
    setError(null);
    const newChain = createHashChainFromSecretAndMaxIndex(
      stringToBytes(secret, { size: 32 }),
      length - 1
    );
    console.log(newChain);
    const newHashObject: HashObject = {
      address_contract: "",
      address_to: "",
      amountInEth: "",
      chainId: 0,
      length,
      hashchain: newChain,
      isValid: false,
      key,
      tail: newChain[newChain.length - 1],
      secret: secret,
      indexOfLastHashSend: length,
    };
    try {
      await hashRepo.addHashChain(newHashObject);
      setHashChains((prevChains) => [...prevChains, newHashObject]);
    } catch (error) {
      setError("Error adding new hash chain.");
      console.error("Error adding new hash chain:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <HashChainContext.Provider
      value={{
        hashChains,
        selectedHashChain,
        isLoading,
        error,
        selectHashChain,
        deleteHashChain,
        addNewHashChain,
      }}
    >
      {children}
    </HashChainContext.Provider>
  );
};

export const useHashChain = () => {
  const context = useContext(HashChainContext);
  if (context === undefined) {
    throw new Error("useHashChain must be used within a HashChainProvider");
  }
  return context;
};
