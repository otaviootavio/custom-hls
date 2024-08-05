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
