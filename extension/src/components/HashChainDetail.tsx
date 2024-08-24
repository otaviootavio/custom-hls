import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHashChain } from "../context/HashChainContext";

const HashChainDetail: React.FC = () => {
  const { key } = useParams<{ key: string }>();
  const { selectedHashChain, selectHashChain, deleteHashChain } =
    useHashChain();
  const navigate = useNavigate();

  useEffect(() => {
    if (key) {
      selectHashChain(key);
    }
  }, [key, selectHashChain]);

  const handleDelete = async () => {
    if (key) {
      await deleteHashChain(key);
      navigate("/manage");
    }
  };

  const handleSelect = async () => {
    if (key) {
      await selectHashChain(key);
      navigate("/manage");
    }
  };

  if (!selectedHashChain) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  const renderField = (label: string, value: string | number) => (
    <p className="text-gray-300 mb-2">
      {label}:
      <div className="p-1 bg-gray-800 border border-gray-700 shadow rounded-md mt-1">
        {typeof value === "string" && value.startsWith("0x") ? (
          <span className="break-all">{value}</span>
        ) : (
          value
        )}
      </div>
    </p>
  );

  return (
    <div className="w-full p-4 bg-gray-900 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-200 mb-4">
        Hash chain detail
      </h1>
      {renderField("Key", selectedHashChain.key)}
      {renderField("Address Contract", selectedHashChain.address_contract)}
      {renderField("Address To", selectedHashChain.address_to)}
      {renderField("Length", selectedHashChain.length)}
      {renderField("Tail", `${selectedHashChain.tail}`)}
      {renderField(
        "Index of last hash send",
        selectedHashChain.indexOfLastHashSend
      )}
      {renderField("Secret", selectedHashChain.secret)}
      <button
        onClick={handleSelect}
        className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-4"
      >
        Select this hash chain
      </button>
      <button
        onClick={handleDelete}
        className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 mt-2"
      >
        Delete this hash chain
      </button>
    </div>
  );
};

export default HashChainDetail;
