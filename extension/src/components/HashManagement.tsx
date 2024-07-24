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
      <header>
        <ul className="text-gray-300 mb-4">{selectedHashChain?.key}</ul>
        <ul className="text-gray-300">
          {hashChains.length > 0 ? (
            hashChains.map((chain) => (
              <li
                key={chain.key}
                onClick={() => handleKeySelect(chain.key)}
                className="cursor-pointer hover:text-indigo-400"
              >
                {chain.key}
              </li>
            ))
          ) : (
            <li>No hash keys found</li>
          )}
        </ul>
      </header>
    </div>
  );
};

export default HashManagement;
