import React, { useEffect, useState } from "react";

const App: React.FC = () => {
  const [hashChainElements, setHashChainElements] = useState<
    { data: string; index: number }[]
  >([]);
  const [h100, setH100] = useState<string>("");

  const [sendHashChainAutomatically, setSendHashChainAutomatically] =
    useState(false);

  useEffect(() => {
    const handleResponse = (event: MessageEvent) => {
      if (event.data.type === "HashChain") {
        setHashChainElements((prev) => [
          ...prev,
          { data: event.data.data, index: event.data.index },
        ]);
      } else if (event.data.type === "Recover_h(100)") {
        console.log("Chegou", h100);
        setH100(event.data.data);
        console.log("Aceito", h100);
      }
    };

    window.addEventListener("message", handleResponse);
    return () => window.removeEventListener("message", handleResponse);
  }, []);

  useEffect(() => {
    let hashChainIntervalId: number | undefined;
    if (sendHashChainAutomatically) {
      hashChainIntervalId = setInterval(
        () => window.postMessage({ type: "RequestHashChain" }, "*"),
        3000
      );
      return () => clearInterval(hashChainIntervalId);
    }
  }, [sendHashChainAutomatically]);

  const sendH100Once = () => window.postMessage({ type: "Send_h(100)" }, "*");

  return (
    <div>
      <button
        onClick={() =>
          setSendHashChainAutomatically(!sendHashChainAutomatically)
        }
      >
        {sendHashChainAutomatically
          ? " Stop Transmission"
          : "Start Transmission "}
      </button>
      <button onClick={sendH100Once}>Send Tail</button>
      <ul>{h100}</ul>
      <ul>
        {hashChainElements.map((element, index) => (
          <li key={index}>
            {element.index}: {element.data}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
