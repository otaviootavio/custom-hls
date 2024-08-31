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
    <div className="w-full mx-auto p-4 bg-gray-900 rounded-lg shadow-md flex flex-col">
      {isLoading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div>
        Selected Hash Chain:
        <div className="cursor-pointer bg-gray-800 rounded-lg text-center p-2">
          {selectedHashChain?.key ?? "No Hash Chain Selected"}
        </div>
      </div>
      <div className="mt-4">
        List of Hash Chains:
        <ul className="text-gray-300 w-full flex flex-col gap-2">
          {hashChains.length > 0 ? (
            hashChains.map((chain) => (
              <li
                key={chain.key}
                className="bg-gray-800 rounded-lg text-center font-semibold"
              >
                <div className="flex flex-row justify-between p-1">
                  <span
                    onClick={() => handleKeySelect(chain.key)}
                    className={`cursor-pointer  hover:text-indigo-500 bg-gray-700 rounded-lg text-center  font-semibold p-2 ${
                      chain.key === selectedHashChain?.key
                        ? "bg-indigo-900"
                        : ""
                    }`}
                  >
                    {chain.key}
                  </span>
                  <button
                    className=" bg-indigo-900  px-2  text-white text-xs font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            <li>
              <div className="bg-gray-800 rounded-lg text-center p-2">
                {" "}
                No hash keys found{" "}
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default HashManagement;
