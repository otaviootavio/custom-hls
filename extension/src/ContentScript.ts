window.addEventListener("message", handleMessage);

function handleMessage(event: MessageEvent) {
  switch (event.data.type) {
    case "RequestHashChain":
      handleRequestHashChain();
      break;
    case "RequestFullHashChain":
      handleRequestFullHashChain();
      break;
    case "RequestSecretLength":
      handleRequestSecretLength();
      break;
    case "SendBlockchainData":
      handleAddBlockchainDataFromApp(event.data.data);
      break;
    case "UpdateLastNotUsedHashIndex":
      handleUpdateLastNotUsedHashIndex(event.data.data);
      break;
    case "RequestTailAndOriginalLength":
      handleRequestTailAndOriginalLength();
      break;
  }
}

function handleRequestHashChain() {
  chrome.runtime.sendMessage({ action: "DeliverHashchain" }, (response) => {
    if (response && response.data !== null) {
      window.postMessage({ type: "HashChain", data: response.data }, "*");
    } else {
      window.postMessage({ type: "HashChain", data: "No data found" }, "*");
    }
  });
}

function handleRequestFullHashChain() {
  chrome.runtime.sendMessage({ action: "DeliverFullHashchain" }, (response) => {
    if (response && response.data !== null) {
      window.postMessage(
        {
          type: "fullHashChain",
          data: response.data,
        },
        "*"
      );
    } else {
      window.postMessage({ type: "fullHashChain", data: "No data found" }, "*");
    }
  });
}

function handleRequestTailAndOriginalLength() {
  chrome.runtime.sendMessage(
    { action: "DeliverTailandOriginalLength" },
    (response) => {
      if (response && response.data !== null) {
        window.postMessage(
          { type: "TailAndOriginalLength", data: response.data },
          "*"
        );
      } else {
        window.postMessage(
          { type: "TailAndOriginalLength", data: "No data found" },
          "*"
        );
      }
    }
  );
}

function handleRequestSecretLength() {
  chrome.runtime.sendMessage({ action: "DeliverSecretLength" }, (response) => {
    if (response && response.data) {
      window.postMessage(
        {
          type: "SecretLength",
          data: response.data,
        },
        "*"
      );
    } else {
      window.postMessage(
        { type: "SecretLength", data: "No data found", length: 0 },
        "*"
      );
    }
  });
}

function handleAddBlockchainDataFromApp(data: {
  tail: string;
  address_contract: string;
  address_to: string;
  value: number;
  blockchainId: number;
}) {
  chrome.runtime.sendMessage(
    { action: "AddBlockchainDataFromApp", data },
    (response) => {
      if (response && response.status === "success") {
        window.postMessage(
          { type: "BlockchainDataAdded", data: "Blockchain data added" },
          "*"
        );
      } else {
        window.postMessage(
          { type: "BlockchainDataAdded", data: "Blockchain data not added" },
          "*"
        );
      }
    }
  );
}

function handleUpdateLastNotUsedHashIndex(data: {
  tail: string;
  index: number;
}) {
  chrome.runtime.sendMessage(
    { action: "UpdateLastNotUsedHashIndex", data },
    (response) => {
      if (response && response.status === "success") {
        window.postMessage(
          {
            type: "LastNotUsedHashIndexUpdated",
            data: "LastNotUsedHashIndex updated",
          },
          "*"
        );
      } else {
        window.postMessage(
          {
            type: "LastNotUsedHashIndexUpdated",
            data: "LastNotUsedHashIndex not updated",
          },
          "*"
        );
      }
    }
  );
}
