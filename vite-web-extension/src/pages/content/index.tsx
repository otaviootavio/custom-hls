const targetOrigin = window.location.origin;
console.log(
  "[ContentScript] Content script initialized with origin:",
  targetOrigin
);

// Helper function to send messages to webpage
const sendToWebpage = (message: any) => {
  window.postMessage(message, targetOrigin);
  console.log("[ContentScript] Content script -> Webpage:", message);
};

// Helper function to handle messages to background
const sendToBackground = async (type: string, payload: any) => {
  console.log("[ContentScript] Content script -> Background:", {
    type,
    payload,
  });
  try {
    const response = await chrome.runtime.sendMessage({ type, payload });
    console.log("[ContentScript] Background -> Content script:", response);
    return response;
  } catch (err) {
    console.error("[ContentScript] Background communication error:", err);
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
  switch (message.type) {
    
    case "HASHCHAIN_SELECTION_CHANGED":
      console.log("[ContentScript] Received message from extension:", message);
      sendToWebpage({
        source: "CONTENT_SCRIPT",
        type: "HASHCHAIN_SELECTION_CHANGED",
        hashchainId: message.hashchainId,
      });
      return;
    case "AUTH_STATUS_CHANGED":
      console.log("[ContentScript] Auth status changed:", message.authStatus);
      sendToWebpage({
        source: "CONTENT_SCRIPT",
        type: "AUTH_STATUS_CHANGED",
        authStatus: message.authStatus,
      });
      return;
    default:
      console.log("[ContentScript] Unhandled message from extension:", message);
  }
});

const channel = new BroadcastChannel("fetch-intercept-channel");

// Handle messages from service worker
channel.onmessage = async (event) => {
  console.log("[ContentScript] Service Worker -> Content script:", event.data);

  const { type, url, method, body, timestamp } = event.data;

  if (type === "GET_NEXT_REQUEST_HEADER_FROM_BACKGROUND") {
    // Process the intercepted request
    console.log("[ContentScript] Received intercept request", {
      url,
      method,
      body,
      timestamp,
    });

    const selectedHashchain = await sendToBackground(
      "GET_SELECTED_HASHCHAIN",
      {}
    );
    const nextHash = await sendToBackground("GET_NEXT_HASH", {
      hashchainId: selectedHashchain.hashchainId,
    });

    // Here you can modify the request or add custom logic for /todos/1
    const response = {
      type: "INTERCEPT_RESPONSE",
      timestamp: Date.now(),
      data: {
        hashchainId: selectedHashchain.hashchainId,
        nextHash,
      },
    };

    channel.postMessage(response);
    console.log("[ContentScript] Content script -> Service Worker:", response);
  }
};
