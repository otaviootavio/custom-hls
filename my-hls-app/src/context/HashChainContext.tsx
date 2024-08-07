import React, { createContext, useState, useContext, ReactNode } from "react";

// Interface for the context props
interface HashChainContextProps {
  hashChain: string[];
  setHashChain: (hashChain: string[]) => void;
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
    <HashChainContext.Provider value={{ hashChain, setHashChain, popHash }}>
      {children}
    </HashChainContext.Provider>
  );
};

// Hook to use the HashChainContext
export const useHashChainContext = (): HashChainContextProps => {
  const context = useContext(HashChainContext);
  if (!context) {
    throw new Error(
      "useHashChainContext must be used within a HashChainProvider"
    );
  }
  return context;
};
