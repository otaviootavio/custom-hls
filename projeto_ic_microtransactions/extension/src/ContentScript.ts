window.addEventListener("message", (event) => {
  if (event.data.type === "Send_h(100)") {
    chrome.runtime.sendMessage({ action: "Deliver_h(100)" }, (response) => {
      if (response && response.data !== undefined) {
        window.postMessage(
          { type: "Recover_h(100)", data: response.data },
          "*"
        );
        console.log("Enviou a pagina web", response.data);
      } else {
        window.postMessage(
          { type: "Recover_h(100)", data: "No data found" },
          "*"
        );
      }
    });
  } else if (event.data.type === "RequestHashChain") {
    chrome.runtime.sendMessage({ action: "DeliverHashchain" }, (response) => {
      console.log("Received response from background:", response);
      if (response && response.data !== null) {
        window.postMessage(
          { type: "HashChain", data: response.data, index: response.index },
          "*"
        );
      } else {
        window.postMessage({ type: "HashChain", data: "No data found" }, "*");
      }
    });
  }
});
