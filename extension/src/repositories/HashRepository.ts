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
  tail: z.string().regex(/^0x[0-9a-fA-F]+$/),
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
}

export { HashRepository };
