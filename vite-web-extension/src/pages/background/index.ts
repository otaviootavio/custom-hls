import { stringToBytes, toHex } from "viem";
import browser from "webextension-polyfill";
import { HashRepository } from "../popup/repositories/HashRepository";
import { createHashChainFromSecretAndMaxIndex } from "../popup/utils/UsefulFunctions";
import { HashObject } from "../popup/utils/interfaces";

const hashRepo = new HashRepository();

interface ResponseMessage {
  status?: string;
  message?: string;
  data?: any;
  error?: string;
}

console.log("Background script loaded");

browser.runtime.onMessage.addListener(
  async (message: any, sender, sendResponse): Promise<ResponseMessage> => {
    console.log("Received message:", message);
    let response: ResponseMessage;

    try {
      switch (message.action) {
        case "makeHashChain":
          return await handleMakeHashChain(message.data);
        case "Deliver_h(100)":
          return await handleDeliverH100();
        case "DeliverFullHashchain":
          response = await handleDeliverFullHashchain();
          console.log("[Background] Sending response:", response);
          return response;
        case "DeliverFullHashchain":
          return await handleDeliverFullHashchain();
        case "DeliverSecretLength":
          return await handleDeliverSecretLength();
        case "DeliverSyncLastHashSendIndex":
          return await handleSyncLastHashSendIndex(message.data);
        case "DeliverOpenChannel":
          return await handleOpenChannel(message.data);
        case "DeliverSmartContractAddress":
          return await handleDeliverSmartContractAddress();
        case "DeliverChainId":
          return await handleDeliverChainId();
        case "DeliverToAddress":
          return await handleDeliverToAddress();
        case "DeliverAmount":
          return await handleDeliverAmount();
        case "DeliverUserExportHashChainToExtension":
          return await handleDeliverUserExportHashChainToExtension(
            message.data
          );
        default:
          console.error("Unknown action:", message.action);
          return { error: "Unknown action" };
      }
    } catch (error) {
      console.error("Error handling message:", error);
      return { error: error instanceof Error ? error.message : String(error) };
    }
  }
);

async function handleMakeHashChain(data: {
  secret: string;
  length: number;
  key: string;
}): Promise<ResponseMessage> {
  console.log("Handling makeHashChain action with data:", data);
  const { secret, length, key } = data;

  const start_chain = createHashChainFromSecretAndMaxIndex(
    stringToBytes(secret, { size: 32 }),
    length - 1
  );

  const hashChainData: HashObject = {
    chainId: 0,
    address_contract: "",
    address_to: "",
    amountEthInWei: 0n,
    length,
    hashchain: start_chain.map((hash) => toHex(hash)),
    isValid: false,
    key,
    secret,
    tail: toHex(start_chain[start_chain.length - 1]),
    indexOfLastHashSend: length,
  };

  try {
    await hashRepo.addHashChain(hashChainData);
    await hashRepo.setSelectedKey(key);
    return { status: "success", message: "Hash created and stored" };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}

async function handleDeliverH100(): Promise<ResponseMessage> {
  try {
    console.log("Executing handleDeliverH100...");
    const selectedHashChain = await hashRepo.getSelectedHashChain();
    if (selectedHashChain) {
      console.log("Hashchain:", selectedHashChain.tail);
      return { data: selectedHashChain.tail };
    } else {
      return { data: "No hash chain selected" };
    }
  } catch (error) {
    return { error: "Failed to retrieve hash chain" };
  }
}

async function handleDeliverHashchain(): Promise<ResponseMessage> {
  console.log("Executing handleDeliverHashchain...");
  try {
    const result = await hashRepo.popLastHashFromSelected();
    if (result) {
      console.log("Hash:", result.hash, "Index:", result.index);
      return { data: { hash: result.hash, index: result.index } };
    } else {
      return { data: "No more hashes are stored" };
    }
  } catch (error) {
    return { error: "Failed to retrieve or update hash chain" };
  }
}

async function handleDeliverFullHashchain(): Promise<ResponseMessage> {
  console.log("[Background] Executing handleDeliverFullHashchain...");
  try {
    const selectedHashChain = await hashRepo.getSelectedHashChain();
    if (selectedHashChain) {
      const response = {
        status: "success",
        data: selectedHashChain.hashchain,
      };
      console.log("[Background] Sending hash chain response:", {
        status: response.status,
        dataLength: response.data.length,
        sampleData: response.data.slice(0, 2),
      });
      return response;
    } else {
      console.log("[Background] No hash chain selected");
      return { error: "No hash chain selected" };
    }
  } catch (error) {
    console.error("[Background] Error retrieving hash chain:", error);
    return { error: "Failed to retrieve hash chain" };
  }
}

async function handleDeliverSecretLength(): Promise<ResponseMessage> {
  try {
    console.log("Executing handleDeliverSecretLength...");
    const selectedHashChain = await hashRepo.getSelectedHashChain();
    console.log("Selected hash chain:", selectedHashChain);

    if (selectedHashChain) {
      const responseData = {
        secret: selectedHashChain.secret,
        length: selectedHashChain.length,
        tail: selectedHashChain.tail,
        lastHashSendIndex: selectedHashChain.indexOfLastHashSend,
      };
      console.log("Response data being returned:", responseData);
      return { data: responseData };
    } else {
      console.warn("No hash chain selected.");
      return { error: "No hash chain selected" };
    }
  } catch (error) {
    console.error("Error in handleDeliverSecretLength:", error);
    return { error: "Failed to retrieve hash chain" };
  }
}

async function handleSyncLastHashSendIndex(data: {
  lastHashSendIndex: number;
}): Promise<ResponseMessage> {
  try {
    console.log("Executing handleSyncLastHashSendIndex with data:", data);
    const selectedHashChain = await hashRepo.syncLastHashSendFromSelected(
      data.lastHashSendIndex
    );
    if (selectedHashChain) {
      console.log("Hashchain:", selectedHashChain.indexOfLastHashSend);
      return { data: selectedHashChain.indexOfLastHashSend };
    } else {
      return { error: "No hash chain selected" };
    }
  } catch (error) {
    return { error: "Failed to sync hash chain index" };
  }
}

async function handleOpenChannel(data: {
  address_contract: string;
  address_to: string;
  amountEthInWei: string;
  chainId: number;
}): Promise<ResponseMessage> {
  try {
    console.log("Executing handleOpenChannel with data:", data);
    const selectedHashChain = await hashRepo.getSelectedHashChain();
    if (selectedHashChain) {
      const updatedHashChain: HashObject = {
        ...selectedHashChain,
        chainId: data.chainId,
        address_to: data.address_to,
        address_contract: data.address_contract,
        amountEthInWei: BigInt(data.amountEthInWei),
      };
      console.log("Hashchain:", updatedHashChain);
      await hashRepo.updateHashChain(updatedHashChain);
      return { status: "success", message: "Channel opened successfully" };
    } else {
      return { error: "No hash chain selected" };
    }
  } catch (error) {
    return { error: "Failed to open channel" };
  }
}

async function handleDeliverSmartContractAddress(): Promise<ResponseMessage> {
  try {
    console.log("Executing handleDeliverSmartContractAddress...");
    const selectedHashChain = await hashRepo.getSelectedHashChain();
    if (selectedHashChain) {
      console.log("Hashchain:", selectedHashChain.address_contract);
      return { data: selectedHashChain.address_contract };
    } else {
      return { data: "No hash chain selected" };
    }
  } catch (error) {
    return { error: "Failed to retrieve smart contract address" };
  }
}

async function handleDeliverChainId(): Promise<ResponseMessage> {
  try {
    console.log("Executing handleDeliverChainId...");
    const selectedHashChain = await hashRepo.getSelectedHashChain();
    if (selectedHashChain) {
      console.log("Hashchain:", selectedHashChain.chainId);
      return { data: selectedHashChain.chainId };
    } else {
      return { data: "No hash chain selected" };
    }
  } catch (error) {
    return { error: "Failed to retrieve chain ID" };
  }
}

async function handleDeliverToAddress(): Promise<ResponseMessage> {
  try {
    console.log("Executing handleDeliverToAddress...");
    const selectedHashChain = await hashRepo.getSelectedHashChain();
    if (selectedHashChain) {
      console.log("Hashchain:", selectedHashChain.address_to);
      return { data: selectedHashChain.address_to };
    } else {
      return { data: "No hash chain selected" };
    }
  } catch (error) {
    return { error: "Failed to retrieve to address" };
  }
}

async function handleDeliverAmount(): Promise<ResponseMessage> {
  try {
    console.log("Executing handleDeliverAmount...");
    const selectedHashChain = await hashRepo.getSelectedHashChain();
    if (selectedHashChain) {
      console.log("Hashchain:", selectedHashChain.amountEthInWei.toString());
      return { data: selectedHashChain.amountEthInWei.toString() };
    } else {
      return { data: "No hash chain selected" };
    }
  } catch (error) {
    return { error: "Failed to retrieve amount" };
  }
}

async function handleDeliverUserExportHashChainToExtension(data: {
  lastHashExpended: `0x${string}`;
  indexOfLastHashExended: number;
  hashChainLength: number;
  chainId: number;
  smartContractAddress: `0x${string}`;
}): Promise<ResponseMessage> {
  try {
    console.log(
      "Executing handleDeliverUserExportHashChainToExtension with data:",
      data
    );
    await hashRepo.importHashChainFromItemOfIndex(
      data.lastHashExpended,
      data.indexOfLastHashExended,
      data.hashChainLength,
      data.chainId,
      data.smartContractAddress
    );
    console.log("Hashchain:", await hashRepo.getSelectedHashChain());
    return { status: "success", message: "Hash chain exported successfully" };
  } catch (error) {
    return { error: "Failed to export hash chain" };
  }
}
