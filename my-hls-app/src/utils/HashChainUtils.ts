import { fromHex, keccak256, stringToBytes, toBytes, toHex } from "viem";

export function generateHashChain(
  secretString: string,
  length: number
): `0x${string}`[] {
  const secret = toBytes(secretString);
  let currentHash: Uint8Array = keccak256(secret, "bytes");
  const hashChain: Uint8Array[] = [currentHash];

  for (let i = 1; i < length; i++) {
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
    throw new Error("Hash indices must be non-negative");
  }

  if (providedHashIndex >= targetHashIndex) {
    throw new Error("Provided hash index must be less than target hash index");
  }

  if (!providedHash.startsWith("0x") || !targetHash.startsWith("0x")) {
    throw new Error("Hashes must be in 0x-prefixed hex format");
  }

  try {
    let currentHashBytes = fromHex(providedHash, "bytes");
    const targetHashBytes = fromHex(targetHash, "bytes");

    for (let i = providedHashIndex; i < targetHashIndex; i++) {
      currentHashBytes = keccak256(currentHashBytes, "bytes");
    }

    return toHex(currentHashBytes) === toHex(targetHashBytes);
  } catch (error: any) {
    throw new Error(`Error during hash chain verification: ${error.message}`);
  }
}
