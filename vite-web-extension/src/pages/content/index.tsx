const targetOrigin = window.location.origin;
console.log("Content script initialized with origin:", targetOrigin);

// Helper function to send messages to webpage
const sendToWebpage = (message: any) => {
  window.postMessage(message, targetOrigin);
  console.log("Content script -> Webpage:", message);
};

// Helper function to handle messages to background
const sendToBackground = async (type: string, payload: any) => {
  console.log("Content script -> Background:", { type, payload });
  try {
    const response = await chrome.runtime.sendMessage({ type, payload });
    console.log("Background -> Content script:", response);
    return response;
  } catch (err) {
    console.error("Background communication error:", err);
    throw err;
  }
};

// Initialize content script
sendToWebpage({
  source: "CONTENT_SCRIPT",
  type: "READY",
});

// Handle messages from webpage
window.addEventListener("message", async (event) => {
  // Security: Check origin
  if (event.origin !== targetOrigin) {
    console.log("Ignored message from different origin:", event.origin);
    return;
  }

  const { data } = event;
  if (data?.source !== "WEBSITE") return;

  const { type, payload } = data;
  try {
    const response = await sendToBackground(type, payload);
    sendToWebpage({
      source: "CONTENT_SCRIPT",
      type: `${type}_RESPONSE`,
      payload: response,
    });
  } catch (err) {
    console.error("Message handling error:", err);
  }
});

// Handle messages from extension
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "HASHCHAIN_SELECTION_CHANGED") {
    sendToWebpage({
      source: "CONTENT_SCRIPT",
      type: "HASHCHAIN_SELECTION_CHANGED",
      hashchainId: message.hashchainId,
    });
  }
});
