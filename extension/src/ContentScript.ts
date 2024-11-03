import browser from "webextension-polyfill";
import { HashObjectWithoutKey } from "./utils/interfaces";

interface MessageResponse {
  data?: any;
  status?: string;
  message?: string;
}

interface CustomMessageEventData {
  type: string;
  data?: Partial<HashObjectWithoutKey> & {
    indexOfLastHashSend?: number;
    address_contract?: string;
    address_to?: string;
    amountEthInWei?: string;
    chainId?: number;
    smartContractAddress?: string;
    secret?: string;
    length?: number;
    hashchain?: string[];
    tail?: string;
  };
}

interface CustomMessageEvent extends MessageEvent {
  data: CustomMessageEventData;
}

window.addEventListener("message", handleMessage);

function handleMessage(event: CustomMessageEvent) {
  const { type, data } = event.data;

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

function handleSendH100() {
  (
    browser.runtime.sendMessage({ action: "Deliver_h(100)" }) as Promise<
      Partial<MessageResponse>
    >
  ).then((response) => {
    const data = response?.data ?? "No data found";
    window.postMessage({ type: "Recover_h(100)", data }, "*");
  });
}

function handleRequestHashChain() {
  (
    browser.runtime.sendMessage({ action: "DeliverHashchain" }) as Promise<
      Partial<MessageResponse>
    >
  ).then((response) => {
    const data = response?.data ?? "No data found";
    window.postMessage({ type: "HashChain", data }, "*");
  });
}

function handleRequestFullHashChain() {
  (
    browser.runtime.sendMessage({ action: "DeliverFullHashchain" }) as Promise<
      Partial<MessageResponse>
    >
  ).then((response) => {
    const data = response?.data ?? "No data found";
    window.postMessage({ type: "fullHashChain", data }, "*");
  });
}

function handleRequestSecretLength() {
  (
    browser.runtime.sendMessage({ action: "DeliverSecretLength" }) as Promise<
      Partial<MessageResponse>
    >
  ).then((response) => {
    const data = response?.data ?? { message: "No data found", length: 0 };
    window.postMessage({ type: "SecretLength", data }, "*");
  });
}

function handleSyncLastHashSendIndex(data: CustomMessageEventData["data"]) {
  console.log("Handling SyncLastHashSendIndex action");
  (
    browser.runtime.sendMessage({
      action: "DeliverSyncLastHashSendIndex",
      data,
    }) as Promise<Partial<MessageResponse>>
  ).then((response) => {
    const resultData = response?.data ?? "No data found";
    window.postMessage(
      { type: "SyncLastHashSendIndex", data: resultData },
      "*"
    );
  });
}

function handleOpenChannel(data: CustomMessageEventData["data"]) {
  console.log("Handling OpenChannel action");
  (
    browser.runtime.sendMessage({
      action: "DeliverOpenChannel",
      data,
    }) as Promise<Partial<MessageResponse>>
  ).then((response) => {
    const resultData = response?.data ?? "No data found";
    window.postMessage({ type: "OpenChannel", data: resultData }, "*");
  });
}

function handleRequestSmartContractAddress() {
  (
    browser.runtime.sendMessage({
      action: "DeliverSmartContractAddress",
    }) as Promise<Partial<MessageResponse>>
  ).then((response) => {
    const data = response?.data ?? "No data found";
    window.postMessage({ type: "SmartContractAddress", data }, "*");
  });
}

function handleRequestChainId() {
  (
    browser.runtime.sendMessage({ action: "DeliverChainId" }) as Promise<
      Partial<MessageResponse>
    >
  ).then((response) => {
    const data = response?.data ?? "No data found";
    window.postMessage({ type: "ChainId", data }, "*");
  });
}

function handleRequestToAddress() {
  (
    browser.runtime.sendMessage({ action: "DeliverToAddress" }) as Promise<
      Partial<MessageResponse>
    >
  ).then((response) => {
    const data = response?.data ?? "No data found";
    window.postMessage({ type: "ToAddress", data }, "*");
  });
}

function handleRequestAmount() {
  (
    browser.runtime.sendMessage({ action: "DeliverAmount" }) as Promise<
      Partial<MessageResponse>
    >
  ).then((response) => {
    const data = response?.data ?? "No data found";
    window.postMessage({ type: "Amount", data }, "*");
  });
}

function handleUserExportHashChainToExtension(
  data: CustomMessageEventData["data"]
) {
  (
    browser.runtime.sendMessage({
      action: "DeliverUserExportHashChainToExtension",
      data,
    }) as Promise<Partial<MessageResponse>>
  ).then((response) => {
    const status = response?.status ?? "error";
    const message = response?.message ?? "Operation failed";
    window.postMessage(
      { type: "UserExportHashChainToExtension", data: { status, message } },
      "*"
    );
  });
}
