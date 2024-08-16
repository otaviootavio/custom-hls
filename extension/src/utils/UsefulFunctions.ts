import { keccak256, toHex } from "viem";

function createHashChainFromSecretAndMaxIndex(
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

export { createHashChainFromSecretAndMaxIndex };
