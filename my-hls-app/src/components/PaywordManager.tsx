import React, { useEffect, useState } from "react";
import usePayword from "@/hooks/usePayword";
import SingleHashView from "./SingleHashView";
import { useUser } from "@clerk/nextjs";
import { useHashChainFromExtension } from "@/context/HashChainExtensionProvider";
import { generateHashChain } from "@/lib/HashChainUtils";
import { useHashChain } from "@/context/HashChainContext";

const PaywordManager: React.FC = () => {
  const { payword, error, loading, fetchPayword, sendTailToServer } =
    usePayword();
  const [newHash, setNewHash] = useState("");
  const [position, setPosition] = useState<number | undefined>();
  const { user } = useUser();
  const { fetchPaywordFromExtension } = useHashChainFromExtension();
  const { setHashChain } = useHashChain();
  const [extensionData, setExtensionData] = useState<{
    secret: string;
    length: number;
    tail: string;
  } | null>(null);

  useEffect(() => {
    fetchPayword();
  }, [fetchPayword]);

  const handleUpdatePayword = async () => {
    if (newHash && position !== undefined) {
      try {
        await sendTailToServer(newHash, position);
        await fetchPayword();
        setNewHash("");
        setPosition(undefined);
      } catch (error) {
        console.error("Error updating payword:", error);
      }
    }
  };

  const handleFetchPaywordFromExtension = async () => {
    try {
      const data = await fetchPaywordFromExtension();
      setExtensionData(data);
      setNewHash(data.tail);
      setPosition(data.length);
    } catch (error) {
      console.error("Error fetching payword from extension:", error);
    }
  };

  const setLocalHashChain = () => {
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
          onClick={handleFetchPaywordFromExtension}
          className="bg-blue-500 text-white text-xs px-2 py-1 rounded-sm hover:bg-blue-600 mt-2 w-full"
        >
          Fetch Payword from Extension
        </button>
        <button
          onClick={setLocalHashChain}
          className="bg-green-500 text-white text-xs px-2 py-1 rounded-sm hover:bg-green-600 mt-2 w-full"
        >
          Set Local Hash Chain
        </button>
        <h2 className="text-base font-semibold text-gray-800">
          {user?.firstName}&apos;s Payword
        </h2>
        {loading && <p className="text-xs text-gray-500">Loading...</p>}
        {error && <p className="text-xs text-red-500">{error}</p>}
        {payword && (
          <div className="mb-4">
            <p className="text-xs text-gray-700">
              Last Hash: <SingleHashView hash={payword.lastHash} />
            </p>
            <p className="text-xs text-gray-700">
              Chain Size: {payword.chainSize}
            </p>
            <p className="text-xs text-gray-700">
              Most recent hash:
              <SingleHashView hash={payword.mostRecentHash} />
            </p>
            <p className="text-xs text-gray-700">
              Index of most recent hash: {payword.mostRecentHashIndex}
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
          value={position !== undefined ? position : ""}
          onChange={(e) => setPosition(parseInt(e.target.value))}
          placeholder="Enter position in chain"
          className="w-full p-2 border rounded-sm mt-2 text-xs text-gray-700"
        />
        <button
          onClick={handleUpdatePayword}
          className="bg-blue-500 text-white text-xs px-2 py-1 rounded-sm hover:bg-blue-600 mt-2 w-full"
        >
          Update Payword
        </button>
        <button
          onClick={() => fetchPayword()}
          className="bg-green-500 text-white text-xs px-2 py-1 rounded-sm hover:bg-green-600 mt-2 w-full"
        >
          Refetch Payword
        </button>
      </div>
    </div>
  );
};

export default PaywordManager;
