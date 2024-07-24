import React from "react";
import { useHashChain } from "../context/HashChainContext";
import { useNavigate } from "react-router-dom";

const HashManagement: React.FC = () => {
  const { hashChains, selectedHashChain, isLoading, error, selectHashChain } =
    useHashChain();

  const handleKeySelect = async (key: string) => {
    await selectHashChain(key);
  };

  const navigate = useNavigate();

  return (
    <div className="max-w-lg mx-auto p-4 bg-gray-900 rounded-lg shadow-md flex flex-col gap-2">
      {isLoading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div>
        Selected Hash Chain:
        <div className="cursor-pointer mt-2 bg-gray-800 rounded-lg text-center p-2">
          {selectedHashChain?.key ?? "No Hash Chain Selected"}
        </div>
      </div>
      <div className="mt-4">
        List of Hash Chains:
        <ul className="text-gray-300 min-h-max flex flex-col gap-2">
          {hashChains.length > 0 ? (
            hashChains.map((chain) => (
              <li key={chain.key}>
                <div className="flex flex-row justify-between">
                  <span
                    onClick={() => handleKeySelect(chain.key)}
                    className={`cursor-pointer mt-2 hover:text-indigo-400 bg-gray-800 rounded-lg text-center p-2 ${
                      chain.key === selectedHashChain?.key
                        ? "bg-indigo-600"
                        : ""
                    }`}
                  >
                    {chain.key}
                  </span>
                  <button
                    className="btn btn-sm ml-2"
                    onClick={() => {
                      navigate(`/hashchain/${chain.key}`);
                    }}
                  >
                    View
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li>No hash keys found</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default HashManagement;
