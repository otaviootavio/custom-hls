import { createRoot } from "react-dom/client";
import browser, { Runtime } from "webextension-polyfill";
import "./style.css";

interface ResponseMessage {
  status?: string;
  data?: any;
  error?: string;
}

interface WebpageMessage {
  type: string;
  data?: any;
}

interface BackgroundMessage {
  action: string;
  data?: any;
  origin?: string;
}

// React component for the content script indicator
const ContentScriptIndicator = () => (
  <div className="fixed bottom-4 left-4 text-lg text-black bg-amber-400 rounded-md px-4 py-2 shadow-lg z-50">
    Content script <span className="font-semibold">loaded</span>
  </div>
);

// Initialize React
const init = () => {
  const root = document.createElement("div");
  root.id = "__root";
  document.body.appendChild(root);

  const container = document.getElementById("__root");
  if (!container) throw new Error("Can't find Content root element");

  const reactRoot = createRoot(container);
  reactRoot.render(<ContentScriptIndicator />);
};

// Response type mapping
const responseTypeMap: Record<string, string> = {
  "Deliver_h(100)": "Recover_h(100)",
  DeliverHashchain: "HashChain",
  DeliverFullHashchain: "fullHashChain",
  DeliverSecretLength: "SecretLength",
  DeliverSyncLastHashSendIndex: "SyncLastHashSendIndex",
  DeliverOpenChannel: "OpenChannel",
  DeliverSmartContractAddress: "SmartContractAddress",
  DeliverChainId: "ChainId",
  DeliverToAddress: "ToAddress",
  DeliverAmount: "Amount",
  DeliverUserExportHashChainToExtension: "UserExportHashChainToExtension",
};

// Message listener
function handleMessage(event: MessageEvent<WebpageMessage>): void {
  if (!event.data?.type) {
    console.error("Invalid message format:", event.data);
    return;
  }

  const { type, data } = event.data;

  switch (type) {
    case "Send_h(100)":
      browser.runtime.sendMessage({
        action: "Deliver_h(100)",
        origin: "content-script",
      } as BackgroundMessage);
      break;
    case "RequestHashChain":
      browser.runtime.sendMessage({
        action: "DeliverHashchain",
        origin: "content-script",
      } as BackgroundMessage);
      break;
    case "RequestFullHashChain":
      console.log("[Content Script] Received RequestFullHashChain message");
      browser.runtime
        .sendMessage({
          action: "DeliverFullHashchain",
          origin: "content-script",
        } as BackgroundMessage)
        .then((response: unknown) => {
          const typedResponse = response as ResponseMessage;
          console.log("[Content Script] Received background response:", {
            hasResponse: !!typedResponse,
            status: typedResponse?.status,
            hasData: !!typedResponse?.data,
            dataLength: Array.isArray(typedResponse?.data)
              ? typedResponse.data.length
              : "not an array",
          });

          if (typedResponse?.data) {
            window.postMessage(
              {
                type: responseTypeMap["DeliverFullHashchain"],
                data: typedResponse.data,
              } as WebpageMessage,
              "*"
            );
            console.log("[Content Script] Forwarded response to webpage");
          } else {
            console.error(
              "[Content Script] Invalid response from background:",
              typedResponse
            );
          }
        })
        .catch((error) => {
          console.error(
            "[Content Script] Error handling background response:",
            error
          );
        });
      break;

    case "RequestSecretLength":
      browser.runtime.sendMessage({
        action: "DeliverSecretLength",
        origin: "content-script",
      } as BackgroundMessage);
      break;
    case "RequestSyncLastHashSendIndex":
      if (data)
        browser.runtime.sendMessage({
          action: "DeliverSyncLastHashSendIndex",
          data,
          origin: "content-script",
        } as BackgroundMessage);
      break;
    case "RequestOpenChannel":
      if (data)
        browser.runtime.sendMessage({
          action: "DeliverOpenChannel",
          data,
          origin: "content-script",
        } as BackgroundMessage);
      break;
    case "RequestSmartContractAddress":
      browser.runtime.sendMessage({
        action: "DeliverSmartContractAddress",
        origin: "content-script",
      } as BackgroundMessage);
      break;
    case "RequestChainId":
      browser.runtime.sendMessage({
        action: "DeliverChainId",
        origin: "content-script",
      } as BackgroundMessage);
      break;
    case "RequestToAddress":
      browser.runtime.sendMessage({
        action: "DeliverToAddress",
        origin: "content-script",
      } as BackgroundMessage);
      break;
    case "RequestAmount":
      browser.runtime.sendMessage({
        action: "DeliverAmount",
        origin: "content-script",
      } as BackgroundMessage);
      break;
    case "RequestUserExportHashChainToExtension":
      if (data)
        browser.runtime.sendMessage({
          action: "DeliverUserExportHashChainToExtension",
          data,
          origin: "content-script",
        } as BackgroundMessage);
      break;
    default:
      console.error("Unknown message type:", type);
  }
}

// Listen for messages from background script
browser.runtime.onMessage.addListener(
  (
    message: unknown,
    sender: Runtime.MessageSender,
    sendResponse: (response?: any) => void
  ): undefined => {
    const msg = message as BackgroundMessage;
    console.log("[Content Script] Received message from background:", msg);

    if (msg?.action && responseTypeMap[msg.action]) {
      console.log("[Content Script] Forwarding message to webpage:", {
        type: responseTypeMap[msg.action],
        data: msg.data,
      });

      window.postMessage(
        {
          type: responseTypeMap[msg.action],
          data: msg.data,
        },
        "*"
      );
    }
    return undefined;
  }
);

// Initialize content script
try {
  init();
  window.addEventListener("message", handleMessage);
  console.log("Content script initialized successfully");
} catch (error) {
  console.error("Content script initialization failed:", error);
}
