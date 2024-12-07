import { z } from "zod";
import { type HashObject } from "../utils/interfaces";
import { createHashChainFromItemAndLength } from "../utils/UsefulFunctions";
import browser from "webextension-polyfill";

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
  private storageKey = "hashChains";

  private async fetchFromStorage(): Promise<SerializedHashObject[]> {
    const result = await browser.storage.local.get({ [this.storageKey]: [] });
    const serializedChains = SerializedHashObjectSchema.array().parse(
      result[this.storageKey]
    );
    return serializedChains;
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

  async getAllHashChains(): Promise<HashObject[]> {
    const serializedChains = await this.fetchFromStorage();
    return serializedChains.map(this.deserializeHashObject);
  }

  async addHashChain(hashObject: HashObject): Promise<void> {
    const hashChains = await this.getAllHashChains();
    const existingChain = hashChains.find(
      (chain) => chain.tail === hashObject.tail
    );

    if (existingChain) {
      throw new Error(
        `Hash chain with tail ${hashObject.tail} already exists.`
      );
    }

    hashChains.push(hashObject);
    const serializedChains = hashChains.map(this.serializeHashObject);

    try {
      await browser.storage.local.set({ [this.storageKey]: serializedChains });
      console.log(
        `New hash chain with tail ${hashObject.tail} added successfully!`
      );
    } catch (error) {
      console.error("Error adding hash chain:", error);
      throw error;
    }
  }

  async updateHashChain(hashObject: HashObject): Promise<void> {
    const hashChains = await this.getAllHashChains();
    const existingIndex = hashChains.findIndex(
      (chain) => chain.key === hashObject.key
    );

    if (existingIndex === -1) {
      throw new Error(`Hash chain with key ${hashObject.key} not found.`);
    }

    hashChains[existingIndex] = hashObject;
    const serializedChains = hashChains.map(this.serializeHashObject);

    try {
      await browser.storage.local.set({ [this.storageKey]: serializedChains });
      console.log(
        `Hash chain with key ${hashObject.key} updated successfully!`
      );
    } catch (error) {
      console.error("Error updating hash chain:", error);
      throw error;
    }
  }

  async deleteHashChain(key: string): Promise<void> {
    const hashChains = await this.getAllHashChains();
    const existingIndex = hashChains.findIndex((chain) => chain.key === key);

    if (existingIndex === -1) {
      throw new Error(`Hash chain with key ${key} not found.`);
    }

    hashChains.splice(existingIndex, 1);
    const serializedChains = hashChains.map(this.serializeHashObject);

    try {
      await browser.storage.local.set({ [this.storageKey]: serializedChains });
      const selectedKeyResult = await browser.storage.local.get("selectedKey");
      if (selectedKeyResult.selectedKey === key) {
        await browser.storage.local.remove("selectedKey");
        console.log(`Selected key ${key} removed as it was deleted.`);
      }
      console.log(`Hash chain with key ${key} deleted successfully!`);
    } catch (error) {
      console.error("Error deleting hash chain:", error);
      throw error;
    }
  }

  async setSelectedKey(tail: string): Promise<void> {
    const hashChains = await this.getAllHashChains();
    const existingChain = hashChains.find((chain) => chain.tail === tail);

    if (!existingChain) {
      throw new Error(`Hash chain with tail ${tail} not found.`);
    }

    try {
      await browser.storage.local.set({ selectedKey: tail });
      console.log(`Selected key set to ${tail}`);
    } catch (error) {
      console.error("Error setting selected key:", error);
      throw error;
    }
  }

  async getSelectedHashChain(): Promise<HashObject | null> {
    const { selectedKey } = await browser.storage.local.get("selectedKey");
    const hashChains = await this.getAllHashChains();
    return hashChains.find((chain) => chain.key === selectedKey) || null;
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
    // Generate the hash chain
    const hashchain: `0x${string}`[] = createHashChainFromItemAndLength(
      lastHashExpend,
      hashChainLength - indexOfLastHashExpend
    );
    const zeros: `0x${string}`[] = Array(indexOfLastHashExpend).fill(
      "0x0" as `0x${string}`
    );

    const fullHashchain: `0x${string}`[] = zeros.concat(hashchain);

    // Create the HashObject
    const importedHashObject: HashObject = {
      chainId,
      address_contract: addressContract,
      address_to: "",
      length: hashChainLength,
      amountEthInWei: BigInt(0),
      hashchain: fullHashchain,
      isValid: true,
      key: fullHashchain[fullHashchain.length - 1], // Using tail as the key for imported hash chains//
      secret: "", // No secret for imported hash chains
      tail: fullHashchain[fullHashchain.length - 1],
      indexOfLastHashSend: indexOfLastHashExpend,
    };

    try {
      // Add the imported hash chain
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
