import React, { useEffect, useState } from "react";
import useHaschchainFromServer from "@/hooks/useHashchainFromServer";
import SingleHashView from "./SingleHashView";
import { useUser } from "@clerk/nextjs";
import { useHashChainFromExtension } from "@/context/HashChainExtensionProvider";
import { useHashChainContext } from "@/context/HashChainContext";
import { generateHashChain } from "@/utils/HashChainUtils";
import { z } from "zod";

const HashchainManager: React.FC = () => {
  const {
    hashchainFromServer,
    error,
    loading,
    fetchHashchainFromServer,
    sendTailToServer,
  } = useHaschchainFromServer();
  const [newHash, setNewHash] = useState("");
  const [hashIndex, setHashIndex] = useState<number | undefined>();
  const { user } = useUser();
  const { fetchSecretAndLength, syncLastHashSendIndex } =
    useHashChainFromExtension();
  const { setHashChain } = useHashChainContext();
  const [extensionData, setExtensionData] = useState<{
    secret: string;
    length: number;
    tail: string;
  } | null>(null);

  useEffect(() => {
    fetchHashchainFromServer();
  }, [fetchHashchainFromServer]);

  const handleUpdateHashchainFromServer = async () => {
    if (newHash && hashIndex !== undefined) {
      try {
        await sendTailToServer(newHash, hashIndex);
        await fetchHashchainFromServer();
        setNewHash("");
        setHashIndex(undefined);
      } catch (error) {
        console.error("Error updating payword:", error);
      }
    }
  };

  const handleFetchHashchainFromExtension = async () => {
    try {
      const data = await fetchSecretAndLength();
      setExtensionData(data);
      setNewHash(data.tail);
      setHashIndex(data.length);
    } catch (error) {
      console.error("Error fetching payword from extension:", error);
      if (error instanceof z.ZodError) {
        console.error("Zod validation errors:", error.errors);
        error.errors.forEach((err, index) => {
          console.error(`Error ${index + 1}:`, err.path, err.message);
        });
      }
    }
  };

  const handleSyncLastHashSendIndex = async () => {
    if (hashchainFromServer) {
      await syncLastHashSendIndex(hashchainFromServer.mostRecentHashIndex);
    } else {
      console.error(
        "Extension data not available. Fetch payword from extension first."
      );
    }
  };

  const setContextHashchainFromExtension = () => {
    if (extensionData) {
      const chain = generateHashChain(
        extensionData.secret,
        extensionData.length
      );
      setHashChain(chain.slice(0, -1));
    } else {
      console.error(
        "Extension data not available. Fetch payword from extension first."
      );
    }
  };
  return (
    <div>
      <div className="max-w-sm mx-auto p-4 bg-gray-100 shadow-sm rounded-sm">
        <h1 className="text-sm font-bold mb-2 text-gray-700">Server Data</h1>
        <button
          onClick={handleFetchHashchainFromExtension}
          className="bg-blue-500 text-white text-xs px-2 py-1 rounded-sm hover:bg-blue-600 mt-2 w-full"
        >
          Fetch Payword from Extension
        </button>
        <button
          onClick={setContextHashchainFromExtension}
          className="bg-green-500 text-white text-xs px-2 py-1 rounded-sm hover:bg-green-600 mt-2 w-full"
        >
          Set Local Hash Chain
        </button>
        <h2 className="text-base font-semibold text-gray-800">
          {user?.firstName}&apos;s Payword
        </h2>
        {loading && <p className="text-xs text-gray-500">Loading...</p>}
        {error && <p className="text-xs text-red-500">{error}</p>}
        {hashchainFromServer && (
          <div className="mb-4">
            <p className="text-xs text-gray-700">
              Last Hash: <SingleHashView hash={hashchainFromServer.lastHash} />
            </p>
            <p className="text-xs text-gray-700">
              Chain Size: {hashchainFromServer.chainSize}
            </p>
            <p className="text-xs text-gray-700">
              Most recent hash:
              <SingleHashView hash={hashchainFromServer.mostRecentHash} />
            </p>
            <p className="text-xs text-gray-700">
              Index of most recent hash:{" "}
              {hashchainFromServer.mostRecentHashIndex}
            </p>
          </div>
        )}
        <input
          type="text"
          value={newHash}
          onChange={(e) => setNewHash(e.target.value)}
          placeholder="Enter new hash"
          className="w-full p-2 border rounded-sm mt-2 text-xs text-gray-700"
        />
        <input
          type="number"
          value={hashIndex !== undefined ? hashIndex : ""}
          onChange={(e) => setHashIndex(parseInt(e.target.value))}
          placeholder="Enter position in chain"
          className="w-full p-2 border rounded-sm mt-2 text-xs text-gray-700"
        />
        <button
          onClick={handleUpdateHashchainFromServer}
          className="bg-blue-500 text-white text-xs px-2 py-1 rounded-sm hover:bg-blue-600 mt-2 w-full"
        >
          Update Payword
        </button>
        <button
          onClick={() => fetchHashchainFromServer()}
          className="bg-green-500 text-white text-xs px-2 py-1 rounded-sm hover:bg-green-600 mt-2 w-full"
        >
          Refetch Payword
        </button>
        {!!hashchainFromServer && (
          <button
            onClick={handleSyncLastHashSendIndex}
            className="bg-blue-500 text-white text-xs px-2 py-1 rounded-sm hover:bg-blue-600 mt-2 w-full"
          >
            Sync Last Hash Send Index
          </button>
        )}
      </div>
    </div>
  );
};

export default HashchainManager;
