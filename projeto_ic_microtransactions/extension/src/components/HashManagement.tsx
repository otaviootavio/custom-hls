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
    <div>
      <header>
        <button onClick={fetchHashChains}>Hashchains</button>
        <button onClick={handleKeyNow}>Selected Key</button>
        <ul>{keyNow}</ul>
        <ul>
          {hashKeys.length > 0 ? (
            hashKeys.map((key, index) => (
              <li key={index} onClick={() => handleKeySelect(key)}>
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
