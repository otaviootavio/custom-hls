import React from "react";
import { useHashChainFromExtension } from "../../context/HashChainExtensionProvider";

const HashChainElementsList: React.FC = () => {
  const { hashChainElements, tail, fullHashChain, secret, length } =
    useHashChainFromExtension();

  return (
    <div className="p-4">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          Tail:
        </h2>
        <ul className="text-gray-900 dark:text-gray-100">{tail}</ul>
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
              {element.index}: {element.hash}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          Full Hash Chain:
        </h2>
        <ul className="space-y-2">
          {fullHashChain.map((element: string, index: number) => (
            <li
              key={index}
              className="bg-white dark:bg-gray-700 p-2 rounded-lg shadow text-gray-900 dark:text-gray-100"
            >
              {element}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md mt-4">
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          Secret:
        </h2>
        <ul className="text-gray-900 dark:text-gray-100">{secret}</ul>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          Hashchain length ( including the tail ):
        </h2>
        <ul className="text-gray-900 dark:text-gray-100">{length}</ul>
      </div>
    </div>
  );
};

export default HashChainElementsList;
