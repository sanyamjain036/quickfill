import fs from "node:fs";
const packageJson = JSON.parse(fs.readFileSync("../package.json", "utf8"));

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = {
  manifest_version: 3,
  default_locale: "en",
  name: "QuickFill - Your Ultimate Form Autofiller",
  version: packageJson.version,
  description:
    "QuickFill simplifies the process of filling out online forms. Say goodbye to repetitive typing and hello to QuickFill!",
  permissions: ["storage", "scripting"],
  options_page: "options/index.html",
  action: {
    default_popup: "popup/index.html",
    default_icon: "icon-128.png",
  },
  icons: {
    128: "icon-128.png",
  },
  content_scripts: [
    {
      matches: ["http://*/*", "https://*/*", "<all_urls>"],
      js: ["content/index.iife.js"],
    },
    {
      matches: ["http://*/*", "https://*/*", "<all_urls>"],
      js: ["content-ui/index.iife.js"],
    },
    {
      matches: ["http://*/*", "https://*/*", "<all_urls>"],
      css: ["content.css"], // public folder
    },
  ],
  web_accessible_resources: [
    {
      resources: ["*.js", "*.css", "*.svg", "icon-128.png", "icon-34.png"],
      matches: ["*://*/*"],
    },
  ],
};

export default manifest;
