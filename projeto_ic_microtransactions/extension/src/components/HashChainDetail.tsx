import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { HashObject } from "../utils/interfaces";
import { deleteHashChain, getAllHashChains } from "../utils/UsefulFunctions";

const HashChainDetail: React.FC = () => {
  const { key } = useParams<{ key: string }>();
  const [hashChain, setHashChain] = useState<HashObject | null>(null);

  useEffect(() => {
    const fetchHashChain = async () => {
      try {
        const hashChains = await getAllHashChains();
        const hashObject = hashChains.find((obj) => obj.key === key);
        if (hashObject) {
          setHashChain(hashObject);
        } else {
          console.error("Hash chain not found");
        }
      } catch (error) {
        console.error("Error fetching hash chain:", error);
      }
    };

    fetchHashChain();
  }, [key]);

  const handleSelect = () => {
    if (key) {
      chrome.storage.local.set({ selectedKey: key }, () => {
        console.log("Hash chain selected successfully!");
      });
    }
  };

  const handleDelete = async () => {
    if (key) {
      try {
        await deleteHashChain(key);
        console.log("Hash chain deleted successfully!");
        setHashChain(null); // Clear the state or navigate away after deletion
      } catch (error) {
        console.error("Error deleting hash chain:", error);
      }
    }
  };

  if (!hashChain) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <header>
        <h1>Hash Chain Detail</h1>
        <p>Key: {hashChain.key}</p>
        <p>Address Contract: {hashChain.address_contract}</p>
        <p>Address To: {hashChain.address_to}</p>
        <p>Length: {hashChain.length}</p>
        <p>Tail: {hashChain.tail}</p>
        <button onClick={handleSelect}>Select this hash chain</button>
        <button onClick={handleDelete}>Delete this hash chain</button>
      </header>
    </div>
  );
};

export default HashChainDetail;
