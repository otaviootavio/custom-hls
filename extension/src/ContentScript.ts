interface MessageData {
  type: string;
  data?: any; // Permite dados opcionais em mensagens
}

window.addEventListener("message", handleMessage);

function handleMessage(event: MessageEvent<MessageData>): void {
  console.log("Received message event:", event);

  // Validação da estrutura da mensagem
  if (!event.data || typeof event.data.type !== "string") {
    console.error("Invalid message format or missing 'type':", event.data);
    return;
  }

  const { type, data } = event.data;

  console.log("Message type:", type);
  console.log("Message data:", data);

  switch (type) {
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
      if (data) handleSyncLastHashSendIndex(data);
      break;
    case "RequestOpenChannel":
      if (data) handleOpenChannel(data);
      break;
    case "RequestSmartContractAddress":
      handleRequestSmartContractAddress();
      break;
    case "RequestChainId":
      handleRequestChainId();
      break;
    case "RequestToAddress":
      handleRequestToAddress();
      break;
    case "RequestAmount":
      handleRequestAmount();
      break;
    case "RequestUserExportHashChainToExtension":
      if (data) handleUserExportHashChainToExtension(data);
      break;
    default:
      console.error("Unknown message type:", type);
  }
}

function handleSendH100(): void {
  console.log("Executing handleSendH100...");
  browser.runtime
    .sendMessage({ action: "Deliver_h(100)" })
    .then((response) => {
      const data = (response as { data?: string })?.data ?? "No data found";
      window.postMessage({ type: "Recover_h(100)", data }, "*");
    })
    .catch((error) => console.error("Error in handleSendH100:", error));
}

function handleRequestHashChain(): void {
  console.log("Executing handleRequestHashChain...");
  browser.runtime
    .sendMessage({ action: "DeliverHashchain" })
    .then((response) => {
      const data = (response as { data?: string })?.data ?? "No data found";
      window.postMessage({ type: "HashChain", data }, "*");
    })
    .catch((error) => console.error("Error in handleRequestHashChain:", error));
}

function handleRequestFullHashChain(): void {
  console.log("Executing handleRequestFullHashChain...");
  browser.runtime
    .sendMessage({ action: "DeliverFullHashchain" })
    .then((response) => {
      const data = (response as { data?: string[] })?.data ?? "No data found";
      window.postMessage({ type: "fullHashChain", data }, "*");
    })
    .catch((error) =>
      console.error("Error in handleRequestFullHashChain:", error)
    );
}

function handleRequestSecretLength(): void {
  console.log("Executing handleRequestSecretLength...");
  browser.runtime
    .sendMessage({ action: "DeliverSecretLength" })
    .then((response) => {
      console.log("Raw response received:", response);

      if (response && response.data) {
        console.log("Valid data received:", response.data);
        window.postMessage({ type: "SecretLength", data: response.data }, "*");
      } else {
        console.warn("Invalid response received. Using fallback data.");
        window.postMessage(
          {
            type: "SecretLength",
            data: { message: "No data found", length: 0 },
          },
          "*"
        );
      }
    })
    .catch((error) =>
      console.error("Error in handleRequestSecretLength:", error)
    );
}

function handleSyncLastHashSendIndex(data: any): void {
  console.log("Executing handleSyncLastHashSendIndex with data:", data);
  browser.runtime
    .sendMessage({ action: "DeliverSyncLastHashSendIndex", data })
    .then((response) => {
      const resultData =
        (response as { data?: number })?.data ?? "No data found";
      window.postMessage(
        { type: "SyncLastHashSendIndex", data: resultData },
        "*"
      );
    })
    .catch((error) =>
      console.error("Error in handleSyncLastHashSendIndex:", error)
    );
}

function handleOpenChannel(data: any): void {
  console.log("Executing handleOpenChannel with data:", data);
  browser.runtime
    .sendMessage({ action: "DeliverOpenChannel", data })
    .then((response) => {
      const resultData =
        (response as { data?: string })?.data ?? "No data found";
      window.postMessage({ type: "OpenChannel", data: resultData }, "*");
    })
    .catch((error) => console.error("Error in handleOpenChannel:", error));
}

function handleRequestSmartContractAddress(): void {
  console.log("Executing handleRequestSmartContractAddress...");
  browser.runtime
    .sendMessage({ action: "DeliverSmartContractAddress" })
    .then((response) => {
      const data = (response as { data?: string })?.data ?? "No data found";
      window.postMessage({ type: "SmartContractAddress", data }, "*");
    })
    .catch((error) =>
      console.error("Error in handleRequestSmartContractAddress:", error)
    );
}

function handleRequestChainId(): void {
  console.log("Executing handleRequestChainId...");
  browser.runtime
    .sendMessage({ action: "DeliverChainId" })
    .then((response) => {
      const data = (response as { data?: number })?.data ?? "No data found";
      window.postMessage({ type: "ChainId", data }, "*");
    })
    .catch((error) => console.error("Error in handleRequestChainId:", error));
}

function handleRequestToAddress(): void {
  console.log("Executing handleRequestToAddress...");
  browser.runtime
    .sendMessage({ action: "DeliverToAddress" })
    .then((response) => {
      const data = (response as { data?: string })?.data ?? "No data found";
      window.postMessage({ type: "ToAddress", data }, "*");
    })
    .catch((error) => console.error("Error in handleRequestToAddress:", error));
}

function handleRequestAmount(): void {
  console.log("Executing handleRequestAmount...");
  browser.runtime
    .sendMessage({ action: "DeliverAmount" })
    .then((response) => {
      const data = (response as { data?: string })?.data ?? "No data found";
      window.postMessage({ type: "Amount", data }, "*");
    })
    .catch((error) => console.error("Error in handleRequestAmount:", error));
}

function handleUserExportHashChainToExtension(data: any): void {
  console.log(
    "Executing handleUserExportHashChainToExtension with data:",
    data
  );
  browser.runtime
    .sendMessage({
      action: "DeliverUserExportHashChainToExtension",
      data,
    })
    .then((response) => {
      window.postMessage(
        {
          type: "UserExportHashChainToExtension",
          data: {
            status: (response as { status: string }).status,
            message: (response as { message: string }).message,
          },
        },
        "*"
      );
    })
    .catch((error) =>
      console.error("Error in handleUserExportHashChainToExtension:", error)
    );
}
