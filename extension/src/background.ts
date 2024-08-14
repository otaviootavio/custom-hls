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
          case "DeliverHashchain":
            await handleDeliverHashchain(sendResponse);
            break;
          case "DeliverFullHashchain":
            await handleDeliverFullHashchain(sendResponse);
            break;
          case "DeliverSecretLength":
            await handleDeliverSecretLength(sendResponse);
            break;
          case "UpdateLastNotUsedHashIndex":
            await handleUpdateLastNotUsedHashIndex(message.data, sendResponse);
            break;
          case "AddBlockchainDataFromApp":
            await handleAddBlockchainDataFromApp(message.data, sendResponse);
            break;
          case "DeliverTailandOriginalLength":
            await handleDeliverTailAndOriginalLength(sendResponse);
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
    originalLength: length,
    lastNotUsedHashIndex: length,
    hashchain: start_chain.map((hash) => toHex(hash)),
    isValid: false,
    key: key,
    secret: secret,
    tail: toHex(start_chain[start_chain.length - 1]),
    value: 0,
    blockchainId: 0,
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

async function handleDeliverTailAndOriginalLength(
  sendResponse: (response: ResponseMessage) => void
) {
  console.log("Handling tail and original length action");
  try {
    const selectedHashChain = await hashRepo.getSelectedHashChain();
    if (selectedHashChain) {
      sendResponse({
        data: {
          tail: selectedHashChain.tail,
          originalLength: selectedHashChain.originalLength,
        },
      });
      console.log(
        "Tail and original length sent:",
        selectedHashChain.tail,
        selectedHashChain.originalLength
      );
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
      sendResponse({
        data: {
          hashchain: selectedHashChain.hashchain,
          originalLength: selectedHashChain.originalLength,
          lastNotUsedHashIndex: selectedHashChain.lastNotUsedHashIndex,
        },
      });
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
          length: selectedHashChain.originalLength,
          lastNotUsedHashIndex: selectedHashChain.lastNotUsedHashIndex,
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

async function handleAddBlockchainDataFromApp(
  data: {
    address_contract: string;
    address_to: string;
    value: number;
    blockchainId: number;
  },
  sendResponse: (response: ResponseMessage) => void
) {
  console.log("Handling ChangeContractAddress action");
  const { address_contract, address_to, value, blockchainId } = data;

  try {
    await hashRepo.addBlockchainDataFromApp(
      address_contract,
      address_to,
      value,
      blockchainId
    );
    sendResponse({ status: "success", message: "Blockchain data added" });
    console.log("Blockchain data added");
  } catch (error) {
    sendResponse({
      status: "error",
      message: error instanceof Error ? error.message : String(error),
    });
    console.error("Error changing blockchain contract information:", error);
  }
}

async function handleUpdateLastNotUsedHashIndex(
  data: { index: number },
  sendResponse: (response: ResponseMessage) => void
) {
  console.log("Handling UpdateLastNotUsedHashIndex action");
  const { index } = data;

  try {
    await hashRepo.updateLastNotUsedHashIndex(index);
    sendResponse({
      status: "success",
      message: "LastNotUsedHashIndex updated",
    });
    console.log("LastNotUsedHashIndex updated");
  } catch (error) {
    sendResponse({
      status: "error",
      message: error instanceof Error ? error.message : String(error),
    });
    console.error("Error updating LastNotUsedHashIndex:", error);
  }
}

chrome.runtime.onStartup.addListener(() => {
  console.log("Service worker startup");
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("Service worker installed");
});
