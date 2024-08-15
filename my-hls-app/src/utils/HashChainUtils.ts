import {
  InvalidHashFormatError,
  InvalidHashIndexError,
  NegativeHashIndexError,
} from "@/errors";
import { fromHex, keccak256, toHex } from "viem";

export function generateHashChain(
  secret: Uint8Array,
  maxIndex: number
): `0x${string}`[] {
  let currentHash: Uint8Array = keccak256(secret, "bytes");
  const hashChain: Uint8Array[] = [currentHash];

  for (let i = 1; i <= maxIndex; i++) {
    currentHash = keccak256(currentHash, "bytes");
    hashChain.push(currentHash);
  }

  return hashChain.map((hash) => toHex(hash));
}

export function verifyHashChain(
  providedHash: `0x${string}`,
  providedHashIndex: number,
  targetHash: `0x${string}`,
  targetHashIndex: number
): boolean {
  if (providedHashIndex < 0 || targetHashIndex < 0) {
    throw new NegativeHashIndexError();
  }

  if (providedHashIndex >= targetHashIndex) {
    throw new InvalidHashIndexError();
  }

  if (!providedHash.startsWith("0x") || !targetHash.startsWith("0x")) {
    throw new InvalidHashFormatError();
  }

  let currentHashBytes = fromHex(providedHash, "bytes");
  const targetHashBytes = fromHex(targetHash, "bytes");

  for (let i = providedHashIndex + 1; i <= targetHashIndex; i++) {
    currentHashBytes = keccak256(currentHashBytes, "bytes");
  }

  return toHex(currentHashBytes) === toHex(targetHashBytes);
}
