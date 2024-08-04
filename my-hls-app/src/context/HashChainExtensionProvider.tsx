import { generateHashChain } from "@/lib/HashChainUtils";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { z } from "zod";
import {
  HashChainContextSchema,
  HashChainElementSchema,
  SecretLengthSchema,
} from "@/utils/zod-schemas";

type HashChainContextType = z.infer<typeof HashChainContextSchema>;

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

  const fetchHashChain = async (): Promise<
    z.infer<typeof HashChainElementSchema>
  > => {
    window.postMessage({ type: "RequestHashChain" }, "*");
    const response = await createEventPromise<{
      type: string;
      data: string;
      index: number;
    }>("HashChain");
    const newElement = HashChainElementSchema.parse({
      data: response.data,
      index: response.index,
    });
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

  const fetchSecretLength = async (): Promise<
    z.infer<typeof SecretLengthSchema>
  > => {
    window.postMessage({ type: "RequestSecretLength" }, "*");
    try {
      const response = await createEventPromise<{
        type: string;
        secret: string;
        length: number;
      }>("SecretLength");
      const validatedResponse = SecretLengthSchema.parse({
        secret: response.secret,
        length: response.length,
      });
      setSecret(validatedResponse.secret);
      setLength(validatedResponse.length);
      return validatedResponse;
    } catch (error) {
      console.error("Error in fetchSecretLength:", error);
      throw error;
    }
  };

  const contextValue = HashChainContextSchema.parse({
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
  });

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
