import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HashObject } from "../utils/interfaces";
import { deleteHashChain, getAllHashChains } from "../utils/UsefulFunctions";

const HashChainDetail: React.FC = () => {
  const { key } = useParams<{ key: string }>();
  const [hashChain, setHashChain] = useState<HashObject | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHashChain = async () => {
      try {
        const hashChains = await getAllHashChains();
        const hashObject = hashChains.find((obj) => obj.key === key);
        if (hashObject) {
          setHashChain(hashObject);
        } else {
          console.error("Hash chain not found");
        }
      } catch (error) {
        console.error("Error fetching hash chain:", error);
      }
    };

    fetchHashChain();
  }, [key]);

  const handleSelect = () => {
    if (key) {
      chrome.storage.local.set({ selectedKey: key }, () => {
        console.log("Hash chain selected successfully!");
      });
    }
  };

  const handleDelete = async () => {
    if (key) {
      try {
        await deleteHashChain(key);
        console.log("Hash chain deleted successfully!");
        navigate("/manage");
      } catch (error) {
        console.error("Error deleting hash chain:", error);
      }
    }
  };

  if (!hashChain) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-4 bg-gray-900 rounded-lg shadow-md">
      <header>
        <h1 className="text-2xl font-bold text-gray-200 mb-4">
          Hash Chain Detail
        </h1>
        <p className="text-gray-300">Key: {hashChain.key}</p>
        <p className="text-gray-300">
          Address Contract: {hashChain.address_contract}
        </p>
        <p className="text-gray-300">Address To: {hashChain.address_to}</p>
        <p className="text-gray-300">Length: {hashChain.length}</p>
        <p className="text-gray-300">Tail: {hashChain.tail}</p>
        <button
          onClick={handleSelect}
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
      </header>
    </div>
  );
};

export default HashChainDetail;
