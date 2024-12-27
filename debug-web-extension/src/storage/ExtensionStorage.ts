import { StorageInterface } from "@/context/HashchainProvider";
import {
  HashchainData,
  HashchainId,
  ImportHashchainData,
  PublicHashchainData,
  VendorData,
} from "@/types";

// extensionStorage.ts - Website Context
export class ExtensionStorage implements StorageInterface {
  private contentScriptReady: boolean = false;

  constructor() {
    // Listen for content script ready message
    window.addEventListener("message", (event) => {
      if (
        event.data &&
        event.data.source === "CONTENT_SCRIPT" &&
        event.data.type === "READY"
      ) {
        console.log("Content script marked as ready");
        this.contentScriptReady = true;
      }
    });
  }

  private async waitForContentScript(timeout: number = 2000): Promise<void> {
    if (this.contentScriptReady) return;

    return new Promise((resolve, reject) => {
      const checkInterval = 100; // Check every 100ms
      let elapsed = 0;

      const timer = setInterval(() => {
        elapsed += checkInterval;
        if (this.contentScriptReady) {
          clearInterval(timer);
          resolve();
        } else if (elapsed >= timeout) {
          clearInterval(timer);
          reject(new Error("Content script not ready after timeout"));
        }
      }, checkInterval);
    });
  }

  private async sendMessage<T>(type: string, payload: any): Promise<T> {
    console.log("ExtensionStorage: Sending message", { type, payload });

    try {
      await this.waitForContentScript();

      return new Promise((resolve, reject) => {
        window.postMessage(
          { source: "WEBSITE", type, payload },
          window.location.origin
        );
        console.log("ExtensionStorage: Message posted");

        const handleResponse = (event: MessageEvent) => {
          if (event.data?.source === "WEBSITE") {
            console.log("ExtensionStorage: Ignoring website message");
            return;
          }

          console.log("ExtensionStorage: Received event:", event.data);
          if (
            event.data?.source === "CONTENT_SCRIPT" &&
            event.data.type === `${type}_RESPONSE`
          ) {
            window.removeEventListener("message", handleResponse);
            clearTimeout(timeoutId);
            resolve(event.data.payload);
          }
        };

        const timeoutId = setTimeout(() => {
          window.removeEventListener("message", handleResponse);
          reject(new Error("Message timeout after 5 seconds"));
        }, 5000);

        window.addEventListener("message", handleResponse);
      });
    } catch (error) {
      console.error("ExtensionStorage: Error sending message:", error);
      throw error;
    }
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