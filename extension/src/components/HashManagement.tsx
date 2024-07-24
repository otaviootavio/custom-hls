import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHashChain } from "../context/HashChainContext";

const HashManagement: React.FC = () => {
  const { hashChains, fetchHashChains, selectedHashChain, selectHashChain } =
    useHashChain();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHashChains();
  }, [fetchHashChains]);

  const handleKeySelect = (key: string) => {
    selectHashChain(key);
    navigate(`/hashchain/${key}`);
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-gray-900 rounded-lg shadow-md">
      <div>
        Selected Hash Chain:
        <div className="cursor-pointer mt-2 bg-gray-800 rounded-lg text-center p-2">
          {selectedHashChain?.key ?? "No Hash Chain Selected"}
        </div>
      </div>
      <div className="mt-4">
        List of Hash Chains:
        <ul className="text-gray-300 min-h-max">
          {hashChains.length > 0 ? (
            hashChains.map((chain) => (
              <li
                key={chain.key}
                onClick={() => handleKeySelect(chain.key)}
                className={`cursor-pointer mt-2 hover:text-indigo-400 bg-gray-800 rounded-lg text-center p-2 ${
                  chain.key === selectedHashChain?.key ? "bg-indigo-600" : ""
                }`}
              >
                {chain.key}
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
