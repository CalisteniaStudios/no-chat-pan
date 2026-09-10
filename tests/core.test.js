import test from "node:test";
import assert from "node:assert/strict";

import {
  createSettingsGetGuard,
  disableBubblePan,
  hideCorePanSetting,
  installSettingsGuard,
  isChatPanSetting,
  PAN_SETTING_ID
} from "../scripts/core.js";

test("recognizes only the Foundry core chat-pan setting", () => {
  assert.equal(isChatPanSetting("core", "chatBubblesPan"), true);
  assert.equal(isChatPanSetting("core", "chatBubbles"), false);
  assert.equal(isChatPanSetting("some-module", "chatBubblesPan"), false);
});

test("bubble options always have panning disabled", () => {
  const options = { pan: true, requireVisible: true };
  assert.equal(disableBubblePan(options), true);
  assert.deepEqual(options, { pan: false, requireVisible: true });
  assert.equal(disableBubblePan(undefined), false);
});

test("settings guard returns false only for chat camera pan", () => {
  const settings = new Map([
    ["core.chatBubblesPan", true],
    ["core.chatBubbles", true],
    ["module.option", "unchanged"]
  ]);
  const context = {
    prefix: "context-preserved",
    get(namespace, key) {
      return { value: settings.get(`${namespace}.${key}`), context: this.prefix };
    }
  };
  const guarded = createSettingsGetGuard(context.get);
  assert.equal(guarded.call(context, "core", "chatBubblesPan"), false);
  assert.deepEqual(guarded.call(context, "core", "chatBubbles"), {
    value: true,
    context: "context-preserved"
  });
  assert.deepEqual(guarded.call(context, "module", "option"), {
    value: "unchanged",
    context: "context-preserved"
  });
});

test("guard installation is idempotent and does not persist a setting", () => {
  const stored = new Map([[PAN_SETTING_ID, true]]);
  const settings = {
    get(namespace, key) {
      return stored.get(`${namespace}.${key}`);
    }
  };
  assert.equal(installSettingsGuard(settings), true);
  const firstGuard = settings.get;
  assert.equal(installSettingsGuard(settings), true);
  assert.equal(settings.get, firstGuard);
  assert.equal(settings.get("core", "chatBubblesPan"), false);
  assert.equal(stored.get(PAN_SETTING_ID), true);
});

test("core option is hidden in memory while other settings remain visible", () => {
  const pan = { config: true };
  const bubbles = { config: true };
  const settings = {
    settings: new Map([
      [PAN_SETTING_ID, pan],
      ["core.chatBubbles", bubbles]
    ])
  };
  assert.equal(hideCorePanSetting(settings), true);
  assert.equal(pan.config, false);
  assert.equal(bubbles.config, true);
});
