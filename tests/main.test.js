import test from "node:test";
import assert from "node:assert/strict";

test("Foundry initialization installs both chat-pan barriers", async () => {
  const once = new Map();
  const on = new Map();
  globalThis.Hooks = {
    once: (name, callback) => once.set(name, callback),
    on: (name, callback) => on.set(name, callback)
  };
  const panDefinition = { config: true };
  const stored = new Map([
    ["core.chatBubblesPan", true],
    ["core.chatBubbles", true]
  ]);
  globalThis.game = {
    settings: {
      settings: new Map([["core.chatBubblesPan", panDefinition]]),
      get(namespace, key) {
        return stored.get(`${namespace}.${key}`);
      }
    }
  };

  await import(`../scripts/main.js?test=${Date.now()}`);
  assert.ok(once.has("init"));
  assert.ok(on.has("chatBubbleHTML"));
  assert.ok(on.has("renderSettingsConfig"));

  once.get("init")();
  assert.equal(game.settings.get("core", "chatBubblesPan"), false);
  assert.equal(game.settings.get("core", "chatBubbles"), true);
  assert.equal(stored.get("core.chatBubblesPan"), true);
  assert.equal(panDefinition.config, false);

  const bubbleOptions = { pan: true };
  on.get("chatBubbleHTML")(null, null, "Hello", bubbleOptions);
  assert.equal(bubbleOptions.pan, false);

  delete globalThis.Hooks;
  delete globalThis.game;
});
