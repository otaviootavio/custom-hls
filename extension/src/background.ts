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
          // Retorna o resultado diretamente
          return await handleDeliverSecretLength();
        case "DeliverSyncLastHashSendIndex":
          await handleSyncLastHashSendIndex(message.data, sendResponse);
          break;
        case "DeliverOpenChannel":
          await handleOpenChannel(message.data, sendResponse);
          break;
        case "DeliverSmartContractAddress":
          await handleDeliverSmartContractAddress(sendResponse);
          break;
        case "DeliverChainId":
          await handleDeliverChainId(sendResponse);
          break;
        case "DeliverToAddress":
          await handleDeliverToAddress(sendResponse);
          break;
        case "DeliverAmount":
          await handleDeliverAmount(sendResponse);
          break;
        case "DeliverUserExportHashChainToExtension":
          await handleDeliverUserExportHashChainToExtension(
            message.data,
            sendResponse
          );
          break;
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

async function handleMakeHashChain(
  data: { secret: string; length: number; key: string },
  sendResponse: (response: ResponseMessage) => void
) {
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
    sendResponse({ status: "success", message: "Hash created and stored" });
    console.log("Hash chain stored successfully");
  } catch (error) {
    sendResponse({
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

async function handleDeliverH100(
  sendResponse: (response: ResponseMessage) => void
) {
  try {
    const selectedHashChain = await hashRepo.getSelectedHashChain();
    if (selectedHashChain) {
      sendResponse({ data: selectedHashChain.tail });
    } else {
      sendResponse({ data: "No hash chain selected" });
    }
  } catch (error) {
    sendResponse({ error: "Failed to retrieve hash chain" });
  }
}

async function handleDeliverHashchain(
  sendResponse: (response: ResponseMessage) => void
) {
  try {
    const result = await hashRepo.popLastHashFromSelected();
    if (result) {
      sendResponse({ data: { hash: result.hash, index: result.index } });
    } else {
      sendResponse({ data: "No more hashes are stored" });
    }
  } catch (error) {
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
    sendResponse({ error: "Failed to retrieve hash chain" });
  }
}

async function handleDeliverSecretLength() {
  try {
    console.log("Executing handleDeliverSecretLength...");

    // Recuperar o hash chain selecionado
    const selectedHashChain = await hashRepo.getSelectedHashChain();

    // Logar o objeto retornado
    console.log("Selected hash chain:", selectedHashChain);

    if (selectedHashChain) {
      // Logar os dados antes de retorná-los
      const responseData = {
        secret: selectedHashChain.secret,
        length: selectedHashChain.length,
        tail: selectedHashChain.tail,
        lastHashSendIndex: selectedHashChain.indexOfLastHashSend,
      };
      console.log("Response data being returned:", responseData);

      // Retornar os dados
      return { data: responseData };
    } else {
      // Logar quando nenhum hash chain está selecionado
      console.warn("No hash chain selected.");
      return { error: "No hash chain selected" };
    }
  } catch (error) {
    // Logar o erro ocorrido
    console.error("Error in handleDeliverSecretLength:", error);
    return { error: "Failed to retrieve hash chain" };
  }
}

async function handleSyncLastHashSendIndex(
  data: { lastHashSendIndex: number },
  sendResponse: (response: ResponseMessage) => void
) {
  try {
    const selectedHashChain = await hashRepo.syncLastHashSendFromSelected(
      data.lastHashSendIndex
    );
    if (selectedHashChain) {
      sendResponse({ data: selectedHashChain.indexOfLastHashSend });
    } else {
      sendResponse({ error: "No hash chain selected" });
    }
  } catch (error) {
    sendResponse({ error: "Failed to sync hash chain index" });
  }
}

async function handleOpenChannel(
  data: {
    address_contract: string;
    address_to: string;
    amountEthInWei: string;
    chainId: number;
  },
  sendResponse: (response: ResponseMessage) => void
) {
  try {
    const selectedHashChain = await hashRepo.getSelectedHashChain();
    if (selectedHashChain) {
      const updatedHashChain: HashObject = {
        ...selectedHashChain,
        chainId: data.chainId,
        address_to: data.address_to,
        address_contract: data.address_contract,
        amountEthInWei: BigInt(data.amountEthInWei),
      };
      await hashRepo.updateHashChain(updatedHashChain);
      sendResponse({
        status: "success",
        message: "Channel opened successfully",
      });
    } else {
      sendResponse({ error: "No hash chain selected" });
    }
  } catch (error) {
    sendResponse({ error: "Failed to open channel" });
  }
}

async function handleDeliverSmartContractAddress(
  sendResponse: (response: ResponseMessage) => void
) {
  try {
    const selectedHashChain = await hashRepo.getSelectedHashChain();
    if (selectedHashChain) {
      sendResponse({ data: selectedHashChain.address_contract });
    } else {
      sendResponse({ data: "No hash chain selected" });
    }
  } catch (error) {
    sendResponse({ error: "Failed to retrieve smart contract address" });
  }
}

async function handleDeliverChainId(
  sendResponse: (response: ResponseMessage) => void
) {
  try {
    const selectedHashChain = await hashRepo.getSelectedHashChain();
    if (selectedHashChain) {
      sendResponse({ data: selectedHashChain.chainId });
    } else {
      sendResponse({ data: "No hash chain selected" });
    }
  } catch (error) {
    sendResponse({ error: "Failed to retrieve chain ID" });
  }
}

async function handleDeliverToAddress(
  sendResponse: (response: ResponseMessage) => void
) {
  try {
    const selectedHashChain = await hashRepo.getSelectedHashChain();
    if (selectedHashChain) {
      sendResponse({ data: selectedHashChain.address_to });
    } else {
      sendResponse({ data: "No hash chain selected" });
    }
  } catch (error) {
    sendResponse({ error: "Failed to retrieve to address" });
  }
}

async function handleDeliverAmount(
  sendResponse: (response: ResponseMessage) => void
) {
  try {
    const selectedHashChain = await hashRepo.getSelectedHashChain();
    if (selectedHashChain) {
      sendResponse({ data: selectedHashChain.amountEthInWei.toString() });
    } else {
      sendResponse({ data: "No hash chain selected" });
    }
  } catch (error) {
    sendResponse({ error: "Failed to retrieve amount" });
  }
}

async function handleDeliverUserExportHashChainToExtension(
  data: {
    lastHashExpended: `0x${string}`;
    indexOfLastHashExended: number;
    hashChainLength: number;
    chainId: number;
    smartContractAddress: `0x${string}`;
  },
  sendResponse: (response: ResponseMessage) => void
) {
  try {
    await hashRepo.importHashChainFromItemOfIndex(
      data.lastHashExpended,
      data.indexOfLastHashExended,
      data.hashChainLength,
      data.chainId,
      data.smartContractAddress
    );

    sendResponse({
      status: "success",
      message: "Hash chain exported successfully",
    });
  } catch (error) {
    sendResponse({ error: "Failed to export hash chain" });
  }
}
