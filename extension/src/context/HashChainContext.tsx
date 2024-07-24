import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { HashObject } from "../utils/interfaces";
import { HashRepository } from "../repositories/HashRepository";
import { createHashChain } from "../utils/UsefulFunctions";
interface HashChainContextType {
  hashChains: HashObject[];
  selectedHashChain: HashObject | null;
  fetchHashChains: () => Promise<void>;
  selectHashChain: (key: string) => void;
  deleteHashChain: (key: string) => Promise<void>;
  addNewHashChain: (secret: string, length: number, key: string) => void;
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

  const hashRepo = new HashRepository(); // Initialize the repository

  const fetchHashChains = async () => {
    try {
      const chains = await hashRepo.getAllHashChains();
      setHashChains(chains);
      const selectedKey = await chrome.storage.local.get("selectedKey");
      if (selectedKey.selectedKey) {
        selectHashChain(selectedKey.selectedKey);
      }
    } catch (error) {
      console.error("Error fetching hash chains:", error);
    }
  };

  const selectHashChain = (key: string) => {
    const chain = hashChains.find((chain) => chain.key === key);
    setSelectedHashChain(chain || null);
    chrome.storage.local.set({ selectedKey: key });
  };

  const deleteHashChain = async (key: string) => {
    try {
      await hashRepo.deleteHashChain(key);
      setHashChains((prevChains) =>
        prevChains.filter((chain) => chain.key !== key)
      );
    } catch (error) {
      console.error("Error deleting hash chain:", error);
    }
  };

  const addNewHashChain = async (
    secret: string,
    length: number,
    key: string
  ) => {
    const newChain = createHashChain(secret, length);
    const newHashObject: HashObject = {
      address_contract: "",
      address_to: "",
      length,
      hashchain: newChain,
      isValid: false,
      key,
      tail: newChain[newChain.length - 1],
    };
    try {
      await hashRepo.addOrUpdateHashChain(newHashObject);
      setHashChains((prevChains) => [...prevChains, newHashObject]);
    } catch (error) {
      console.error("Error adding new hash chain:", error);
    }
  };

  useEffect(() => {
    fetchHashChains();
  }, []);

  return (
    <HashChainContext.Provider
      value={{
        hashChains,
        selectedHashChain,
        fetchHashChains,
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
