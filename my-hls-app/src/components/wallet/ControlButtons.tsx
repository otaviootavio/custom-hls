import React from "react";
import { useHashChainFromExtension } from "../../context/HashChainExtensionProvider";

const ControlButtons: React.FC = () => {
  const {
    fetchTail,
    fetchAndPopHashFromHashChain,
    fetchHashChain,
    fetchSecretAndLength,
  } = useHashChainFromExtension();

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 p-4">
      <button
        onClick={fetchTail}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
      >
        Send Tail
      </button>
      <button
        onClick={fetchAndPopHashFromHashChain}
        className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 transition-colors"
      >
        Get Next
      </button>
      <button
        onClick={fetchHashChain}
        className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 transition-colors"
      >
        Get full Hashchain
      </button>
      <button
        onClick={fetchSecretAndLength}
        className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 transition-colors"
      >
        Get secret and length
      </button>
    </div>
  );
};

export default ControlButtons;
