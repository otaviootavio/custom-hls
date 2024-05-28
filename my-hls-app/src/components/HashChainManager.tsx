import React, { useState } from "react";
import { useHashChain } from "@/context/HashChainContext";
import HashChainViewer from "./HashChainViewer";

const HashChainManager: React.FC = () => {
  const [hashZero, setHashZero] = useState<string>("");
  const [numHashes, setNumHashes] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { generateHashChain } = useHashChain();

  const handleGenerateHashChain = () => {
    try {
      const numHashesInt = parseInt(numHashes);
      generateHashChain(hashZero, numHashesInt);
      setError("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4 bg-gray-100 shadow-sm rounded-sm">
      <h1 className="text-sm font-bold mb-2 text-gray-700">Browser Data</h1>
      <div className="mb-2">
        <label className="block text-xs text-gray-700">
          Initial Hash (Hash Zero):
          <input
            type="text"
            value={hashZero}
            onChange={(e) => setHashZero(e.target.value)}
            className="mt-1 block w-full p-1 border border-gray-300 rounded-sm text-xs"
          />
        </label>
      </div>
      <div className="mb-2">
        <label className="block text-xs text-gray-700">
          Number of Hashes:
          <input
            type="text"
            value={numHashes}
            onChange={(e) => setNumHashes(e.target.value)}
            className="mt-1 block w-full p-1 border border-gray-300 rounded-sm text-xs"
          />
        </label>
      </div>
      {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
      <button
        onClick={handleGenerateHashChain}
        className="bg-blue-500 text-white text-xs px-2 py-1 rounded-sm hover:bg-blue-600"
      >
        Generate Hash Chain
      </button>
      <HashChainViewer />
    </div>
  );
};

export default HashChainManager;
