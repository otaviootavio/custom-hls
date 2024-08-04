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

interface StorageData {
  selectedKey?: string;
  hashChains?: HashObject[];
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

  const start_chain = createHashChain(secret, length);
  console.log("Hash chain created", start_chain);

  const hashChainData: HashObject = {
    address_contract: "",
    address_to: "",
    length: length,
    hashchain: start_chain,
    isValid: false,
    key: key,
    secret: secret,
    tail: start_chain[start_chain.length - 1],
  };

  try {
    await hashRepo.addHashChain(hashChainData);
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
  const { selectedKey } = (await chrome.storage.local.get(
    "selectedKey"
  )) as StorageData;
  const { hashChains = [] } = (await chrome.storage.local.get({
    hashChains: [],
  })) as StorageData;
  const hashObject = hashChains.find(
    (obj: HashObject) => obj.key === selectedKey
  );
  const hashTail = hashObject ? hashObject.tail : "";

  if (hashTail !== "") {
    sendResponse({ data: hashTail });
    console.log("Hash sent,", hashTail);
  } else {
    sendResponse({ data: "No more hashes are stored" });
  }
}

async function handleDeliverHashchain(
  sendResponse: (response: ResponseMessage) => void
) {
  console.log("Handling DeliverHashchain action");
  const { selectedKey } = await chrome.storage.local.get("selectedKey");
  const { hashChains = [] } = await chrome.storage.local.get({
    hashChains: [],
  });
  const hashObjectIndex = hashChains.findIndex(
    (obj: HashObject) => obj.key === selectedKey
  );

  if (hashObjectIndex === -1) {
    sendResponse({ error: "Hash object not found" });
    return;
  }

  const hashObject = { ...hashChains[hashObjectIndex] };
  console.log(hashObject);

  if (hashObject.hashchain.length > 0) {
    const newHashchain = [...hashObject.hashchain];
    const hash = newHashchain.pop();
    const lastIndex = newHashchain.length;
    console.log("Transmission started", hash);

    hashChains[hashObjectIndex] = { ...hashObject, hashchain: newHashchain };
    await chrome.storage.local.set({ hashChains });
    sendResponse({ data: { hash, lastIndex } });
  } else {
    console.log("No more hashes are stored");
    sendResponse({ data: "No more hashes are stored" });
  }
}

async function handleDeliverFullHashchain(
  sendResponse: (response: ResponseMessage) => void
) {
  const { selectedKey } = await chrome.storage.local.get("selectedKey");
  const { hashChains = [] } = await chrome.storage.local.get({
    hashChains: [],
  });
  const hashObject = hashChains.find(
    (obj: HashObject) => obj.key === selectedKey
  );

  if (hashObject) {
    sendResponse({ data: hashObject.hashchain });
  } else {
    sendResponse({ error: "Hash object not found" });
  }
}

async function handleDeliverSecretLength(
  sendResponse: (response: ResponseMessage) => void
) {
  const { selectedKey } = await chrome.storage.local.get("selectedKey");
  const { hashChains = [] } = await chrome.storage.local.get({
    hashChains: [],
  });
  const hashObject = hashChains.find(
    (obj: HashObject) => obj.key === selectedKey
  );

  if (hashObject) {
    sendResponse({
      data: { secret: hashObject.secret, length: hashObject.length },
    });
  } else {
    sendResponse({ error: "Hash object not found" });
  }
}

chrome.runtime.onStartup.addListener(() => {
  console.log("Service worker startup");
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("Service worker installed");
});
