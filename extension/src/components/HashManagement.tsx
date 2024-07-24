import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllHashChains } from "../utils/UsefulFunctions";

const HashManagement: React.FC = () => {
  const [hashKeys, setHashKeys] = useState<string[]>([]);
  const [keyNow, setKeyNow] = useState("");
  const navigate = useNavigate();

  const fetchHashChains = async () => {
    try {
      const hashChains = await getAllHashChains();
      const keys = hashChains.map((obj) => obj.key);
      setHashKeys(keys);
    } catch (error) {
      console.error("Error fetching hash chains:", error);
    }
  };

  const handleKeyNow = () => {
    chrome.storage.local.get("selectedKey", (result) => {
      setKeyNow(result.selectedKey);
    });
  };

  const handleKeySelect = (key: string) => {
    navigate(`/hashchain/${key}`);
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-gray-900 rounded-lg shadow-md">
      <header>
        <button
          onClick={fetchHashChains}
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
        >
          Fetch Hash Chains
        </button>
        <button
          onClick={handleKeyNow}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        >
          Show Selected Key
        </button>
        <ul className="text-gray-300 mb-4">{keyNow}</ul>
        <ul className="text-gray-300">
          {hashKeys.length > 0 ? (
            hashKeys.map((key, index) => (
              <li
                key={index}
                onClick={() => handleKeySelect(key)}
                className="cursor-pointer hover:text-indigo-400"
              >
                {key}
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
