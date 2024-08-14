import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHashChain } from "../context/HashChainContext";

const HashChainDetail: React.FC = () => {
  const { key } = useParams<{ key: string }>();
  const { selectedHashChain, selectHashChain, deleteHashChain } =
    useHashChain();
  const navigate = useNavigate();

  useEffect(() => {
    if (key) {
      selectHashChain(key);
    }
  }, [key, selectHashChain]);
  const handleDelete = async () => {
    if (key) {
      await deleteHashChain(key);
      navigate("/manage");
    }
  };

  if (!selectedHashChain) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-4 bg-gray-900 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-200 mb-4">
        Hash Chain Detail
      </h1>
      <p className="text-gray-300">Key: {selectedHashChain.key}</p>
      <p className="text-gray-300">
        Address Contract: {selectedHashChain.address_contract}
      </p>
      <p className="text-gray-300">
        Address To: {selectedHashChain.address_to}
      </p>
      <p className="text-gray-300">
        Length: {selectedHashChain.originalLength}
      </p>
      <p className="text-gray-300">
        Tail:{" "}
        <span className="break-words">
          {selectedHashChain.tail.substring(0, 8)}...
        </span>
      </p>
      <p className="text-gray-300">
        Last Not Used Hash Index: {selectedHashChain.lastNotUsedHashIndex}
      </p>
      <p className="text-gray-300">Value: {selectedHashChain.value}</p>
      <p className="text-gray-300">
        Blockchain Id: {selectedHashChain.blockchainId}
      </p>
      <button
        onClick={() => selectHashChain(selectedHashChain.key)}
        className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-4"
      >
        Select this hash chain
      </button>
      <button
        onClick={handleDelete}
        className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 mt-2"
      >
        Delete this hash chain
      </button>
    </div>
  );
};

export default HashChainDetail;
