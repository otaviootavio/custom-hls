import { HashchainRepository } from "./hashchainRepository";

const repository = new HashchainRepository();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type, payload } = message;

  const handleRequest = async () => {
    switch (type) {
      case "CREATE_HASHCHAIN":
        return repository.createHashchain(payload.vendorData, payload.secret);

      case "GET_HASHCHAIN":
        return repository.getHashchain(payload.hashchainId);

      case "SELECT_HASHCHAIN":
        return repository.selectHashchain(payload.hashchainId);

      case "GET_SELECTED_HASHCHAIN":
        return repository.getSelectedHashchain();

      case "GET_SECRET":
        return repository.getSecret(payload.hashchainId);

      case "GET_NEXT_HASH":
        return repository.getNextHash(payload.hashchainId);

      case "GET_FULL_HASHCHAIN":
        return repository.getFullHashchain(payload.hashchainId);

      case "SYNC_HASHCHAIN_INDEX":
        return repository.syncHashchainIndex(
          payload.hashchainId,
          payload.newIndex
        );

      case "UPDATE_HASHCHAIN":
        return repository.updateHashchain(payload.hashchainId, payload.data);

      case "IMPORT_HASHCHAIN":
        return repository.importHashchain(payload.data);
    }
  };

  handleRequest()
    .then(sendResponse)
    .catch((error) => sendResponse({ error: error.message }));

  return true;
});
