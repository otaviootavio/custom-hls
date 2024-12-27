import { StorageInterface } from "@/context/HashchainProvider";
import { HashchainData, HashchainId, ImportHashchainData, PublicHashchainData, VendorData } from "@/types";

// extensionStorage.ts - Website Context
export class ExtensionStorage implements StorageInterface {
    private sendMessage<T>(type: string, payload: any): Promise<T> {
      return new Promise((resolve) => {
        window.postMessage(
          { source: "WEBSITE", type, payload },
          window.location.origin
        );
  
        const handleResponse = (event: MessageEvent) => {
          if (
            event.data &&
            event.data.source === "CONTENT_SCRIPT" &&
            event.data.type === `${type}_RESPONSE`
          ) {
            window.removeEventListener("message", handleResponse);
            resolve(event.data.payload);
          }
        };
  
        window.addEventListener("message", handleResponse);
      });
    }
  
    async createHashchain(
      vendorData: VendorData,
      secret: string
    ): Promise<HashchainId> {
      return this.sendMessage("CREATE_HASHCHAIN", { vendorData, secret });
    }
  
    async getHashchain(
      hashchainId: HashchainId
    ): Promise<PublicHashchainData | null> {
      return this.sendMessage("GET_HASHCHAIN", { hashchainId });
    }
  
    async selectHashchain(hashchainId: HashchainId | null): Promise<void> {
      return this.sendMessage("SELECT_HASHCHAIN", { hashchainId });
    }
  
    async getSelectedHashchain(): Promise<{
      hashchainId: HashchainId;
      data: PublicHashchainData;
    } | null> {
      return this.sendMessage("GET_SELECTED_HASHCHAIN", {});
    }
  
    async getSecret(hashchainId: HashchainId): Promise<string | null> {
      return this.sendMessage("GET_SECRET", { hashchainId });
    }
  
    async getNextHash(hashchainId: HashchainId): Promise<string | null> {
      return this.sendMessage("GET_NEXT_HASH", { hashchainId });
    }
  
    async getFullHashchain(hashchainId: HashchainId): Promise<string[]> {
      return this.sendMessage("GET_FULL_HASHCHAIN", { hashchainId });
    }
  
    async syncHashchainIndex(
      hashchainId: HashchainId,
      newIndex: number
    ): Promise<void> {
      return this.sendMessage("SYNC_HASHCHAIN_INDEX", { hashchainId, newIndex });
    }
  
    async updateHashchain(
      hashchainId: HashchainId,
      data: Partial<HashchainData>
    ): Promise<void> {
      return this.sendMessage("UPDATE_HASHCHAIN", { hashchainId, data });
    }
  
    async importHashchain(data: ImportHashchainData): Promise<HashchainId> {
      return this.sendMessage("IMPORT_HASHCHAIN", { data });
    }
  }