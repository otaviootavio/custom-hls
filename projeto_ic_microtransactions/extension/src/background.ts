import { createHashChain, addHash } from "./utils/UsefulFunctions";
import { HashObject } from "./utils/interfaces";

console.log("Background script loaded"); // Log when the background script is loaded

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log("Received message:", message); // Log the received message

  if (message.action === "makeHashChain") {
    console.log("Handling makeHashChain action"); // Log action handling
    const {
      secret,
      length,
      key,
    }: { secret: string; length: number; key: string } = message.data;

    const start_chain = createHashChain(secret, length);
    console.log("Hash chain created", start_chain); // Log the created hash chain

    const hashChainData: HashObject = {
      address_contract: "",
      address_to: "",
      length: length,
      hashchain: start_chain,
      isValid: false,
      key: key,
      tail: start_chain[start_chain.length - 1], // Set tail on creation
    };

    addHash(hashChainData, key, sendResponse);
    console.log("Hash created and stored");
  } else if (message.action === "Deliver_h(100)") {
    console.log("Handling Deliver_h(100) action"); // Log action handling
    chrome.storage.local.get("selectedKey", (result) => {
      const hash_key: string = result.selectedKey;
      chrome.storage.local.get({ hashChains: [] }, (result) => {
        const hashChains: HashObject[] = result.hashChains;
        const hashObject = hashChains.find((obj) => obj.key === hash_key);
        const hashTail = hashObject ? hashObject.tail : "";
        if (hashTail !== "") {
          sendResponse({ data: hashTail });
          console.log("Hash sent,", hashTail);
        } else {
          sendResponse({
            data: "No more hashs are stored",
          });
        }
      });
    });
    return true; // Keeps the message channel open for async response
  } else if (message.action === "DeliverHashchain") {
    console.log("Handling DeliverHashchain action"); // Log action handling
    chrome.storage.local.get("selectedKey", (result) => {
      const hash_key: string = result.selectedKey;
      chrome.storage.local.get({ hashChains: [] }, (result) => {
        const hashChains: HashObject[] = result.hashChains;
        const hashObjectIndex = hashChains.findIndex(
          (obj) => obj.key === hash_key
        );

        const hashObject = hashChains[hashObjectIndex];
        console.log(hashObject);

        if (hashObject && hashObject.hashchain.length > 0) {
          const hash = hashObject.hashchain.pop();
          const lastIndex = hashObject.hashchain.length;
          console.log("Transmission started", hash);

          // Update the hashObject in the hashChains array without modifying tail
          hashChains[hashObjectIndex] = hashObject;

          chrome.storage.local.set({ hashChains: hashChains }, () => {
            sendResponse({ data: hash, index: lastIndex });
          });
        } else {
          console.log("Deu problema");
          sendResponse({
            data: "No more hashs are stored",
          });
        }
      });
    });
    return true; // Keeps the message channel open for async response
  }
});
