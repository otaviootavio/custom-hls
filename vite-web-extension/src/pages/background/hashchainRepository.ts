import { sha256 } from "@noble/hashes/sha256";
import { IndexedDBClient } from "./indexedDBClient";
import {
  HashchainData,
  ImportHashchainData,
  PublicHashchainData,
  VendorData,
} from "./types";
import { keccak256, toHex } from "viem";

export class HashchainRepository {
  public readonly SELECTED_KEY = "selected_hashchain";
  private db: IndexedDBClient;

  constructor() {
    this.db = new IndexedDBClient("hashchain_db", "hashchains", 1);
  }

  private generateHashChain(secret: string, length: number): string[] {
    const chain: string[] = [];
    let currentHash = toHex(secret);

    for (let i = 0; i < length; i++) {
      currentHash = keccak256(currentHash);
      chain.unshift(currentHash);
    }

    return chain;
  }

  private toPublicData(data: HashchainData): PublicHashchainData {
    const { secret, ...publicData } = data;
    return { ...publicData, hasSecret: !!secret };
  }

  async createHashchain(
    vendorData: VendorData,
    secret: string
  ): Promise<string> {
    const hashchainId = `${Date.now()}_${crypto.randomUUID()}`;
    await this.db.put(hashchainId, {
      vendorData,
      secret,
      hashes: [],
      lastIndex: 0,
      createdAt: Date.now(),
    });
    return hashchainId;
  }

  async getHashchain(hashchainId: string): Promise<PublicHashchainData | null> {
    const data = await this.db.get<HashchainData>(hashchainId);
    if (!data) return null;
    return this.toPublicData(data);
  }

  async selectHashchain(hashchainId: string | null): Promise<void> {
    await this.db.put(this.SELECTED_KEY, { selectedHashchainId: hashchainId });
  }

  async getSelectedHashchain(): Promise<{
    hashchainId: string;
    data: PublicHashchainData;
  } | null> {
    const selected = await this.db.get<{ selectedHashchainId: string }>(
      this.SELECTED_KEY
    );
    if (!selected?.selectedHashchainId) return null;

    const data = await this.db.get<HashchainData>(selected.selectedHashchainId);
    if (!data) return null;

    return {
      hashchainId: selected.selectedHashchainId,
      data: this.toPublicData(data),
    };
  }

  async getSecret(hashchainId: string): Promise<string | null> {
    const data = await this.db.get<HashchainData>(hashchainId);
    return data?.secret || null;
  }

  async getNextHash(hashchainId: string): Promise<string | null> {
    const data = await this.db.get<HashchainData>(hashchainId);
    if (!data || data.lastIndex >= data.hashes.length) return null;

    const hash = data.hashes[data.lastIndex];
    await this.db.put(hashchainId, {
      ...data,
      lastIndex: data.lastIndex + 1,
    });

    return hash;
  }

  async getFullHashchain(hashchainId: string): Promise<string[]> {
    const data = await this.db.get<HashchainData>(hashchainId);
    return data?.hashes || [];
  }

  async syncHashchainIndex(
    hashchainId: string,
    newIndex: number
  ): Promise<void> {
    const data = await this.db.get<HashchainData>(hashchainId);
    if (!data) return;

    await this.db.put(hashchainId, {
      ...data,
      lastIndex: newIndex,
    });
  }

  async updateHashchain(
    hashchainId: string,
    updateData: Partial<HashchainData>
  ): Promise<void> {
    const existingData = await this.db.get<HashchainData>(hashchainId);
    if (!existingData) return;

    if (updateData.numHashes) {
      updateData.hashes = this.generateHashChain(
        existingData.secret,
        parseInt(updateData.numHashes.toString())
      );
      updateData.lastIndex = 0;
    }

    await this.db.put(hashchainId, {
      ...existingData,
      ...updateData,
    });
  }

  async importHashchain(data: ImportHashchainData): Promise<string> {
    const hashchainId = `${Date.now()}_${crypto.randomUUID()}`;
    await this.db.put(hashchainId, {
      vendorData: data.vendorData,
      secret: data.hash,
      hashes: [data.hash],
      lastIndex: data.lastIndex,
      contractAddress: data.contractAddress,
      numHashes: data.numHashes,
      totalAmount: data.totalAmount,
      createdAt: Date.now(),
    });
    return hashchainId;
  }

  async getAllHashchains(): Promise<
    { id: string; data: PublicHashchainData }[]
  > {
    const allData = await this.db.getAll<{ id: string } & HashchainData>();

    console.log(allData);
    return allData.map(({ id, ...data }) => ({
      id,
      data: this.toPublicData(data),
    }));
  }
}
