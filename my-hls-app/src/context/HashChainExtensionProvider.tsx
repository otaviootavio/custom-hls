import { generateHashChain } from "@/lib/HashChainUtils";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface HashChainContextType {
  hashChainElements: { data: string; index: number }[];
  h100: string;
  fullHashChain: string[];
  secret: string;
  length: number;
  fetchHashChain: () => Promise<{ data: string; index: number }>;
  sendH100Once: () => Promise<string>;
  fetchFullHashChain: () => Promise<string[]>;
  fetchSecretLength: () => Promise<{ secret: string; length: number }>;
  fetchPaywordFromExtension: () => Promise<{
    secret: string;
    length: number;
    tail: string;
  }>;
}

interface HashChainExtensionProviderProps {
  children: ReactNode;
}

const WalletHashChainContext = createContext<HashChainContextType | undefined>(
  undefined
);

export const HashChainExtensionProvider: React.FC<
  HashChainExtensionProviderProps
> = ({ children }) => {
  const [hashChainElements, setHashChainElements] = useState<
    { data: string; index: number }[]
  >([]);
  const [h100, setH100] = useState<string>("");
  const [fullHashChain, setFullHashChain] = useState<string[]>([]);
  const [secret, setSecret] = useState<string>("");
  const [length, setLength] = useState<number>(0);

  const createEventPromise = <T,>(eventType: string): Promise<T> => {
    return new Promise((resolve) => {
      const handler = (event: MessageEvent) => {
        if (event.data.type === eventType) {
          window.removeEventListener("message", handler);
          resolve(event.data as T);
        }
      };
      window.addEventListener("message", handler);
    });
  };

  const fetchHashChain = async (): Promise<{ data: string; index: number }> => {
    window.postMessage({ type: "RequestHashChain" }, "*");
    const response = await createEventPromise<{
      type: string;
      data: string;
      index: number;
    }>("HashChain");
    const newElement = { data: response.data, index: response.index };
    setHashChainElements((prev) => [...prev, newElement]);
    return newElement;
  };

  const sendH100Once = async (): Promise<string> => {
    window.postMessage({ type: "Send_h(100)" }, "*");
    const response = await createEventPromise<{ type: string; data: string }>(
      "Recover_h(100)"
    );
    setH100(response.data);
    return response.data;
  };

  const fetchFullHashChain = async (): Promise<string[]> => {
    window.postMessage({ type: "RequestFullHashChain" }, "*");
    const response = await createEventPromise<{ type: string; data: string[] }>(
      "fullHashChain"
    );
    setFullHashChain(response.data);
    return response.data;
  };

  const fetchPaywordFromExtension = async (): Promise<{
    secret: string;
    length: number;
    tail: string;
  }> => {
    try {
      const { secret, length } = await fetchSecretLength();
      const chain = generateHashChain(secret, length);
      const tail = chain[chain.length - 1];
      return { secret, length, tail };
    } catch (error) {
      console.error("Error fetching payword from extension:", error);
      throw error;
    }
  };

  const fetchSecretLength = async (): Promise<{
    secret: string;
    length: number;
  }> => {
    window.postMessage({ type: "RequestSecretLength" }, "*");
    try {
      const response = await createEventPromise<{
        type: string;
        secret: string;
        length: number;
      }>("SecretLength");
      setSecret(response.secret);
      setLength(response.length);
      return { secret: response.secret, length: response.length };
    } catch (error) {
      console.error("Error in fetchSecretLength:", error);
      throw error;
    }
  };

  return (
    <WalletHashChainContext.Provider
      value={{
        hashChainElements,
        h100,
        fullHashChain,
        secret,
        length,
        fetchHashChain,
        sendH100Once,
        fetchFullHashChain,
        fetchSecretLength,
        fetchPaywordFromExtension,
      }}
    >
      {children}
    </WalletHashChainContext.Provider>
  );
};

export const useHashChainFromExtension = () => {
  const context = useContext(WalletHashChainContext);
  if (context === undefined) {
    throw new Error(
      "useHashChain must be used within a HashChainExtensionProvider"
    );
  }
  return context;
};
