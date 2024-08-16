import { z } from "zod";
import { type HashObject } from "../utils/interfaces";

// Define the zod schema for HashObject
const HashObjectSchema = z.object({
  address_contract: z.string(),
  address_to: z.string(),
  length: z.number(),
  hashchain: z.array(z.string().regex(/^0x[0-9a-fA-F]+$/)),
  isValid: z.boolean(),
  key: z.string(),
  secret: z.string(),
  tail: z.string().regex(/^0x[0-9a-fA-F]+$/),
  indexOfLastHashSend: z.number(),
});

class HashRepository {
  private storageKey = "hashChains";

  private validateHashObject(hashObject: HashObject): void {
    HashObjectSchema.parse(hashObject); // Use zod to validate the hashObject
  }

  async getAllHashChains(): Promise<HashObject[]> {
    return new Promise((resolve) => {
      chrome.storage.local.get({ [this.storageKey]: [] }, (result) => {
        resolve(result[this.storageKey]);
      });
    });
  }

  async addHashChain(hashObject: HashObject): Promise<void> {
    this.validateHashObject(hashObject);

    return new Promise((resolve) => {
      chrome.storage.local.get({ [this.storageKey]: [] }, (result) => {
        let hashChains: HashObject[] = result[this.storageKey];

        const existingIndex = hashChains.findIndex(
          (obj) => obj.key === hashObject.key
        );

        if (existingIndex === -1) {
          hashChains.push(hashObject);
          console.log(
            `New hash chain with key ${hashObject.key} added successfully!`
          );
          chrome.storage.local.set({ [this.storageKey]: hashChains }, () => {
            console.log("Hash chains saved successfully!");
            resolve();
          });
        } else {
          console.error(
            `Hash chain with key ${hashObject.key} already exists.`
          );
          resolve();
        }
      });
    });
  }

  async updateHashChain(hashObject: HashObject): Promise<void> {
    this.validateHashObject(hashObject);

    return new Promise((resolve, reject) => {
      chrome.storage.local.get({ [this.storageKey]: [] }, (result) => {
        let hashChains: HashObject[] = result[this.storageKey];

        const existingIndex = hashChains.findIndex(
          (obj) => obj.key === hashObject.key
        );

        if (existingIndex !== -1) {
          hashChains[existingIndex] = hashObject;
          console.log(
            `Hash chain with key ${hashObject.key} updated successfully!`
          );
          chrome.storage.local.set({ [this.storageKey]: hashChains }, () => {
            console.log("Hash chains saved successfully!");
            resolve();
          });
        } else {
          console.error(`Hash chain with key ${hashObject.key} not found.`);
          reject(`Hash chain with key ${hashObject.key} not found.`);
        }
      });
    });
  }

  async deleteHashChain(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get({ [this.storageKey]: [] }, async (result) => {
        let hashChains: HashObject[] = result[this.storageKey];
        const existingIndex = hashChains.findIndex((obj) => obj.key === key);

        if (existingIndex !== -1) {
          hashChains.splice(existingIndex, 1);
          await chrome.storage.local.set({ [this.storageKey]: hashChains });

          const selectedKey = await chrome.storage.local.get("selectedKey");
          if (selectedKey.selectedKey === key) {
            await chrome.storage.local.remove("selectedKey");
            console.log(`Selected key ${key} removed as it was deleted.`);
          }

          console.log(`Hash chain with key ${key} deleted successfully!`);
          resolve();
        } else {
          console.error(`Hash chain with key ${key} not found.`);
          reject(`Hash chain with key ${key} not found.`);
        }
      });
    });
  }

  async setSelectedKey(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get({ [this.storageKey]: [] }, (result) => {
        let hashChains: HashObject[] = result[this.storageKey];

        const existingIndex = hashChains.findIndex((obj) => obj.key === key);

        if (existingIndex !== -1) {
          chrome.storage.local.set({ selectedKey: key }, () => {
            console.log(`Selected key set to ${key}`);
            resolve();
          });
        } else {
          const errorMessage = `Hash chain with key ${key} not found.`;
          console.error(errorMessage);
          reject(new Error(errorMessage));
        }
      });
    });
  }

  async getSelectedHashChain(): Promise<HashObject | null> {
    return new Promise((resolve) => {
      chrome.storage.local.get(["selectedKey", this.storageKey], (result) => {
        const selectedKey = result.selectedKey;
        const hashChains: HashObject[] = result[this.storageKey];
        const selectedHashChain = hashChains.find(
          (chain) => chain.key === selectedKey
        );

        if (selectedHashChain) {
          resolve(selectedHashChain);
        } else {
          resolve(null);
        }
      });
    });
  }

  async syncLastHashSendFromSelected(
    lastHashSendIndex: number
  ): Promise<HashObject | null> {
    return new Promise((resolve) => {
      chrome.storage.local.get(
        ["selectedKey", this.storageKey],
        async (result) => {
          const selectedKey = result.selectedKey;
          let hashChains: HashObject[] = result[this.storageKey];
          const selectedIndex = hashChains.findIndex(
            (chain) => chain.key === selectedKey
          );

          if (selectedIndex !== -1) {
            const selectedChain = hashChains[selectedIndex];
            selectedChain.indexOfLastHashSend = lastHashSendIndex;

            // Update the hashchain in storage
            await this.updateHashChain(selectedChain);

            console.log(
              `Last hash send index updated to ${lastHashSendIndex} for chain with key ${selectedKey}`
            );
            resolve(selectedChain);
          } else {
            console.log("No selected hashchain found");
            resolve(null);
          }
        }
      );
    });
  }

  async popLastHashFromSelected(): Promise<{
    index: number;
    hash: string;
  } | null> {
    return new Promise((resolve) => {
      chrome.storage.local.get(
        ["selectedKey", this.storageKey],
        async (result) => {
          const selectedKey = result.selectedKey;
          let hashChains: HashObject[] = result[this.storageKey];
          const selectedIndex = hashChains.findIndex(
            (chain) => chain.key === selectedKey
          );

          if (selectedIndex !== -1) {
            const selectedChain = hashChains[selectedIndex];
            if (selectedChain.hashchain.length > 0) {
              const lastHash = selectedChain.hashchain.pop()!;
              const index = selectedChain.hashchain.length;

              // Update the hashchain in storage
              await this.updateHashChain(selectedChain);

              console.log(`Popped hash from chain with key ${selectedKey}`);
              resolve({ index, hash: lastHash });
            } else {
              console.log(`No more hashes in chain with key ${selectedKey}`);
              resolve(null);
            }
          } else {
            console.log("No selected hashchain found");
            resolve(null);
          }
        }
      );
    });
  }
}

export { HashRepository };
