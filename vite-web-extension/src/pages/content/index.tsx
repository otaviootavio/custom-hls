console.log("Content script loaded");

// Add target origin check
const targetOrigin = window.location.origin;
console.log("Content script initialized with origin:", targetOrigin);

window.postMessage(
  { 
      source: "CONTENT_SCRIPT", 
      type: "READY" 
  },
  window.location.origin
);
console.log("Content script ready message sent");


window.addEventListener("message", async (event) => {
  // Add origin check
  if (event.origin !== targetOrigin) {
    console.log(
      "Content script ignoring message from different origin:",
      event.origin
    );
    return;
  }

  console.log("Content script received message:", {
    data: event.data,
    origin: event.origin,
    source: event.source,
  });

  if (event.data && event.data.source === "WEBSITE") {
    const { type, payload } = event.data;
    console.log("Content script processing WEBSITE message:", {
      type,
      payload,
    });

    try {
      // Add log before sending to background
      console.log("Content script sending to background:", { type, payload });

      const response = await chrome.runtime.sendMessage({
        type,
        payload,
      });

      console.log("Content script got background response:", response);

      // Send response back with explicit origin
      window.postMessage(
        {
          source: "CONTENT_SCRIPT",
          type: `${type}_RESPONSE`,
          payload: response,
        },
        targetOrigin // Use explicit origin
      );
      console.log("Content script sent response back to website");
    } catch (err) {
      console.error("Content script error:", err);
    }
  }
});
