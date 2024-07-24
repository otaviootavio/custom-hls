import { keccak256 } from "viem";

function toHex(str: string): `0x${string}` {
  let hex = "";
  for (let i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16);
  }
  return `0x${hex}`;
}

function createHashChain(secret: string, length: number): `0x${string}`[] {
  let currentHash: `0x${string}` = keccak256(toHex(secret));
  const hashChain = [currentHash];

  for (let i = 1; i < length; i++) {
    currentHash = keccak256(`0x${currentHash.slice(2)}`);
    hashChain.push(currentHash);
  }

  return hashChain;
}

export { createHashChain };
