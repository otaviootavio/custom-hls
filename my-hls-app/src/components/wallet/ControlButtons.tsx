import React from "react";
import { useHashChain } from "./HashChainExtensionProvider";

const ControlButtons: React.FC = () => {
  const { sendH100Once, fetchHashChain } = useHashChain();

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 p-4">
      <button
        onClick={sendH100Once}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
      >
        Send Tail
      </button>
      <button
        onClick={fetchHashChain}
        className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 transition-colors"
      >
        Get Next
      </button>
    </div>
  );
};

export default ControlButtons;
