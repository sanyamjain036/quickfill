import "webextension-polyfill";

console.log("background loaded");
console.log(
  "Edit 'apps/chrome-extension/lib/background/index.ts' and save to reload."
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "showPopup") {
    // chrome.tabs.sendMessage(sender.tab.id, message);
  }
  console.log("message", message);
});
