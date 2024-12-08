import { stringToBytes, toHex } from "viem";
import { HashRepository } from "./repositories/HashRepository";
import { createHashChainFromSecretAndMaxIndex } from "./utils/UsefulFunctions";
import { HashObject } from "./utils/interfaces";
import browser from "webextension-polyfill";

const hashRepo = new HashRepository();

interface ResponseMessage {
  status?: string;
  message?: string;
  data?: any;
  error?: string;
}

console.log("Service worker script loaded");

browser.runtime.onMessage.addListener(
  async (
    message: any,
    _sender,
    sendResponse: (response: ResponseMessage) => void
  ) => {
    console.log("Received message:", message);

    try {
      switch (message.action) {
        case "makeHashChain":
          return await handleMakeHashChain(message.data);
        case "Deliver_h(100)":
          return await handleDeliverH100();
        case "DeliverHashchain":
          return await handleDeliverHashchain();
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
          sendResponse({ error: "Unknown action" });
          return false; // Retorna false explicitamente para erros
      }
    } catch (error) {
      console.error("Error handling message:", error);
      sendResponse({
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return true; // Indica resposta assíncrona
  }
);

async function handleMakeHashChain(data: {
  secret: string;
  length: number;
  key: string;
}) {
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

async function handleDeliverH100() {
  try {
    console.log("Executing handleDeliverH100...");
    const selectedHashChain = await hashRepo.getSelectedHashChain();
    if (selectedHashChain) {
      console.log("Hashchain:", selectedHashChain.tail);
      return { data: selectedHashChain.tail };
    } else {
      return { data: "No hash chain selected" }; // Erro de retorno
    }
  } catch (error) {
    return { error: "Failed to retrieve hash chain" }; // Erro de retorno
  }
}

async function handleDeliverHashchain() {
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

async function handleDeliverFullHashchain() {
  console.log("Executing handleDeliverFullHashchain...");
  try {
    const selectedHashChain = await hashRepo.getSelectedHashChain();

    if (selectedHashChain) {
      console.log("Hashchain:", selectedHashChain.hashchain);
      return { data: selectedHashChain.hashchain };
    } else {
      return { error: "No hash chain selected" };
    }
  } catch (error) {
    return { error: "Failed to retrieve hash chain" };
  }
}

async function handleDeliverSecretLength() {
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
}) {
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
}) {
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
    return { error: "Failed to open channel" }; // Erro de retorno
  }
}

async function handleDeliverSmartContractAddress() {
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
    return { error: "Failed to retrieve smart contract address" }; // Erro de retorno
  }
}

async function handleDeliverChainId() {
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
    return { error: "Failed to retrieve chain ID" }; // Erro de retorno
  }
}

async function handleDeliverToAddress() {
  try {
    console.log("Executing handleDeliverToAddress...");
    const selectedHashChain = await hashRepo.getSelectedHashChain();
    if (selectedHashChain) {
      console.log("Hashchain:", selectedHashChain.address_to);
      return { data: selectedHashChain.address_to };
    } else {
      return { data: "No hash chain selected" }; // Erro de retorno
    }
  } catch (error) {
    return { error: "Failed to retrieve to address" }; // Erro de retorno
  }
}

async function handleDeliverAmount() {
  try {
    console.log("Executing handleDeliverAmount...");
    const selectedHashChain = await hashRepo.getSelectedHashChain();
    if (selectedHashChain) {
      console.log("Hashchain:", selectedHashChain.amountEthInWei.toString());
      return { data: selectedHashChain.amountEthInWei.toString() };
    } else {
      return { data: "No hash chain selected" }; // Erro de retorno
    }
  } catch (error) {
    return { error: "Failed to retrieve amount" }; // Erro de retorno
  }
}

async function handleDeliverUserExportHashChainToExtension(data: {
  lastHashExpended: `0x${string}`;
  indexOfLastHashExended: number;
  hashChainLength: number;
  chainId: number;
  smartContractAddress: `0x${string}`;
}) {
  console.log(
    "Executing handleDeliverUserExportHashChainToExtension with data:",
    data
  );
  try {
    await hashRepo.importHashChainFromItemOfIndex(
      data.lastHashExpended,
      data.indexOfLastHashExended,
      data.hashChainLength,
      data.chainId,
      data.smartContractAddress
    );
    console.log("Hashchain:", hashRepo.getSelectedHashChain());
    return { status: "success", message: "Hash chain exported successfully" };
  } catch (error) {
    return { error: "Failed to export hash chain" }; // Erro de retorno
  }
}
