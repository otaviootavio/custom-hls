import React from "react";

// Helper function to crop the hash
const cropHash = (hash: string) => {
  return hash.length > 10 ? `${hash.slice(0, 5)}...${hash.slice(-5)}` : hash;
};

// Function to copy text to clipboard
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(
    () => {
      alert("Hash copied to clipboard");
    },
    (err) => {
      console.error("Could not copy text: ", err);
    }
  );
};

// SingleHashView Component
const SingleHashView: React.FC<{ hash: string }> = ({ hash }) => {
  return (
    <span
      className="ml-1 cursor-pointer text-blue-500 hover:underline"
      title={hash}
      onClick={() => copyToClipboard(hash)}
    >
      {cropHash(hash)}
    </span>
  );
};

export default SingleHashView;
