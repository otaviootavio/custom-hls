import React, { createContext, useState, useContext, ReactNode } from "react";
import keccak from "keccak";

// Interface for the context props
interface HashChainContextProps {
  hashChain: string[];
  setHashChain: (hashChain: string[]) => void;
  generateHashChain: (hashZero: string, numHashes: number) => void;
  popHash: () => string | null;
}

// Create the context
const HashChainContext = createContext<HashChainContextProps | undefined>(
  undefined
);

// HashChainProvider component
export const HashChainProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [hashChain, setHashChain] = useState<string[]>([]);

  // Function to generate a new hash chain based on an initial hash and a specified number of hashes
  const generateHashChain = (hashZero: string, numHashes: number) => {
    let currentHash = hashZero;
    const chain = [currentHash];
    for (let i = 1; i < numHashes; i++) {
      currentHash = keccak("keccak256")
        .update(Buffer.from(currentHash, "utf-8"))
        .digest("hex");
      chain.push(currentHash);
    }
    setHashChain(chain);
  };

  // Function to pop the last hash from the hash chain and return it
  const popHash = (): string | null => {
    if (hashChain.length === 0) {
      return null;
    }
    const lastHash = hashChain[hashChain.length - 1];
    setHashChain((prev) => prev.slice(0, -1));
    return lastHash;
  };

  return (
    <HashChainContext.Provider
      value={{ hashChain, setHashChain, generateHashChain, popHash }}
    >
      {children}
    </HashChainContext.Provider>
  );
};

// Hook to use the HashChainContext
export const useHashChain = (): HashChainContextProps => {
  const context = useContext(HashChainContext);
  if (!context) {
    throw new Error("useHashChain must be used within a HashChainProvider");
  }
  return context;
};
