import React from "react";
import { useHashChain } from "./HashChainExtensionProvider";

const HashChainElementsList: React.FC = () => {
  const { hashChainElements, h100 } = useHashChain();

  return (
    <div className="p-4">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          Tail:
        </h2>
        <ul className="text-gray-900 dark:text-gray-100">{h100}</ul>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          Hash Chain Elements:
        </h2>
        <ul className="space-y-2">
          {hashChainElements.map((element, index) => (
            <li
              key={index}
              className="bg-white dark:bg-gray-700 p-2 rounded-lg shadow text-gray-900 dark:text-gray-100"
            >
              {element.index}: {element.data}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HashChainElementsList;
