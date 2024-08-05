import { stringToBytes, toHex } from "viem";
import { HashRepository } from "./repositories/HashRepository";
import { HashObject } from "./utils/interfaces";
import { createHashChain } from "./utils/UsefulFunctions";

const hashRepo = new HashRepository();

interface ResponseMessage {
  status?: string;
  message?: string;
  data?: any;
  error?: string;
}

console.log("Service worker script loaded");

chrome.runtime.onMessage.addListener(
  (
    message: any,
    _sender,
    sendResponse: (response: ResponseMessage) => void
  ) => {
    console.log("Received message:", message);

    const handleMessage = async () => {
      try {
        switch (message.action) {
          case "makeHashChain":
            await handleMakeHashChain(message.data, sendResponse);
            break;
          case "Deliver_h(100)":
            await handleDeliverH100(sendResponse);
            break;
          case "DeliverHashchain":
            await handleDeliverHashchain(sendResponse);
            break;
          case "DeliverFullHashchain":
            await handleDeliverFullHashchain(sendResponse);
            break;
          case "DeliverSecretLength":
            await handleDeliverSecretLength(sendResponse);
            break;
          default:
            sendResponse({ error: "Unknown action" });
        }
      } catch (error) {
        console.error("Error in message handler:", error);
        sendResponse({
          error: error instanceof Error ? error.message : String(error),
        });
      }
    };

    handleMessage();
    return true; // Indicates async response
  }
);

async function handleMakeHashChain(
  data: { secret: string; length: number; key: string },
  sendResponse: (response: ResponseMessage) => void
) {
  console.log("Handling makeHashChain action");
  const { secret, length, key } = data;

  const start_chain = createHashChain(stringToBytes(secret), length);
  console.log("Hash chain created", start_chain);

  const hashChainData: HashObject = {
    address_contract: "",
    address_to: "",
    length: length,
    hashchain: start_chain.map((hash) => toHex(hash)),
    isValid: false,
    key: key,
    secret: secret,
    tail: toHex(start_chain[start_chain.length - 1]),
  };

  try {
    await hashRepo.addHashChain(hashChainData);
    await hashRepo.setSelectedKey(key);
    sendResponse({ status: "success", message: "Hash created and stored" });
    console.log("Hash created and stored");
  } catch (error) {
    sendResponse({
      status: "error",
      message: error instanceof Error ? error.message : String(error),
    });
    console.error("Error storing hash:", error);
  }
}

async function handleDeliverH100(
  sendResponse: (response: ResponseMessage) => void
) {
  console.log("Handling Deliver_h(100) action");
  try {
    const selectedHashChain = await hashRepo.getSelectedHashChain();
    if (selectedHashChain) {
      sendResponse({ data: selectedHashChain.tail });
      console.log("Hash sent:", selectedHashChain.tail);
    } else {
      sendResponse({ data: "No hash chain selected" });
    }
  } catch (error) {
    console.error("Error in handleDeliverH100:", error);
    sendResponse({ error: "Failed to retrieve hash chain" });
  }
}

async function handleDeliverHashchain(
  sendResponse: (response: ResponseMessage) => void
) {
  console.log("Handling DeliverHashchain action");
  try {
    const result = await hashRepo.popLastHashFromSelected();
    if (result) {
      console.log("Transmission started", result.hash);
      sendResponse({ data: { hash: result.hash, index: result.index } });
    } else {
      console.log("No more hashes are stored");
      sendResponse({ data: "No more hashes are stored" });
    }
  } catch (error) {
    console.error("Error in handleDeliverHashchain:", error);
    sendResponse({ error: "Failed to retrieve or update hash chain" });
  }
}

async function handleDeliverFullHashchain(
  sendResponse: (response: ResponseMessage) => void
) {
  try {
    const selectedHashChain = await hashRepo.getSelectedHashChain();
    if (selectedHashChain) {
      sendResponse({ data: selectedHashChain.hashchain });
    } else {
      sendResponse({ error: "No hash chain selected" });
    }
  } catch (error) {
    console.error("Error in handleDeliverFullHashchain:", error);
    sendResponse({ error: "Failed to retrieve hash chain" });
  }
}

async function handleDeliverSecretLength(
  sendResponse: (response: ResponseMessage) => void
) {
  try {
    const selectedHashChain = await hashRepo.getSelectedHashChain();
    if (selectedHashChain) {
      sendResponse({
        data: {
          secret: selectedHashChain.secret,
          length: selectedHashChain.length,
          tail: selectedHashChain.tail,
        },
      });
    } else {
      sendResponse({ error: "No hash chain selected" });
    }
  } catch (error) {
    console.error("Error in handleDeliverSecretLength:", error);
    sendResponse({ error: "Failed to retrieve hash chain" });
  }
}

chrome.runtime.onStartup.addListener(() => {
  console.log("Service worker startup");
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("Service worker installed");
});
