import React, { createContext, useContext, useState, ReactNode } from "react";
import { z } from "zod";
import {
  HashChainElementSchema,
  SecretLengthSchema,
} from "../../utils/zod-schemas";

interface HashChainElement {
  hash: string;
  index: number;
}

interface HashChainExtensionContextType {
  hashChainElements: HashChainElement[];
  tail: string;
  fullHashChain: string[];
  secret: string;
  length: number;
  lastHashSendIndex: number;
  fetchAndPopHashFromHashChain: () => Promise<HashChainElement>;
  fetchTail: () => Promise<string>;
  fetchHashChain: () => Promise<string[]>;
  fetchSecretAndLength: () => Promise<{
    secret: string;
    length: number;
    tail: string;
    lastHashSendIndex: number;
  }>;
  syncLastHashSendIndex: (lastHashSendIndex: number) => Promise<number>;
  openChannel: (
    address_contract: string,
    address_to: string,
    amountInEth: string,
    key: string,
    chainId: number,
  ) => Promise<string>;
  fetchSmartContractAddress: () => Promise<string>;
}

interface HashChainExtensionProviderProps {
  children: ReactNode;
}

const HashchainFromExtensionContext = createContext<
  HashChainExtensionContextType | undefined
>(undefined);

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
  const [lastHashSendIndex, setLastHashSendIndex] = useState<number>(0);

  const createEventPromise = <T,>(eventType: string): Promise<T> => {
    console.log(
      `[React Context] Creating event promise for type: ${eventType}`,
    );
    return new Promise((resolve) => {
      const handler = (event: MessageEvent) => {
        // Only log messages that match our expected type
        if (event.data?.type === eventType) {
          console.log(`[React Context] Received matching message:`, {
            type: event.data?.type,
            hasData: !!event.data?.data,
            dataLength: Array.isArray(event.data?.data)
              ? event.data.data.length
              : "not an array",
          });

          window.removeEventListener("message", handler);
          resolve(event.data as T);
        }
        // Don't log mismatched messages to reduce noise
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
      "Recover_h(100)",
    );
    setTail(response.data);
    return response.data;
  };

  const fetchHashChain = async (): Promise<string[]> => {
    console.log("[React Context] Requesting full hash chain...");
    window.postMessage({ type: "RequestFullHashChain" }, "*");

    try {
      const response = await createEventPromise<{
        type: string;
        data: string[];
      }>("fullHashChain");

      if (!response?.data) {
        console.error("[React Context] No data in response:", response);
        throw new Error("No data received from extension");
      }

      if (!Array.isArray(response.data)) {
        console.error(
          "[React Context] Response data is not an array:",
          response.data,
        );
        throw new Error("Invalid response format: expected array");
      }

      console.log("[React Context] Successfully received hash chain:", {
        length: response.data.length,
        sample: response.data.slice(0, 2),
      });

      setFullHashChain(response.data);
      return response.data;
    } catch (error) {
      console.error("[React Context] Error fetching hash chain:", error);
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
          lastHashSendIndex: number;
        };
      }>("SecretLength");
      const validatedResponse = SecretLengthSchema.parse({
        secret: response.data.secret,
        length: response.data.length,
        tail: response.data.tail,
        lastHashSendIndex: response.data.lastHashSendIndex,
      });
      setSecret(validatedResponse.secret);
      setLength(validatedResponse.length);
      setLastHashSendIndex(validatedResponse.lastHashSendIndex);
      return validatedResponse;
    } catch (error) {
      console.error("Error in fetchSecretLength:", error);
      throw error;
    }
  };

  const syncLastHashSendIndex = async (lastHashSendIndex: number) => {
    window.postMessage(
      { type: "RequestSyncLastHashSendIndex", data: { lastHashSendIndex } },
      "*",
    );
    console.log("Syncing last hash send index");
    const response = await createEventPromise<{
      type: string;
      data: { lastHashSendIndex: number };
    }>("SyncLastHashSendIndex");
    return response.data.lastHashSendIndex;
  };

  const openChannel = async (
    address_contract: string,
    address_to: string,
    amountEthInWei: string,
    key: string,
    chainId: number,
  ) => {
    window.postMessage(
      {
        type: "RequestOpenChannel",
        data: { address_contract, address_to, amountEthInWei, key, chainId },
      },
      "*",
    );
    const response = await createEventPromise<{
      type: string;
      data: { status: string; message: string };
    }>("OpenChannel");
    return response.data.status;
  };

  const fetchSmartContractAddress = async (): Promise<string> => {
    window.postMessage({ type: "RequestSmartContractAddress" }, "*");
    const response = await createEventPromise<{
      type: string;
      data: string;
    }>("SmartContractAddress");
    console.log("Smart contract address", response.data);
    return response.data;
  };

  const contextValue: HashChainExtensionContextType = {
    hashChainElements,
    tail,
    fullHashChain,
    secret,
    length,
    lastHashSendIndex,
    fetchAndPopHashFromHashChain,
    fetchTail,
    fetchHashChain,
    fetchSecretAndLength,
    syncLastHashSendIndex,
    openChannel,
    fetchSmartContractAddress,
  };

  return (
    <HashchainFromExtensionContext.Provider value={contextValue}>
      {children}
    </HashchainFromExtensionContext.Provider>
  );
};

export const useHashChainFromExtension = () => {
  const context = useContext(HashchainFromExtensionContext);
  if (context === undefined) {
    throw new Error(
      "useHashChainFromExtension must be used within a HashChainExtensionProvider",
    );
  }
  return context;
};
