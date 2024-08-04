window.addEventListener("message", (event) => {
  if (event.data.type === "Send_h(100)") {
    chrome.runtime.sendMessage({ action: "Deliver_h(100)" }, (response) => {
      if (response && response.data !== undefined) {
        window.postMessage(
          { type: "Recover_h(100)", data: response.data },
          "*"
        );
        console.log("Sent to webpage", response.data);
      } else {
        window.postMessage(
          { type: "Recover_h(100)", data: "No data found" },
          "*"
        );
      }
    });
  } else if (event.data.type === "RequestHashChain") {
    chrome.runtime.sendMessage({ action: "DeliverHashchain" }, (response) => {
      console.log("Received response from service worker:", response);
      if (response && response.data !== null) {
        window.postMessage(
          { type: "HashChain", data: response.data, index: response.index },
          "*"
        );
      } else {
        window.postMessage({ type: "HashChain", data: "No data found" }, "*");
      }
    });
  } else if (event.data.type === "RequestFullHashChain") {
    chrome.runtime.sendMessage({ action: "DeliverFullHashchain" }, (response) => {
      console.log("Received response from service worker:", response);
      if (response && response.data !== null) {
        window.postMessage(
          { type: "fullHashChain", data: response.data, index: response.index },
          "*"
        );
      } else {
        window.postMessage({ type: "fullHashChain", data: "No data found" }, "*");
      }
    });
  } else if (event.data.type === "RequestSecretLength") {
    chrome.runtime.sendMessage({ action: "DeliverSecretLength"}, (response) => {
      if(response && response.secret && response.length !== null) {
        window.postMessage(
          { type: "SecretLenght", secret: response.secret, length: response.length},"*"
        );
      } else {
        window.postMessage({ type : "SecretLenght", secret: "No data found"}, "*");
      }
    });
  }
});
