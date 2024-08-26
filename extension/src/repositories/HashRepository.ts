import { z } from "zod";
import { type HashObject } from "../utils/interfaces";

// Define the zod schema for HashObject
const HashObjectSchema = z.object({
  chainId: z.number(),
  address_contract: z.string(),
  address_to: z.string(),
  length: z.number(),
  amountEthInWei: z.string().optional().default("0"), // Make it optional and provide a default
  hashchain: z.array(z.string().regex(/^0x[0-9a-fA-F]+$/)),
  isValid: z.boolean(),
  key: z.string().regex(/^0x[0-9a-fA-F]+$/),
  secret: z.string(),
  tail: z.string().regex(/^0x[0-9a-fA-F]+$/),
  indexOfLastHashSend: z.number(),
});

const SerializedHashObjectSchema = z.object({
  chainId: z.number(),
  address_contract: z.string(),
  address_to: z.string(),
  length: z.number(),
  amountEthInWei: z.string(),
  hashchain: z.array(z.string().regex(/^0x[0-9a-fA-F]+$/)),
  isValid: z.boolean(),
  key: z.string().regex(/^0x[0-9a-fA-F]+$/),
  secret: z.string(),
  tail: z.string().regex(/^0x[0-9a-fA-F]+$/),
  indexOfLastHashSend: z.number(),
});

const DeserializedHashObjectSchema = SerializedHashObjectSchema.extend({
  amountEthInWei: z.bigint(),
});

type SerializedHashObject = z.infer<typeof SerializedHashObjectSchema>;
type DeserializedHashObject = z.infer<typeof DeserializedHashObjectSchema>;

class HashRepository {
  private storageKey = "hashChains";

  private validateHashObject(hashObject: HashObject): void {
    try {
      const validatedObject = HashObjectSchema.parse({
        ...hashObject,
        amountEthInWei: hashObject.amountEthInWei?.toString() || "0",
      });
      // If validation passes, update the original object with the validated values
      Object.assign(hashObject, {
        ...validatedObject,
        amountEthInWei: BigInt(validatedObject.amountEthInWei),
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.issues);
        throw new Error("Validation error");
      } else {
        console.error("Unknown error:", error);
        throw error;
      }
    }
  }

  async getAllHashChains(): Promise<HashObject[]> {
    return new Promise((resolve) => {
      chrome.storage.local.get({ [this.storageKey]: [] }, (result) => {
        const serializedChains = result[this.storageKey];
        const deserializedChains: DeserializedHashObject[] =
          serializedChains.map((chain: any): DeserializedHashObject => {
            return deserializeHashObject(chain);
          });

        const parsedDeseraliedChainsToHashObject: HashObject[] =
          deserializedChains.map(
            (chain: DeserializedHashObject): HashObject => {
              return {
                ...chain,
                tail: chain.tail as `0x${string}`,
                hashchain: chain.hashchain.map(
                  (hash: string): `0x${string}` => hash as `0x${string}`
                ),
                key: chain.key as `0x${string}`,
              };
            }
          );
        resolve(parsedDeseraliedChainsToHashObject);
      });
    });
  }

  async addHashChain(hashObject: HashObject): Promise<void> {
    try {
      this.validateHashObject(hashObject);

      return new Promise((resolve, reject) => {
        this.getAllHashChains().then((hashChains) => {
          const existingChain = hashChains.find(
            (chain) => chain.tail === hashObject.tail
          );

          if (existingChain) {
            const errorMessage = `Hash chain with tail ${hashObject.tail} already exists.`;
            console.error(errorMessage);
            reject(new Error(errorMessage));
          } else {
            const serializedHashObject = serializeHashObject(hashObject);
            hashChains.push({
              ...serializedHashObject,
              amountEthInWei: BigInt(serializedHashObject.amountEthInWei),
              key: serializedHashObject.key as `0x${string}`,
              tail: serializedHashObject.tail as `0x${string}`,
              hashchain: serializedHashObject.hashchain.map(
                (hash: string): `0x${string}` => hash as `0x${string}`
              ),
            });
            console.log(
              `New hash chain with tail ${hashObject.tail} added successfully!`
            );
            chrome.storage.local.set({ [this.storageKey]: hashChains }, () => {
              console.log("Hash chains saved successfully!");
              resolve();
            });
          }
        });
      });
    } catch (error) {
      console.error("Error adding new hash chain:", error);
      throw error;
    }
  }

  async updateHashChain(hashObject: HashObject): Promise<void> {
    this.validateHashObject(hashObject);

    return new Promise((resolve, reject) => {
      chrome.storage.local.get({ [this.storageKey]: [] }, (result) => {
        let hashChains: any[] = result[this.storageKey];

        const existingIndex = hashChains.findIndex(
          (obj) => obj.key === hashObject.key
        );

        if (existingIndex !== -1) {
          hashChains[existingIndex] = serializeHashObject(hashObject);
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

  async setSelectedKey(tail: string): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get({ [this.storageKey]: [] }, (result) => {
        let hashChains: HashObject[] = result[this.storageKey];

        const existingChain = hashChains.find((obj) => obj.tail === tail);

        if (existingChain) {
          chrome.storage.local.set({ selectedKey: tail }, () => {
            console.log(`Selected key set to ${tail}`);
            resolve();
          });
        } else {
          const errorMessage = `Hash chain with tail ${tail} not found.`;
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
        const serializedChains: any[] = result[this.storageKey];
        const selectedHashChain = serializedChains.find(
          (chain) => chain.key === selectedKey
        );

        if (selectedHashChain) {
          const deserialized = deserializeHashObject(selectedHashChain);
          resolve({
            ...deserialized,
            hashchain: deserialized.hashchain.map(
              (hash: string): `0x${string}` => hash as `0x${string}`
            ),
            tail: `${deserialized.tail}` as `0x${string}`,
          });
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

function serializeHashObject(
  hashObject: DeserializedHashObject
): SerializedHashObject {
  const serialized = {
    ...hashObject,
    amountEthInWei: hashObject.amountEthInWei.toString(),
  };
  return SerializedHashObjectSchema.parse(serialized);
}

function deserializeHashObject(
  serialized: SerializedHashObject
): DeserializedHashObject {
  const deserialized = {
    ...serialized,
    amountEthInWei: BigInt(serialized.amountEthInWei),
  };
  return DeserializedHashObjectSchema.parse(deserialized);
}
export { HashRepository };
