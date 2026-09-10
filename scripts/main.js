import {
  disableBubblePan,
  hideCorePanSetting,
  installSettingsGuard,
  removePanSettingControl
} from "./core.js";

const MODULE_ID = "no-chat-pan";

// The core ChatBubbles class reads core.chatBubblesPan immediately before
// moving the canvas. Override only that read, in memory, for this page load.
Hooks.once("init", () => {
  const guarded = installSettingsGuard(game.settings);
  const hidden = hideCorePanSetting(game.settings);
  console.info(`${MODULE_ID} | Chat camera pan disabled (guarded=${guarded}, hidden=${hidden})`);
});

// Foundry v13 and v14 expose the mutable bubble options through this hook. This
// is a second, precise barrier and does not block manual camera movement.
Hooks.on("chatBubbleHTML", (_token, _html, _message, options) => {
  disableBubblePan(options);
});

// Defensive UI cleanup for settings windows already prepared by another module.
Hooks.on("renderSettingsConfig", (_application, element) => {
  removePanSettingControl(element);
});
