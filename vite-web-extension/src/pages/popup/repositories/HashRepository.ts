import { z } from "zod";
import { type HashObject } from "../utils/interfaces";
import { createHashChainFromItemAndLength } from "../utils/UsefulFunctions";

const SerializedHashObjectSchema = z.object({
  chainId: z.number().default(0),
  address_contract: z.string().default("0x0"),
  address_to: z.string().default("0x0"),
  length: z.number().default(0),
  amountEthInWei: z.string().default("0"),
  hashchain: z.array(z.string().regex(/^0x[0-9a-fA-F]+$/)).default([]),
  isValid: z.boolean().default(true),
  key: z.string().regex(/^0x[0-9a-fA-F]+$/),
  secret: z.string().default("0"),
  tail: z
    .string()
    .regex(/^0x[0-9a-fA-F]+$/)
    .default("0x0"),
  indexOfLastHashSend: z.number().default(0),
});

type SerializedHashObject = z.infer<typeof SerializedHashObjectSchema>;

class HashRepository {
  private dbName = "HashChainDB";
  private storeName = "hashChains";
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDB();
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create hash chains store if it doesn't exist
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: "key" });
          store.createIndex("tail", "tail", { unique: true });
        }
        
        // Create metadata store if it doesn't exist
        if (!db.objectStoreNames.contains("metadata")) {
          db.createObjectStore("metadata");
        }
      };
    });
  }

  private async ensureDBConnection(): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }
  }

  private serializeHashObject(hashObject: HashObject): SerializedHashObject {
    return {
      ...hashObject,
      amountEthInWei: hashObject.amountEthInWei.toString(),
      hashchain: hashObject.hashchain.map((hash) => hash.toString()),
      tail: hashObject.tail.toString(),
    };
  }

  private deserializeHashObject(serialized: SerializedHashObject): HashObject {
    return {
      ...serialized,
      chainId: serialized.chainId || 0,
      amountEthInWei: BigInt(serialized.amountEthInWei),
      hashchain: serialized.hashchain.map((hash) => hash as `0x${string}`),
      tail: serialized.tail as `0x${string}`,
    };
  }

  private async performTransaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    callback: (store: IDBObjectStore) => IDBRequest<T>
  ): Promise<T> {
    await this.ensureDBConnection();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);
      const request = callback(store);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllHashChains(): Promise<HashObject[]> {
    const serializedChains = await this.performTransaction<SerializedHashObject[]>(
      this.storeName,
      "readonly",
      (store) => store.getAll()
    );
    return serializedChains.map(this.deserializeHashObject);
  }

  async addHashChain(hashObject: HashObject): Promise<void> {
    const serialized = this.serializeHashObject(hashObject);
    try {
      await this.performTransaction(
        this.storeName,
        "readwrite",
        (store) => store.add(serialized)
      );
      console.log(`New hash chain with tail ${hashObject.tail} added successfully!`);
    } catch (error) {
      console.error("Error adding hash chain:", error);
      throw error;
    }
  }

  async updateHashChain(hashObject: HashObject): Promise<void> {
    const serialized = this.serializeHashObject(hashObject);
    try {
      await this.performTransaction(
        this.storeName,
        "readwrite",
        (store) => store.put(serialized)
      );
      console.log(`Hash chain with key ${hashObject.key} updated successfully!`);
    } catch (error) {
      console.error("Error updating hash chain:", error);
      throw error;
    }
  }

  async deleteHashChain(key: string): Promise<void> {
    try {
      await this.performTransaction(
        this.storeName,
        "readwrite",
        (store) => store.delete(key)
      );
      // Handle selected key in a separate table
      const selectedKey = await this.performTransaction<string>(
        "metadata",
        "readonly",
        (store) => store.get("selectedKey")
      );
      
      if (selectedKey === key) {
        await this.performTransaction(
          "metadata",
          "readwrite",
          (store) => store.delete("selectedKey")
        );
      }
      console.log(`Hash chain with key ${key} deleted successfully!`);
    } catch (error) {
      console.error("Error deleting hash chain:", error);
      throw error;
    }
  }

  async setSelectedKey(tail: string): Promise<void> {
    try {
      await this.performTransaction(
        "metadata",
        "readwrite",
        (store) => store.put(tail, "selectedKey")
      );
      console.log(`Selected key set to ${tail}`);
    } catch (error) {
      console.error("Error setting selected key:", error);
      throw error;
    }
  }

  async getSelectedHashChain(): Promise<HashObject | null> {
    try {
      const selectedKey = await this.performTransaction<string>(
        "metadata",
        "readonly",
        (store) => store.get("selectedKey")
      );
      if (!selectedKey) return null;

      const serializedChain = await this.performTransaction<SerializedHashObject>(
        this.storeName,
        "readonly",
        (store) => store.get(selectedKey)
      );
      return serializedChain ? this.deserializeHashObject(serializedChain) : null;
    } catch (error) {
      console.error("Error getting selected hash chain:", error);
      return null;
    }
  }

  async syncLastHashSendFromSelected(
    lastHashSendIndex: number
  ): Promise<HashObject | null> {
    const selectedChain = await this.getSelectedHashChain();
    if (!selectedChain) {
      console.log("No selected hashchain found");
      return null;
    }

    selectedChain.indexOfLastHashSend = lastHashSendIndex;
    await this.updateHashChain(selectedChain);
    console.log(
      `Last hash send index updated to ${lastHashSendIndex} for chain with key ${selectedChain.key}`
    );
    return selectedChain;
  }

  async popLastHashFromSelected(): Promise<{
    index: number;
    hash: string;
  } | null> {
    const selectedChain = await this.getSelectedHashChain();
    if (!selectedChain || selectedChain.hashchain.length === 0) {
      console.log("No selected hashchain found or no more hashes in the chain");
      return null;
    }

    const lastHash = selectedChain.hashchain.pop()!;
    const index = selectedChain.hashchain.length;

    await this.updateHashChain(selectedChain);
    console.log(`Popped hash from chain with key ${selectedChain.key}`);
    return { index, hash: lastHash };
  }

  async importHashChainFromItemOfIndex(
    lastHashExpend: `0x${string}`,
    indexOfLastHashExpend: number,
    hashChainLength: number,
    chainId: number,
    addressContract: `0x${string}`
  ): Promise<void> {
    const hashchain: `0x${string}`[] = createHashChainFromItemAndLength(
      lastHashExpend,
      hashChainLength - indexOfLastHashExpend
    );
    const zeros: `0x${string}`[] = Array(indexOfLastHashExpend).fill(
      "0x0" as `0x${string}`
    );

    const fullHashchain: `0x${string}`[] = zeros.concat(hashchain);

    const importedHashObject: HashObject = {
      chainId,
      address_contract: addressContract,
      address_to: "",
      length: hashChainLength,
      amountEthInWei: BigInt(0),
      hashchain: fullHashchain,
      isValid: true,
      key: fullHashchain[fullHashchain.length - 1],
      secret: "",
      tail: fullHashchain[fullHashchain.length - 1],
      indexOfLastHashSend: indexOfLastHashExpend,
    };

    try {
      await this.addHashChain(importedHashObject);
      console.log(
        `Imported hash chain with tail ${
          fullHashchain[fullHashchain.length - 1]
        } successfully!`
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Failed to import hash chain: ${error.message}`);
      }
      console.error(`Failed to import hash chain: ${error}`);
      throw error;
    }
  }
}

export { HashRepository };