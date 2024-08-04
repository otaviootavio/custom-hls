import keccak from "keccak";

export const generateHashChain = (hashZero: string, numHashes: number) => {
  let currentHash = hashZero;
  const chain = [currentHash];
  for (let i = 1; i < numHashes; i++) {
    currentHash = keccak("keccak256")
      .update(Buffer.from(currentHash, "utf-8"))
      .digest("hex");
    chain.push(currentHash);
  }
  return chain;
};

