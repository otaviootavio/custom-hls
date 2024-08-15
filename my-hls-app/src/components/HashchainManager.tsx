import React, { useEffect, useState } from "react";
import useHaschchainFromServer from "@/hooks/useHashchainFromServer";
import SingleHashView from "./SingleHashView";
import { useHashChainFromExtension } from "@/context/HashChainExtensionProvider";
import { useHashChainContext } from "@/context/HashChainContext";
import { generateHashChain } from "@/utils/HashChainUtils";
import { z } from "zod";
import { stringToBytes, toBytes } from "viem";

const HashchainManager: React.FC = () => {
  const {
    hashchainFromServer,
    error,
    loading,
    fetchHashchainFromServer,
    sendTailToServer,
  } = useHaschchainFromServer();
  const [newHash, setNewHash] = useState("");
  const [newHashChainSize, setNewHashChainSize] = useState<
    number | undefined
  >();
  const { fetchSecretAndLength, syncLastHashSendIndex } =
    useHashChainFromExtension();
  const { setHashChain } = useHashChainContext();
  const [extensionData, setExtensionData] = useState<{
    secret: string;
    length: number;
    tail: string;
    lastHashSendIndex: number;
  } | null>(null);

  useEffect(() => {
    fetchHashchainFromServer();
  }, [fetchHashchainFromServer]);

  const handleUpdateHashchainFromServer = async () => {
    if (newHash && newHashChainSize !== undefined) {
      try {
        await sendTailToServer(newHash, newHashChainSize);
        await fetchHashchainFromServer();
        setNewHash("");
        setNewHashChainSize(undefined);
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
      setNewHashChainSize(data.length);
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
      const lastHashSendIndex = hashchainFromServer.mostRecentHashIndex;
      await syncLastHashSendIndex(lastHashSendIndex);
      const extenstionData = await fetchSecretAndLength();
      const hashchain = generateHashChain(
        stringToBytes(extenstionData.secret, { size: 32 }),
        lastHashSendIndex - 1
      );
      console.log(
        generateHashChain(
          stringToBytes(extenstionData.secret, { size: 32 }),
          lastHashSendIndex
        )
      );
      setHashChain(hashchain);
    } else {
      console.error(
        "Extension data not available. Fetch payword from extension first."
      );
    }
  };

  const setContextHashchainFromExtension = () => {
    if (newHashChainSize) {
      const hashchain = generateHashChain(
        toBytes(newHash, { size: 32 }),
        newHashChainSize - 1
      );
      setHashChain(hashchain);
      console.log(hashchain);
    } else {
      console.error(
        "Extension data not available. Fetch payword from extension first."
      );
    }
  };
  return (
    <div className="flex flex-col items-start justify-start p-2 bg-gray-200 gap-10">
      <div>
        <p>Extension Control Button</p>
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
      </div>
      <div>
        <p> Data stored on server</p>
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
              Index of most recent hash:
              {hashchainFromServer.mostRecentHashIndex}
            </p>
          </div>
        )}
        <button
          onClick={() => fetchHashchainFromServer()}
          className="bg-green-500 text-white text-xs px-2 py-1 rounded-sm hover:bg-green-600 mt-2 w-full"
        >
          Refetch Payword
        </button>
      </div>
      <div>
        <p>Forms to update server data</p>
        <p>Enter tail:</p>
        <input
          type="text"
          value={newHash}
          onChange={(e) => setNewHash(e.target.value)}
          placeholder="Enter new hash"
          className="w-full p-2 border rounded-sm mt-2 text-xs text-gray-700"
        />
        <p>Enter chain size:</p>
        <input
          type="number"
          value={newHashChainSize !== undefined ? newHashChainSize : ""}
          onChange={(e) => setNewHashChainSize(parseInt(e.target.value))}
          placeholder="Enter position in chain"
          className="w-full p-2 border rounded-sm mt-2 text-xs text-gray-700"
        />
        <button
          onClick={handleUpdateHashchainFromServer}
          className="bg-blue-500 text-white text-xs px-2 py-1 rounded-sm hover:bg-blue-600 mt-2 w-full"
        >
          Update Payword
        </button>
      </div>
      <div>
        <p>Player Control Button</p>
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
