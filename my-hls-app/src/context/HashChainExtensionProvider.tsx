import React, { createContext, useContext, useState, ReactNode } from "react";
import { z } from "zod";
import {
  HashChainElementSchema,
  SecretLengthSchema,
} from "@/utils/zod-schemas";
import { generateHashChain } from "@/utils/HashChainUtils";

interface HashChainElement {
  hash: string;
  index: number;
}

interface HashChainContextType {
  hashChainElements: HashChainElement[];
  tail: string;
  fullHashChain: string[];
  secret: string;
  length: number;
  fetchAndPopHashFromHashChain: () => Promise<HashChainElement>;
  fetchTail: () => Promise<string>;
  fetchHashChain: () => Promise<string[]>;
  fetchSecretAndLength: () => Promise<{
    secret: string;
    length: number;
    tail: string;
  }>;
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
    z.infer<typeof HashChainElementSchema>[]
  >([]);
  const [tail, setTail] = useState<string>("");
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

  const fetchAndPopHashFromHashChain = async (): Promise<
    z.infer<typeof HashChainElementSchema>
  > => {
    window.postMessage({ type: "RequestHashChain" }, "*");
    const response = await createEventPromise<{
      type: string;
      data: { hash: string; index: number };
    }>("HashChain");
    console.log(response.data);
    const newElement = HashChainElementSchema.parse({
      hash: response.data.hash,
      index: response.data.index,
    });
    setHashChainElements((prev) => [...prev, newElement]);
    return newElement;
  };

  const fetchTail = async (): Promise<string> => {
    window.postMessage({ type: "Send_h(100)" }, "*");
    const response = await createEventPromise<{ type: string; data: string }>(
      "Recover_h(100)"
    );
    setTail(response.data);
    return response.data;
  };

  const fetchHashChain = async (): Promise<string[]> => {
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
      const { secret, length } = await fetchSecretAndLength();
      const chain = generateHashChain(secret, length);
      const tail = chain[chain.length - 1];
      return { secret, length, tail };
    } catch (error) {
      console.error("Error fetching payword from extension:", error);
      throw error;
    }
  };

  const fetchSecretAndLength = async (): Promise<
    z.infer<typeof SecretLengthSchema>
  > => {
    window.postMessage({ type: "RequestSecretLength" }, "*");
    try {
      const response = await createEventPromise<{
        type: string;
        data: {
          secret: string;
          length: number;
          tail: string;
        };
      }>("SecretLength");
      const validatedResponse = SecretLengthSchema.parse({
        secret: response.data.secret,
        length: response.data.length,
        tail: response.data.tail,
      });
      setSecret(validatedResponse.secret);
      setLength(validatedResponse.length);
      return validatedResponse;
    } catch (error) {
      console.error("Error in fetchSecretLength:", error);
      throw error;
    }
  };

  const contextValue: HashChainContextType = {
    hashChainElements,
    tail,
    fullHashChain,
    secret,
    length,
    fetchAndPopHashFromHashChain,
    fetchTail,
    fetchHashChain,
    fetchSecretAndLength,
    fetchPaywordFromExtension,
  };

  return (
    <WalletHashChainContext.Provider value={contextValue}>
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
