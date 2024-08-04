import keccak from "keccak";

export const generateHashChain = (hashZero: string, numHashes: number) => {
  let currentHash = hashZero;
  const chain = [];
  for (let i = 0; i < numHashes; i++) {
    currentHash = keccak("keccak256")
      .update(Buffer.from(currentHash, "utf-8"))
      .digest("hex");
    chain.push(currentHash);
  }
  return chain;
};

export const hashKeccak = (input: string): string => {
  return keccak("keccak256").update(Buffer.from(input, "utf-8")).digest("hex");
};

export const verifyHashChain = (
  incomingHash: string,
  lastHash: string,
  chainSize: number,
  position: number
): boolean => {
  let currentHash = incomingHash;
  for (let i = position; i < chainSize; i++) {
    currentHash = hashKeccak(currentHash);
  }
  return currentHash === lastHash;
};
