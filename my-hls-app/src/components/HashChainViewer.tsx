import React from "react";
import { useHashChain } from "@/context/HashChainContext";

// Helper function to crop the hash
const cropHash = (hash: string) => {
  return hash.length > 10 ? `${hash.slice(0, 5)}...${hash.slice(-5)}` : hash;
};

// Function to copy text to clipboard
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(
    () => {},
    (err) => {
      console.error("Could not copy text: ", err);
    }
  );
};

// HashChainViewer Component
const HashChainViewer: React.FC = () => {
  const { hashChain } = useHashChain();

  if (!hashChain || hashChain.length === 0) {
    return (
      <div className="p-4 bg-gray-100">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Hash Chain</h3>
        <div className="mb-4">
          <p className="text-gray-700">Size: 0</p>
          <p className="text-gray-700">
            First Hash:
            <span className="ml-1 cursor-pointer text-blue-500 hover:underline">
              0
            </span>
          </p>
          <p className="text-gray-700">
            Last Hash:
            <span className="ml-1 cursor-pointer text-blue-500 hover:underline">
              0
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">Hash Chain</h3>
      <div className="mb-4">
        <p className="text-gray-700">Size: {hashChain.length}</p>
        <p className="text-gray-700">
          First Hash:
          <span
            className="ml-1 cursor-pointer text-blue-500 hover:underline"
            title={hashChain.length.toString()}
            onClick={() => copyToClipboard(hashChain.length.toString())}
          >
            {cropHash(hashChain[0])}
          </span>
        </p>
        <p className="text-gray-700">
          Last Hash:
          <span
            className="ml-1 cursor-pointer text-blue-500 hover:underline"
            title={hashChain[hashChain.length - 1]}
            onClick={() => copyToClipboard(hashChain[hashChain.length - 1])}
          >
            {cropHash(hashChain[hashChain.length - 1])}
          </span>
        </p>
      </div>
    </div>
  );
};

export default HashChainViewer;
