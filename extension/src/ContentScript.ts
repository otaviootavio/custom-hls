window.addEventListener("message", handleMessage);

function handleMessage(event: MessageEvent) {
  switch (event.data.type) {
    case "Send_h(100)":
      handleSendH100();
      break;
    case "RequestHashChain":
      handleRequestHashChain();
      break;
    case "RequestFullHashChain":
      handleRequestFullHashChain();
      break;
    case "RequestSecretLength":
      handleRequestSecretLength();
      break;
    case "RequestSyncLastHashSendIndex":
      handleSyncLastHashSendIndex(event);
      break;
    case "RequestOpenChannel":
      handleOpenChannel(event);
      break;
    case "RequestSmartContractAddress":
      handleRequestSmartContractAddress();
      break;
    case "RequestChainId":
      handleRequstChainId();
      break;
    case "RequestToAddress":
      handleRequestToAddress();
      break;
    case "RequestAmount":
      handleRequestAmount();
      break;
    case "RequestUserExportHashChainToExtension":
      handleUserExportHashChainToExtension(event);
      break;
    // It will listen to all messages from all extensions
    // default:
    //   console.error("Unknown message type:", event.data.type);
  }
}

function handleSendH100() {
  chrome.runtime.sendMessage({ action: "Deliver_h(100)" }, (response) => {
    if (response && response.data !== undefined) {
      window.postMessage({ type: "Recover_h(100)", data: response.data }, "*");
    } else {
      window.postMessage(
        { type: "Recover_h(100)", data: "No data found" },
        "*"
      );
    }
  });
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

function handleSyncLastHashSendIndex(event: MessageEvent) {
  console.log("Handling SyncLastHashSendIndex action");
  chrome.runtime.sendMessage(
    { action: "DeliverSyncLastHashSendIndex", data: { ...event.data } },
    (response) => {
      if (response && response.data !== undefined) {
        window.postMessage(
          { type: "SyncLastHashSendIndex", data: response.data },
          "*"
        );
      } else {
        window.postMessage(
          { type: "SyncLastHashSendIndex", data: "No data found" },
          "*"
        );
      }
    }
  );
}

function handleOpenChannel(event: MessageEvent) {
  console.log("Handling HandleOpenChannel action");
  chrome.runtime.sendMessage(
    { action: "DeliverOpenChannel", data: { ...event.data } },
    (response) => {
      if (response && response.data !== undefined) {
        window.postMessage({ type: "OpenChannel", data: response.data }, "*");
      } else {
        window.postMessage({ type: "OpenChannel", data: "No data found" }, "*");
      }
    }
  );
}

function handleRequestSmartContractAddress() {
  chrome.runtime.sendMessage(
    { action: "DeliverSmartContractAddress" },
    (response) => {
      if (response && response.data !== null) {
        window.postMessage(
          {
            type: "SmartContractAddress",
            data: response.data,
          },
          "*"
        );
      } else {
        window.postMessage(
          { type: "SmartContractAddress", data: "No data found" },
          "*"
        );
      }
    }
  );
}

function handleRequstChainId() {
  chrome.runtime.sendMessage({ action: "DeliverChainId" }, (response) => {
    if (response && response.data !== null) {
      window.postMessage(
        {
          type: "ChainId",
          data: response.data,
        },
        "*"
      );
    } else {
      window.postMessage({ type: "ChainId", data: "No data found" }, "*");
    }
  });
}

function handleRequestToAddress() {
  chrome.runtime.sendMessage({ action: "DeliverToAddress" }, (response) => {
    if (response && response.data !== null) {
      window.postMessage(
        {
          type: "ToAddress",
          data: response.data,
        },
        "*"
      );
    } else {
      window.postMessage({ type: "ToAddress", data: "No data found" }, "*");
    }
  });
}

function handleRequestAmount() {
  chrome.runtime.sendMessage({ action: "DeliverAmount" }, (response) => {
    if (response && response.data !== null) {
      window.postMessage(
        {
          type: "Amount",
          data: response.data,
        },
        "*"
      );
    } else {
      window.postMessage({ type: "Amount", data: "No data found" }, "*");
    }
  });
}

function handleUserExportHashChainToExtension(event: MessageEvent) {
  chrome.runtime.sendMessage(
    {
      action: "DeliverUserExportHashChainToExtension",
      data: { ...event.data },
    },
    (response) => {
      console.log("handleUserExportHashChainToExtension");
      console.log(response);
      window.postMessage(
        {
          type: "UserExportHashChainToExtension",
          data: {
            status: response.status,
            message: response.message,
          },
        },
        "*"
      );
    }
  );
}
